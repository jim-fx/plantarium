import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(4, 32)
  readonly name: string;

  @IsString()
  @Length(4, 32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;
}
