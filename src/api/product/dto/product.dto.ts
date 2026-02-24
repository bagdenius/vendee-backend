import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString({ each: true, message: 'Image URL must be a string' })
  @IsNotEmpty({ each: true, message: 'Image URL is required' })
  @ArrayMinSize(1, { message: 'At least one image is required' })
  images: string[];

  @IsString({ message: 'Category ID must be a string' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @IsString({ message: 'Color ID must be a string' })
  @IsNotEmpty({ message: 'Color ID is required' })
  colorId: string;
}
