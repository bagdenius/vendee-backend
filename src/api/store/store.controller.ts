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
import { Auth, CurrentUser } from '../../common/decorators';
import { CreateStoreDto, UpdateStoreDto } from './dto';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id')
  @Auth()
  async getById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.storeService.getById(storeId, userId);
  }

  @Post()
  @HttpCode(201)
  @Auth()
  @UsePipes(new ValidationPipe())
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return await this.storeService.create(userId, dto);
  }

  @Put(':id')
  @HttpCode(200)
  @Auth()
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return await this.storeService.update(storeId, userId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth()
  async delete(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.storeService.delete(storeId, userId);
  }
}
