import { IsString, Length } from 'class-validator';
export class loginUserDto {
  @IsString()
  @Length(4, 32)
  readonly username: string;

  @IsString()
  @Length(4, 32)
  readonly password: string;
}
