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
import { CreateSpecDetailDto, UpdateSpecDetailDto } from './dto';
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specDetailsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建规格明细' })
  async create(@Body() createSpecDetailDto: CreateSpecDetailDto) {
    return this.specDetailsService.create(createSpecDetailDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新规格明细' })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecDetailDto: UpdateSpecDetailDto,
  ) {
    return this.specDetailsService.update(id, updateSpecDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除规格明细' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.specDetailsService.remove(id);
  }
}
