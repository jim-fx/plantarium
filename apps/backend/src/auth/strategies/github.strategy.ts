import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "asdasdJ";
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "asdasdasd";
    const { OAUTH_CALLBACK } = process.env;

    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: OAUTH_CALLBACK,
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    // For each strategy, Passport will call the verify function (implemented with this
    // `validate()` method in @nestjs/passport) using an appropriate strategy-specific set of
    // parameters. For the passport-github strategy Passport expects a `validate()` method with
    // the following signature:
    //   `validate(accessToken: string, refreshToken: string, profile: Profile): any`
    // As you can see from this, `validate()` receives the access token and optional refresh
    // token, as well as profile which contains the authenticated user's GitHub profile.
    // We can pass these information to find or create the user in our system.
    // The Passport library expects this method to return a full user if the validation
    // succeeds, or a null if it fails. When returning a user, Passport will complete its tasks
    // (e.g., creating the user property on the Request object), and the request
    // handling pipeline can continue.

    const { id, username, emails, photos } = profile;

    const user = await this.userService.find({
      provider: 'github',
      providerId: id,
    });
    if (user) return user;

    return this.userService.createProvider({
      providerId: id,
      username: username,
      profilePic: photos[0].value,
      email: emails[0].value,
      provider: 'github',
    });
  }
}
