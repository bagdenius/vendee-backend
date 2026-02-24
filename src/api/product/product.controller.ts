import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../../common/decorators';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.productService.getAll(searchTerm);
  }

  @Get('popular')
  async getPopular() {
    return await this.productService.getPopular();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Get(':id/similar')
  async getSimilar(@Param('id') id: string) {
    return await this.productService.getSimilar(id);
  }

  @Get('/store/:storeId')
  @Auth()
  async getByStoreId(@Param('id') storeId: string) {
    return await this.productService.getByStoreId(storeId);
  }

  @Post('/store/:storeId')
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
    return await this.productService.create(storeId, dto);
  }

  @Put('/:id')
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return await this.productService.update(id, dto);
  }

  @Delete('/:id')
  @Auth()
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
