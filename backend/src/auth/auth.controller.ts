import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request as Reque,
  UseGuards,
  Res,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Response, Request } from "express";
import { User } from 'types';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/user-login.dto';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

let localTokenStore = {}

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Get('profile')
  async profile(@Req() req: { user: User; }) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _user: loginUserDto, @Reque() req: { user: User; }) {
    return this.service.login(req.user);
  }

  @UseGuards(GithubOauthGuard)
  @Get("github/deferred")
  async githubAuth() {
    // With `@UseGuards(GithubOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-github strategy.
    // The Guard initiates the passport-github flow.
  }

  @Get("github/set-token/:token")
  githubDeferred(@Res({ passthrough: true }) res: Response, @Param("token") token: string) {
    res.cookie("token", token);
    return res.redirect("/api/auth/github/deferred")
  }

  @Post("github/register-token")
  async githubToken() {
    const token = randomUUID();
    localTokenStore[token] = true;
    return { token };
  }

  @Post("github/token")
  async githToken(@Body() body: { token: string }) {

    if (localTokenStore[body.token] !== true) {
      throw new UnauthorizedException()
    }

    let res: (v: unknown) => void;

    const p = new Promise((r) => res = (v: any) => {
      delete localTokenStore[body.token];
      r(v);
    })

    localTokenStore[body.token] = res;

    return p;
  }

  @UseGuards(GithubOauthGuard)
  @Get("github/callback")
  async githubAuthCallback(@Req() req: Request & { user: User }, @Res({ passthrough: true }) res: Response) {

    const { access_token } = await this.service.login(req.user);

    const callback = localTokenStore[req?.cookies?.token];
    if (callback) {
      callback({ access_token });
    }

    return "<html>You can close this tab now.</html>"
  }

}
