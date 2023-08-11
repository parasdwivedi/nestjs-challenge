import { IsNotEmpty, IsString } from 'class-validator';

export class dtoTask {
  @IsString()
  @IsNotEmpty() // Validators
  name: string;

  @IsString() // Validators
  @IsNotEmpty() // Validators
  description: string;
}
