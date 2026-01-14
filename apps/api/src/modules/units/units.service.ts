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
      data: data.map((item) => this.transformToSnakeCase(item)),
      total,
    };
  }

  async findOne(id: number) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`单位 #${id} 不存在`);
    }
    return { data: this.transformToSnakeCase(unit) };
  }

  async create(dto: CreateUnitDto) {
    const unit = await this.prisma.unit.create({
      data: {
        unitCode: dto.unit_code,
        unitName: dto.unit_name,
        unitType: dto.unit_type,
        note: dto.note,
        isActive: dto.is_active ?? true,
      },
    });
    return { data: this.transformToSnakeCase(unit) };
  }

  async update(id: number, dto: UpdateUnitDto) {
    await this.findOne(id);
    const unit = await this.prisma.unit.update({
      where: { id },
      data: {
        unitCode: dto.unit_code,
        unitName: dto.unit_name,
        unitType: dto.unit_type,
        note: dto.note,
        isActive: dto.is_active,
      },
    });
    return { data: this.transformToSnakeCase(unit) };
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.prisma.unit.delete({ where: { id } });
    return existing;
  }

  private transformToSnakeCase(unit: any) {
    return {
      id: unit.id,
      unit_code: unit.unitCode,
      unit_name: unit.unitName,
      unit_type: unit.unitType,
      note: unit.note,
      is_active: unit.isActive,
    };
  }
}
