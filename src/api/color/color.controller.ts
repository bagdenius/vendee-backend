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
import { ColorService } from './color.service';
import { ColorDto } from './dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.colorService.getById(id);
  }

  @Get('store/:storeId')
  async getByStoreId(@Param('id') storeId: string) {
    return await this.colorService.getByStoreId(storeId);
  }

  @Post('store/:storeId')
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return await this.colorService.create(storeId, dto);
  }

  @Put(':id')
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: ColorDto) {
    return await this.colorService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.colorService.delete(id);
  }
}
