export class CreateAccountRequest {
  @IsString()
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  status?: string;
}