import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class signInDto {
  @IsEmail() // Validators
  @IsNotEmpty() // Validators
  email: string;

  @IsString() // Validators
  @IsNotEmpty() // Validators
  password: string;
}
