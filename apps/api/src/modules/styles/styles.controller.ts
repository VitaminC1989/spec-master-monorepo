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
import { StylesService } from './styles.service';
import { CreateStyleDto, UpdateStyleDto, StyleResponseDto, StyleListResponseDto } from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('Styles')
@Controller('api/styles')
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get()
  @ApiOperation({ summary: '获取款号列表' })
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
  @ApiResponse({ status: 200, description: '返回款号列表和总数', type: StyleListResponseDto })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.stylesService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取款号详情' })
  @ApiParam({ name: 'id', type: Number, description: '款号ID' })
  @ApiResponse({ status: 200, description: '返回款号详情（含颜色版本）', type: StyleResponseDto })
  @ApiResponse({ status: 404, description: '款号不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stylesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建款号' })
  @ApiResponse({ status: 201, description: '款号创建成功', type: StyleResponseDto })
  async create(@Body() createStyleDto: CreateStyleDto) {
    return this.stylesService.create(createStyleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新款号' })
  @ApiParam({ name: 'id', type: Number, description: '款号ID' })
  @ApiResponse({ status: 200, description: '款号更新成功', type: StyleResponseDto })
  @ApiResponse({ status: 404, description: '款号不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStyleDto: UpdateStyleDto,
  ) {
    return this.stylesService.update(id, updateStyleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除款号（含级联删除）' })
  @ApiParam({ name: 'id', type: Number, description: '款号ID' })
  @ApiResponse({
    status: 200,
    description: '款号删除成功（级联删除所有颜色版本、配料、规格）',
  })
  @ApiResponse({ status: 404, description: '款号不存在' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.stylesService.remove(id);
  }
}
