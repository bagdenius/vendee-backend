import { Controller, Get, Param, Patch } from '@nestjs/common';
import { Auth, CurrentUser } from '../../common/decorators';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: string) {
    return await this.userService.getById(id);
  }

  @Patch('profile/favorites/:productId')
  @Auth()
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.userService.toggleFavorite(userId, productId);
  }
}
