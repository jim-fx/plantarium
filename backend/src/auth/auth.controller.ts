import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/user-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Get('profile')
  async profile(@Req() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: loginUserDto, @Request() req) {
    return this.service.login(req.user);
  }
}
