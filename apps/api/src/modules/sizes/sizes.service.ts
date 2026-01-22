import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSizeDto, UpdateSizeDto } from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class SizesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: RefineFilter[],
    pagination: { current: number; pageSize: number },
  ) {
    const where = buildPrismaWhere(filters);

    const [data, total] = await Promise.all([
      this.prisma.size.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.size.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const size = await this.prisma.size.findUnique({ where: { id } });
    if (!size) {
      throw new NotFoundException(`尺码 #${id} 不存在`);
    }
    return { data: size };
  }

  async create(dto: CreateSizeDto) {
    const size = await this.prisma.size.create({
      data: {
        sizeCode: dto.sizeCode,
        sizeName: dto.sizeName,
        sortOrder: dto.sortOrder ?? 0,
        note: dto.note,
        isActive: dto.isActive ?? true,
      },
    });
    return { data: size };
  }

  async update(id: number, dto: UpdateSizeDto) {
    await this.findOne(id);
    const size = await this.prisma.size.update({
      where: { id },
      data: {
        sizeCode: dto.sizeCode,
        sizeName: dto.sizeName,
        sortOrder: dto.sortOrder,
        note: dto.note,
        isActive: dto.isActive,
      },
    });
    return { data: size };
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.prisma.size.delete({ where: { id } });
    return existing;
  }
}
