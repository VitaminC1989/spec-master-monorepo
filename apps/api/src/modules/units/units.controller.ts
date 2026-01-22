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
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto, UnitListResponseDto } from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('Units')
@Controller('api/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: '获取单位列表' })
  @ApiQuery({ name: 'filters', required: false })
  @ApiQuery({ name: 'pagination', required: false })
  @ApiResponse({ status: 200, description: '返回单位列表和总数', type: UnitListResponseDto })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.unitsService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单位详情' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '返回单位详情', type: UnitResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建单位' })
  @ApiResponse({ status: 201, description: '创建成功', type: UnitResponseDto })
  async create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新单位' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '更新成功', type: UnitResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUnitDto) {
    return this.unitsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除单位' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitsService.remove(id);
  }
}
