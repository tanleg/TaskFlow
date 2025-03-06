import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsDate } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_creation: Date;
  
  @IsBoolean()
  @IsNotEmpty()
  public: boolean = false;

  @IsString()
  @IsNotEmpty()
  statut: string;
}
