import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from '../../common/decorators';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get(':storeId/main')
  @Auth()
  async getMainStatistics(@Param('storeId') storeId: string) {
    return await this.statisticsService.getMainStatistics(storeId);
  }

  @Get(':storeId/secondary')
  @Auth()
  async getSecondaryStatistics(@Param('storeId') storeId: string) {
    return await this.statisticsService.getSecondaryStatistics(storeId);
  }
}
