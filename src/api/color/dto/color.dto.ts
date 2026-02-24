import { IsNotEmpty, IsString } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Color name should be a string' })
  @IsNotEmpty({ message: 'Please enter the color name' })
  name: string;

  @IsString({ message: 'Color value should be a string' })
  @IsNotEmpty({ message: 'Please enter the color value' })
  value: string;
}
