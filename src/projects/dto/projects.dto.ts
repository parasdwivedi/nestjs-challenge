import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDto {
  @IsString() // Validators
  @IsNotEmpty() // Validators
  name: string;

  @IsString() // Validators
  @IsNotEmpty() // Validators
  description: string;
}
