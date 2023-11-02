import { IsString } from 'class-validator';
export class loginUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
