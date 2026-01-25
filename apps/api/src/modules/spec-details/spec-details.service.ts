import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSpecDetailDto, UpdateSpecDetailDto } from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class SpecDetailsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: RefineFilter[],
    pagination: { current: number; pageSize: number },
  ) {
    const where = buildPrismaWhere(filters);

    const [data, total] = await Promise.all([
      this.prisma.specDetail.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.specDetail.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const specDetail = await this.prisma.specDetail.findUnique({
      where: { id },
    });

    if (!specDetail) {
      throw new NotFoundException(`规格明细 #${id} 不存在`);
    }

    return { data: specDetail };
  }

  async create(dto: CreateSpecDetailDto) {
    const specDetail = await this.prisma.specDetail.create({
      data: {
        bomItemId: dto.bomItemId,
        size: dto.size,
        specValue: dto.specValue,
        specUnit: dto.specUnit,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    return { data: specDetail };
  }

  async update(id: number, dto: UpdateSpecDetailDto) {
    // 验证存在性
    await this.findOne(id);

    const specDetail = await this.prisma.specDetail.update({
      where: { id },
      data: {
        size: dto.size,
        specValue: dto.specValue,
        specUnit: dto.specUnit,
        sortOrder: dto.sortOrder,
      },
    });

    return { data: specDetail };
  }

  async remove(id: number) {
    // 验证存在性
    const existing = await this.findOne(id);

    // 硬删除
    await this.prisma.specDetail.delete({
      where: { id },
    });

    return existing;
  }
}
