import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Store title should be a string' })
  @IsNotEmpty({ message: 'Please enter the store title' })
  title: string;
}
