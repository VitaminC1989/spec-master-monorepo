import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBomItemDto, UpdateBomItemDto } from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class BomItemsService {
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
      this.prisma.bOMItem.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { sortOrder: 'asc' },
        include: {
          specDetails: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.bOMItem.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const bomItem = await this.prisma.bOMItem.findUnique({
      where: { id, deletedAt: null },
      include: {
        specDetails: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!bomItem) {
      throw new NotFoundException(`配料明细 #${id} 不存在`);
    }

    return { data: bomItem };
  }

  async create(dto: CreateBomItemDto) {
    const bomItem = await this.prisma.bOMItem.create({
      data: {
        variantId: dto.variantId,
        materialName: dto.materialName,
        materialImageUrl: dto.materialImageUrl,
        materialColorText: dto.materialColorText,
        materialColorImageUrl: dto.materialColorImageUrl,
        usage: dto.usage,
        unit: dto.unit,
        supplier: dto.supplier,
        sortOrder: dto.sortOrder ?? 0,
        // 嵌套创建规格明细
        specDetails: dto.specDetails
          ? {
              create: dto.specDetails.map((spec) => ({
                size: spec.size,
                specValue: spec.specValue,
                specUnit: spec.specUnit,
                sortOrder: spec.sortOrder ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        specDetails: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return { data: bomItem };
  }

  async update(id: number, dto: UpdateBomItemDto) {
    // 验证存在性
    await this.findOne(id);

    // 使用事务处理更新和规格明细的替换
    const bomItem = await this.prisma.$transaction(async (tx) => {
      // 更新配料明细基本信息
      const updateData: any = {};

      if (dto.materialName !== undefined)
        updateData.materialName = dto.materialName;
      if (dto.materialImageUrl !== undefined)
        updateData.materialImageUrl = dto.materialImageUrl;
      if (dto.materialColorText !== undefined)
        updateData.materialColorText = dto.materialColorText;
      if (dto.materialColorImageUrl !== undefined)
        updateData.materialColorImageUrl = dto.materialColorImageUrl;
      if (dto.usage !== undefined) updateData.usage = dto.usage;
      if (dto.unit !== undefined) updateData.unit = dto.unit;
      if (dto.supplier !== undefined) updateData.supplier = dto.supplier;
      if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

      await tx.bOMItem.update({
        where: { id },
        data: updateData,
      });

      // 如果提供了 specDetails，执行替换操作
      if (dto.specDetails !== undefined) {
        // 删除旧的规格明细
        await tx.specDetail.deleteMany({
          where: { bomItemId: id },
        });

        // 创建新的规格明细
        if (dto.specDetails.length > 0) {
          await tx.specDetail.createMany({
            data: dto.specDetails.map((spec) => ({
              bomItemId: id,
              size: spec.size,
              specValue: spec.specValue,
              specUnit: spec.specUnit,
              sortOrder: spec.sortOrder ?? 0,
            })),
          });
        }
      }

      // 返回更新后的完整数据
      return tx.bOMItem.findUnique({
        where: { id },
        include: {
          specDetails: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });

    return { data: bomItem };
  }

  async remove(id: number) {
    // 验证存在性
    const existing = await this.findOne(id);

    // 使用事务删除
    await this.prisma.$transaction(async (tx) => {
      // 1. 删除所有规格明细（硬删除）
      await tx.specDetail.deleteMany({
        where: { bomItemId: id },
      });

      // 2. 软删除配料明细
      await tx.bOMItem.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });

    return existing;
  }
}
