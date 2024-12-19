import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  public: boolean = false;

  @IsString()
  @IsNotEmpty()
  statut: string;
}
