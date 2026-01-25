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
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SizesService } from './sizes.service';
import { CreateSizeDto, UpdateSizeDto, SizeResponseDto, SizeListResponseDto } from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('Sizes')
@Controller('api/sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Get()
  @ApiOperation({ summary: '获取尺码列表' })
  @ApiQuery({ name: 'filters', required: false })
  @ApiQuery({ name: 'pagination', required: false })
  @ApiResponse({ status: 200, description: '返回尺码列表和总数', type: SizeListResponseDto })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.sizesService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取尺码详情' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '返回尺码详情', type: SizeResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sizesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建尺码' })
  @ApiResponse({ status: 201, description: '创建成功', type: SizeResponseDto })
  async create(@Body() dto: CreateSizeDto) {
    return this.sizesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新尺码' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '更新成功', type: SizeResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSizeDto) {
    return this.sizesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除尺码' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sizesService.remove(id);
  }
}
