import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecSheetDto } from './dto/create-spec-sheet.dto';
import { UpdateSpecSheetDto } from './dto/update-spec-sheet.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SpecSheetService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建规格单
  async create(createSpecSheetDto: CreateSpecSheetDto) {
    return this.prisma.specSheet.create({
      data: {
        title: createSpecSheetDto.title,
        content: createSpecSheetDto.content,
        userId: createSpecSheetDto.userId,
        status: createSpecSheetDto.status || 'DRAFT',
      },
      include: {
        user: true, // 返回关联的用户信息
      },
    });
  }

  // 查询所有规格单
  async findAll() {
    return this.prisma.specSheet.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 根据 ID 查询单个规格单
  async findOne(id: number) {
    const specSheet = await this.prisma.specSheet.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!specSheet) {
      throw new NotFoundException(`规格单 #${id} 不存在`);
    }

    return specSheet;
  }

  // 更新规格单
  async update(id: number, updateSpecSheetDto: UpdateSpecSheetDto) {
    // 先检查是否存在
    await this.findOne(id);

    return this.prisma.specSheet.update({
      where: { id },
      data: updateSpecSheetDto,
      include: {
        user: true,
      },
    });
  }

  // 删除规格单
  async remove(id: number) {
    // 先检查是否存在
    await this.findOne(id);

    return this.prisma.specSheet.delete({
      where: { id },
    });
  }

  // 根据用户 ID 查询规格单
  async findByUserId(userId: string) {
    return this.prisma.specSheet.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 根据状态查询规格单
  async findByStatus(status: string) {
    return this.prisma.specSheet.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
