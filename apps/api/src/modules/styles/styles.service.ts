import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateStyleDto, UpdateStyleDto } from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class StylesService {
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
      this.prisma.style.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { customerName: true } },
        },
      }),
      this.prisma.style.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const style = await this.prisma.style.findUnique({
      where: { id, deletedAt: null },
      include: {
        customer: { select: { customerName: true } },
        colorVariants: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!style) {
      throw new NotFoundException(`款号 #${id} 不存在`);
    }

    return { data: style };
  }

  async create(dto: CreateStyleDto) {
    // 自动同步 customer_name
    let customerName: string | null = null;
    if (dto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: dto.customerId },
      });
      customerName = customer?.customerName || null;
    }

    const style = await this.prisma.style.create({
      data: {
        styleNo: dto.styleNo,
        styleName: dto.styleName,
        customerId: dto.customerId,
        customerName,
        publicNote: dto.publicNote,
      },
    });

    return { data: style };
  }

  async update(id: number, dto: UpdateStyleDto) {
    // 验证存在性
    await this.findOne(id);

    // 如果更新了 customer_id，同步更新 customer_name
    let customerName: string | null | undefined;
    if (dto.customerId !== undefined) {
      if (dto.customerId === null) {
        customerName = null;
      } else {
        const customer = await this.prisma.customer.findUnique({
          where: { id: dto.customerId },
        });
        customerName = customer?.customerName;
      }
    }

    const updateData: any = {
      styleNo: dto.styleNo,
      styleName: dto.styleName,
      publicNote: dto.publicNote,
    };

    if (dto.customerId !== undefined) {
      updateData.customerId = dto.customerId;
      updateData.customerName = customerName;
    }

    const style = await this.prisma.style.update({
      where: { id },
      data: updateData,
    });

    return { data: style };
  }

  async remove(id: number) {
    // 验证存在性
    const existing = await this.findOne(id);

    // 软删除（使用事务确保级联）
    await this.prisma.$transaction(async (tx) => {
      // 1. 获取所有颜色版本
      const variants = await tx.colorVariant.findMany({
        where: { styleId: id, deletedAt: null },
        select: { id: true },
      });
      const variantIds = variants.map((v) => v.id);

      if (variantIds.length > 0) {
        // 2. 删除所有规格明细（L4 硬删除）
        await tx.specDetail.deleteMany({
          where: {
            bomItem: { variantId: { in: variantIds } },
          },
        });

        // 3. 软删除所有配料明细
        await tx.bOMItem.updateMany({
          where: { variantId: { in: variantIds } },
          data: { deletedAt: new Date() },
        });

        // 4. 软删除所有颜色版本
        await tx.colorVariant.updateMany({
          where: { id: { in: variantIds } },
          data: { deletedAt: new Date() },
        });
      }

      // 5. 软删除款号
      await tx.style.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });

    return existing;
  }
}
