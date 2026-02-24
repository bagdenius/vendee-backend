import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'Category title should be a string' })
  @IsNotEmpty({ message: 'Please enter the category title' })
  title: string;

  @IsString({ message: 'Category description should be a string' })
  @IsNotEmpty({ message: 'Please enter the category description' })
  description: string;
}
