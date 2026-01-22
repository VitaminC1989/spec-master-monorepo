import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUnitDto, UpdateUnitDto } from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: RefineFilter[],
    pagination: { current: number; pageSize: number },
  ) {
    const where = buildPrismaWhere(filters);

    const [data, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`单位 #${id} 不存在`);
    }
    return { data: unit };
  }

  async create(dto: CreateUnitDto) {
    const unit = await this.prisma.unit.create({
      data: {
        unitCode: dto.unitCode,
        unitName: dto.unitName,
        unitType: dto.unitType,
        note: dto.note,
        isActive: dto.isActive ?? true,
      },
    });
    return { data: unit };
  }

  async update(id: number, dto: UpdateUnitDto) {
    await this.findOne(id);
    const unit = await this.prisma.unit.update({
      where: { id },
      data: {
        unitCode: dto.unitCode,
        unitName: dto.unitName,
        unitType: dto.unitType,
        note: dto.note,
        isActive: dto.isActive,
      },
    });
    return { data: unit };
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.prisma.unit.delete({ where: { id } });
    return existing;
  }
}
