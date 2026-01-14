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
      data: data.map((item) => this.transformToSnakeCase(item)),
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

    return { data: this.transformToSnakeCase(customer) };
  }

  async create(dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: {
        customerName: dto.customer_name,
        contactPerson: dto.contact_person,
        contactPhone: dto.contact_phone,
        contactEmail: dto.contact_email,
        address: dto.address,
        note: dto.note,
      },
    });

    return { data: this.transformToSnakeCase(customer) };
  }

  async update(id: number, dto: UpdateCustomerDto) {
    // 验证存在性
    await this.findOne(id);

    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        customerName: dto.customer_name,
        contactPerson: dto.contact_person,
        contactPhone: dto.contact_phone,
        contactEmail: dto.contact_email,
        address: dto.address,
        note: dto.note,
      },
    });

    // 同步更新所有关联 Style 的 customerName
    if (dto.customer_name !== undefined) {
      await this.prisma.style.updateMany({
        where: { customerId: id },
        data: { customerName: dto.customer_name },
      });
    }

    return { data: this.transformToSnakeCase(customer) };
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

  private transformToSnakeCase(customer: any) {
    return {
      id: customer.id,
      customer_name: customer.customerName,
      contact_person: customer.contactPerson,
      contact_phone: customer.contactPhone,
      contact_email: customer.contactEmail,
      address: customer.address,
      note: customer.note,
      is_active: customer.isActive,
      created_at: customer.createdAt?.toISOString(),
      updated_at: customer.updatedAt?.toISOString(),
    };
  }
}
