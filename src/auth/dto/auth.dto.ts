import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail() // Validators
  @IsNotEmpty() // Validators
  email: string;

  @IsString() // Validators
  @IsNotEmpty() // Validators
  password: string;

  @IsString() // Validators
  @IsNotEmpty() // Validators
  firstName: string;

  @IsString() // Validators
  @IsNotEmpty() // Validators
  lastName: string;
}
