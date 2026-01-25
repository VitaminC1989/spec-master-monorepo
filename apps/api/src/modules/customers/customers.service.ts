import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import {
  RefineFilter,
  buildPrismaWhere,
  buildPrismaPagination,
} from '../../common/utils/query-builder.util';

@Injectable()
export class CustomersService {
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
      this.prisma.customer.findMany({
        where,
        ...buildPrismaPagination(pagination.current, pagination.pageSize),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException(`客户 #${id} 不存在`);
    }

    return { data: customer };
  }

  async create(dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: {
        customerName: dto.customerName,
        contactPerson: dto.contactPerson,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        address: dto.address,
        note: dto.note,
      },
    });

    return { data: customer };
  }

  async update(id: number, dto: UpdateCustomerDto) {
    // 验证存在性
    await this.findOne(id);

    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        customerName: dto.customerName,
        contactPerson: dto.contactPerson,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        address: dto.address,
        note: dto.note,
      },
    });

    // 同步更新所有关联 Style 的 customerName
    if (dto.customerName !== undefined) {
      await this.prisma.style.updateMany({
        where: { customerId: id },
        data: { customerName: dto.customerName },
      });
    }

    return { data: customer };
  }

  async remove(id: number) {
    // 验证存在性
    const existing = await this.findOne(id);

    // 软删除
    await this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return existing;
  }
}
