import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SpecSheetService } from './spec-sheet.service';
import { CreateSpecSheetDto } from './dto/create-spec-sheet.dto';
import { UpdateSpecSheetDto } from './dto/update-spec-sheet.dto';

@ApiTags('规格单管理')
@Controller('spec-sheets')
export class SpecSheetController {
  constructor(private readonly specSheetService: SpecSheetService) {}

  @Post()
  @ApiOperation({ summary: '创建规格单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() createSpecSheetDto: CreateSpecSheetDto) {
    return this.specSheetService.create(createSpecSheetDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有规格单' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query('status') status?: string) {
    if (status) {
      return this.specSheetService.findByStatus(status);
    }
    return this.specSheetService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '根据用户ID获取规格单' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findByUserId(@Param('userId') userId: string) {
    return this.specSheetService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取规格单详情' })
  @ApiParam({ name: 'id', description: '规格单ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '规格单不存在' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specSheetService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新规格单' })
  @ApiParam({ name: 'id', description: '规格单ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '规格单不存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecSheetDto: UpdateSpecSheetDto,
  ) {
    return this.specSheetService.update(id, updateSpecSheetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除规格单' })
  @ApiParam({ name: 'id', description: '规格单ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '规格单不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.specSheetService.remove(id);
  }
}
