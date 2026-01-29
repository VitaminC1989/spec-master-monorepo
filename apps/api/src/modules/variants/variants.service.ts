import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  CreateVariantDto,
  UpdateVariantDto,
  CloneVariantDto,
  CloneVariantResponseDto,
} from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: RefineFilter[],
    pagination: { current: number; pageSize: number },
  ) {
    const where = {
      ...buildPrismaWhere(filters),
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      this.prisma.colorVariant.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.colorVariant.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const variant = await this.prisma.colorVariant.findUnique({
      where: { id, deletedAt: null },
      include: {
        bomItems: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            specDetails: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`颜色版本 #${id} 不存在`);
    }

    return { data: variant };
  }

  async create(dto: CreateVariantDto) {
    // 检查同一款号下颜色名称是否唯一
    const existing = await this.prisma.colorVariant.findFirst({
      where: {
        styleId: dto.styleId,
        colorName: dto.colorName,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(
        `颜色名称 "${dto.colorName}" 在该款号下已存在`,
      );
    }

    const variant = await this.prisma.colorVariant.create({
      data: {
        styleId: dto.styleId,
        colorName: dto.colorName,
        sampleImageUrl: dto.sampleImageUrl,
        sizeRange: dto.sizeRange,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    return { data: variant };
  }

  async update(id: number, dto: UpdateVariantDto) {
    // 验证存在性
    const existingVariant = await this.prisma.colorVariant.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingVariant) {
      throw new NotFoundException(`颜色版本 #${id} 不存在`);
    }

    // 如果更新了颜色名称，检查唯一性
    if (dto.colorName && dto.colorName !== existingVariant.colorName) {
      const duplicate = await this.prisma.colorVariant.findFirst({
        where: {
          styleId: dto.styleId ?? existingVariant.styleId,
          colorName: dto.colorName,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `颜色名称 "${dto.colorName}" 在该款号下已存在`,
        );
      }
    }

    const variant = await this.prisma.colorVariant.update({
      where: { id },
      data: {
        colorName: dto.colorName,
        sampleImageUrl: dto.sampleImageUrl,
        sizeRange: dto.sizeRange,
        sortOrder: dto.sortOrder,
      },
    });

    return { data: variant };
  }

  async remove(id: number) {
    // 验证存在性
    const existing = await this.findOne(id);

    // 软删除（使用事务确保级联）
    await this.prisma.$transaction(async (tx) => {
      // 1. 删除所有规格明细（L4 硬删除）
      await tx.specDetail.deleteMany({
        where: {
          bomItem: { variantId: id },
        },
      });

      // 2. 软删除所有配料明细
      await tx.bOMItem.updateMany({
        where: { variantId: id },
        data: { deletedAt: new Date() },
      });

      // 3. 软删除颜色版本，同时释放唯一约束
      await tx.colorVariant.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          colorName: `${existing.data.colorName}_DEL_${id}`,
        },
      });
    });

    return existing;
  }

  /**
   * 深度克隆颜色版本
   * 复制 ColorVariant + 所有 BOMItem + 所有 SpecDetail
   */
  async cloneVariant(
    styleId: number,
    variantId: number,
    dto: CloneVariantDto,
  ): Promise<CloneVariantResponseDto> {
    // 1. 验证源颜色版本存在且属于指定款号
    const sourceVariant = await this.prisma.colorVariant.findFirst({
      where: {
        id: variantId,
        styleId,
        deletedAt: null,
      },
      include: {
        bomItems: {
          where: { deletedAt: null },
          include: {
            specDetails: true,
          },
        },
      },
    });

    if (!sourceVariant) {
      throw new NotFoundException(
        `颜色版本 #${variantId} 不存在或不属于款号 #${styleId}`,
      );
    }

    // 2. 检查新颜色名称是否已存在
    const existingVariant = await this.prisma.colorVariant.findFirst({
      where: {
        styleId,
        colorName: dto.newColorName,
        deletedAt: null,
      },
    });

    if (existingVariant) {
      throw new ConflictException(
        `颜色名称 "${dto.newColorName}" 在该款号下已存在`,
      );
    }

    // 3. 执行深度克隆（使用事务）
    let clonedBomCount = 0;
    let clonedSpecCount = 0;

    const newVariant = await this.prisma.$transaction(async (tx) => {
      // 3.1 创建新的颜色版本
      const variant = await tx.colorVariant.create({
        data: {
          styleId,
          colorName: dto.newColorName,
          sampleImageUrl:
            dto.copySampleImage !== false ? sourceVariant.sampleImageUrl : null,
          sizeRange: sourceVariant.sizeRange,
          sortOrder: sourceVariant.sortOrder,
          clonedFromId: variantId,
        },
      });

      // 3.2 复制所有配料明细
      for (const bomItem of sourceVariant.bomItems) {
        const newBomItem = await tx.bOMItem.create({
          data: {
            variantId: variant.id,
            materialName: bomItem.materialName,
            materialImageUrl: bomItem.materialImageUrl,
            materialColorText: bomItem.materialColorText,
            materialColorImageUrl: bomItem.materialColorImageUrl,
            usage: bomItem.usage,
            unit: bomItem.unit,
            supplier: bomItem.supplier,
            sortOrder: bomItem.sortOrder,
          },
        });
        clonedBomCount++;

        // 3.3 复制所有规格明细
        for (const specDetail of bomItem.specDetails) {
          await tx.specDetail.create({
            data: {
              bomItemId: newBomItem.id,
              size: specDetail.size,
              specValue: specDetail.specValue,
              specUnit: specDetail.specUnit,
              sortOrder: specDetail.sortOrder,
            },
          });
          clonedSpecCount++;
        }
      }

      return variant;
    });

    return {
      id: newVariant.id,
      colorName: newVariant.colorName,
      clonedBomCount: clonedBomCount,
      clonedSpecCount: clonedSpecCount,
    };
  }
}
