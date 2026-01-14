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
import { VariantsService } from './variants.service';
import {
  CreateVariantDto,
  UpdateVariantDto,
  CloneVariantDto,
  CloneVariantResponseDto,
} from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('Variants')
@Controller('api')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get('variants')
  @ApiOperation({ summary: '获取颜色版本列表' })
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
  @ApiResponse({ status: 200, description: '返回颜色版本列表和总数' })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.variantsService.findAll(filters, pagination);
  }

  @Get('variants/:id')
  @ApiOperation({ summary: '获取颜色版本详情' })
  @ApiParam({ name: 'id', type: Number, description: '颜色版本ID' })
  @ApiResponse({
    status: 200,
    description: '返回颜色版本详情（含配料和规格）',
  })
  @ApiResponse({ status: 404, description: '颜色版本不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.findOne(id);
  }

  @Post('variants')
  @ApiOperation({ summary: '创建颜色版本' })
  @ApiResponse({ status: 201, description: '颜色版本创建成功' })
  @ApiResponse({ status: 409, description: '颜色名称已存在' })
  async create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @Put('variants/:id')
  @ApiOperation({ summary: '更新颜色版本' })
  @ApiParam({ name: 'id', type: Number, description: '颜色版本ID' })
  @ApiResponse({ status: 200, description: '颜色版本更新成功' })
  @ApiResponse({ status: 404, description: '颜色版本不存在' })
  @ApiResponse({ status: 409, description: '颜色名称已存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.variantsService.update(id, updateVariantDto);
  }

  @Delete('variants/:id')
  @ApiOperation({ summary: '删除颜色版本（含级联删除）' })
  @ApiParam({ name: 'id', type: Number, description: '颜色版本ID' })
  @ApiResponse({
    status: 200,
    description: '颜色版本删除成功（级联删除所有配料、规格）',
  })
  @ApiResponse({ status: 404, description: '颜色版本不存在' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.remove(id);
  }

  @Post('styles/:styleId/variants/:variantId/clone')
  @ApiOperation({ summary: '深度克隆颜色版本' })
  @ApiParam({ name: 'styleId', type: Number, description: '款号ID' })
  @ApiParam({ name: 'variantId', type: Number, description: '源颜色版本ID' })
  @ApiResponse({
    status: 201,
    type: CloneVariantResponseDto,
    description: '克隆成功',
  })
  @ApiResponse({ status: 404, description: '颜色版本不存在' })
  @ApiResponse({ status: 409, description: '目标颜色名称已存在' })
  async cloneVariant(
    @Param('styleId', ParseIntPipe) styleId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() dto: CloneVariantDto,
  ) {
    const result = await this.variantsService.cloneVariant(
      styleId,
      variantId,
      dto,
    );
    return { data: result };
  }
}
