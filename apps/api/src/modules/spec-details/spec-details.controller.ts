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
import { SpecDetailsService } from './spec-details.service';
import { CreateSpecDetailDto, UpdateSpecDetailDto, SpecDetailResponseDto, SpecDetailListResponseDto } from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('Spec Details')
@Controller('api/spec-details')
export class SpecDetailsController {
  constructor(private readonly specDetailsService: SpecDetailsService) {}

  @Get()
  @ApiOperation({ summary: '获取规格明细列表' })
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
  @ApiResponse({ status: 200, description: '返回规格明细列表和总数', type: SpecDetailListResponseDto })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.specDetailsService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取规格明细详情' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '返回规格明细详情', type: SpecDetailResponseDto })
  @ApiResponse({ status: 404, description: '规格明细不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specDetailsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建规格明细' })
  @ApiResponse({ status: 201, description: '创建成功', type: SpecDetailResponseDto })
  async create(@Body() createSpecDetailDto: CreateSpecDetailDto) {
    return this.specDetailsService.create(createSpecDetailDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新规格明细' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '更新成功', type: SpecDetailResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecDetailDto: UpdateSpecDetailDto,
  ) {
    return this.specDetailsService.update(id, updateSpecDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除规格明细' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.specDetailsService.remove(id);
  }
}
