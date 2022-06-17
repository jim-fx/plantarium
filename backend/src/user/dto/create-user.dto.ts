import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(3, 32)
  readonly name: string;

  @IsString()
  @Length(8, 32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;
}

export class CreateProviderUserDto {

  readonly email: string;

  readonly username: string;

  readonly profilePic?: string;

  readonly provider: "github";

  readonly providerId: string;

}
