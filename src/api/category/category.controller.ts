import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../../common/decorators';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @Get('/store/:storeId')
  @Auth()
  async getByStorestoreId(@Param('id') storeId: string) {
    return await this.categoryService.getByStoreId(storeId);
  }

  @Post('/store/:storeId')
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.create(storeId, dto);
  }

  @Put('/:id')
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: CategoryDto) {
    return await this.categoryService.update(id, dto);
  }

  @Delete('/:id')
  @Auth()
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }
}
