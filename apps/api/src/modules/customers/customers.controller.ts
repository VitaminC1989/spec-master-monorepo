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
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto, CustomerListResponseDto } from './dto';
import {
  ParseFiltersPipe,
  ParsePaginationPipe,
} from '../../common/pipes/parse-filters.pipe';

@ApiTags('Customers')
@Controller('api/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: '获取客户列表' })
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
  @ApiResponse({ status: 200, description: '返回客户列表和总数', type: CustomerListResponseDto })
  async findAll(
    @Query('filters', ParseFiltersPipe) filters: any[],
    @Query('pagination', ParsePaginationPipe)
    pagination: { current: number; pageSize: number },
  ) {
    return this.customersService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  @ApiParam({ name: 'id', type: Number, description: '客户ID' })
  @ApiResponse({ status: 200, description: '返回客户详情', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: '客户不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 201, description: '客户创建成功', type: CustomerResponseDto })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新客户' })
  @ApiParam({ name: 'id', type: Number, description: '客户ID' })
  @ApiResponse({ status: 200, description: '客户更新成功', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: '客户不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除客户（软删除）' })
  @ApiParam({ name: 'id', type: Number, description: '客户ID' })
  @ApiResponse({ status: 200, description: '客户删除成功' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
