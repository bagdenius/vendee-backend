import { IsNotEmpty, IsString } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends CreateStoreDto {
  @IsString({ message: 'Store description should be a string' })
  @IsNotEmpty({ message: 'Please enter the store description' })
  description: string;
}
