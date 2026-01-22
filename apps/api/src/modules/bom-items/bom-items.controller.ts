import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { BomItemsService } from './bom-items.service';
import { CreateBomItemDto, UpdateBomItemDto, BOMItemResponseDto, BOMItemListResponseDto } from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('BOM Items')
@Controller('api/bom-items')
export class BomItemsController {
  constructor(private readonly bomItemsService: BomItemsService) {}

  @Get()
  @ApiOperation({ summary: '获取配料明细列表' })
  @ApiQuery({
    name: 'filters',
    required: false,
    description: 'Refine filters JSON',
  })
  @ApiQuery({
    name: 'pagination',
    required: false,
    description: 'Refine pagination JSON',
  })
  @ApiResponse({ status: 200, description: '返回配料明细列表和总数', type: BOMItemListResponseDto })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.bomItemsService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取配料明细详情' })
  @ApiParam({ name: 'id', type: Number, description: '配料明细ID' })
  @ApiResponse({ status: 200, description: '返回配料明细详情（含规格明细）', type: BOMItemResponseDto })
  @ApiResponse({ status: 404, description: '配料明细不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bomItemsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建配料明细' })
  @ApiResponse({ status: 201, description: '配料明细创建成功', type: BOMItemResponseDto })
  async create(@Body() createBomItemDto: CreateBomItemDto) {
    return this.bomItemsService.create(createBomItemDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新配料明细' })
  @ApiParam({ name: 'id', type: Number, description: '配料明细ID' })
  @ApiResponse({ status: 200, description: '配料明细更新成功', type: BOMItemResponseDto })
  @ApiResponse({ status: 404, description: '配料明细不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBomItemDto: UpdateBomItemDto,
  ) {
    return this.bomItemsService.update(id, updateBomItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除配料明细（含级联删除规格）' })
  @ApiParam({ name: 'id', type: Number, description: '配料明细ID' })
  @ApiResponse({
    status: 200,
    description: '配料明细删除成功（级联删除所有规格明细）',
  })
  @ApiResponse({ status: 404, description: '配料明细不存在' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bomItemsService.remove(id);
  }
}
