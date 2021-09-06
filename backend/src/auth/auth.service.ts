import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);

    console.log('AuthService.validate', user);

    if (await user.comparePassword(pass)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    console.log('AutgService.login', user);
    const payload = { name: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
