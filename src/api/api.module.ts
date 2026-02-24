import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { CategoryModule } from './category';
import { ColorModule } from './color';
import { FileModule } from './file';
import { OrderModule } from './order';
import { ProductModule } from './product';
import { ReviewModule } from './review/review.module';
import { StatisticsModule } from './statistics';
import { StoreModule } from './store';
import { UserModule } from './user';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ColorModule,
    CategoryModule,
    FileModule,
    StoreModule,
    OrderModule,
    StatisticsModule,
    ProductModule,
    ReviewModule,
  ],
})
export class ApiModule {}
