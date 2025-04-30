import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateApplicationDto {
  @Length(1, 255)
  @IsString()
  role: string;

  @Length(1, 255)
  @IsOptional()
  company: string;

  @IsUrl()
  jobLink: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;

  @IsOptional()
  description: string;
}
