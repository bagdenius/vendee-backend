import { IsNotEmpty, IsString } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Value must be a string' })
  @IsNotEmpty({ message: 'Value is required' })
  value: string;
}
