import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { jwtConstants } from '../constants';

interface Request {
  cookies: any;
  headers: Headers;
}

const extractJwt = (req: Request) => {
  let token = null;

  console.log(req.cookies);

  if (req && req.cookies) {
    token = req.cookies['token'];
  }

  if (req.headers['access-token']) {
    token = req.headers['access-token'].replace('Bearer ', '');
  }

  console.log('JWT', token);

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('PAYLOAD', payload);
    return { id: payload.sub, username: payload.username };
  }
}
