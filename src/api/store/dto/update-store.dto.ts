import { IsNotEmpty, IsString } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends CreateStoreDto {
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
