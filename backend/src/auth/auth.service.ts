import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { loginUserDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (await user.comparePassword(pass)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    console.log('LOGIN', user);
    const payload = { name: user.name, sub: user.id };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
