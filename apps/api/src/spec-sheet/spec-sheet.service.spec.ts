import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // 导入刚才写的 PrismaService

@Injectable()
export class SpecSheetService {
  // 1. 注入 Prisma
  constructor(private prisma: PrismaService) {}

  // 2. 创建规格单
  async create(createSpecSheetDto: any) {
    // 暂时用 any，后面我们要学 DTO
    return this.prisma.specSheet.create({
      data: {
        title: createSpecSheetDto.title,
        content: createSpecSheetDto.content, // 直接存 JSON
        userId: '1', // 因为还没做登录，先写死一个假 ID (你需要先在数据库手动加个用户，或者这里先删掉 User 关联)
        // ⚠️ 注意：如果你上一条 schema 里写了 userId 必填，
        // 你必须先在数据库里创建一个 User，拿到他的 id (uuid)，填在这里。
        // 或者简单点：先去 schema.prisma 把 userId 和 user 删了，重新 push，先跑通单表。
      },
    });
  }

  // 3. 查询所有单子
  findAll() {
    return this.prisma.specSheet.findMany();
  }
}
