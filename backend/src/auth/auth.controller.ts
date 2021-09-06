import {
	Body,
	Controller,
	Get,
	Post,
	Redirect,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/api/auth')
export class AuthController {
	constructor(private readonly service: AuthService) { }

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async profile(@Res() res) {
		console.log('REsponse', res);
		return res.user;
	}

	@UseGuards(LocalAuthGuard)
	@Redirect('/')
	@Post('login')
	async login(@Body() user: loginUserDto, @Res() res) {
		const dude = await this.service.login(user);

		res.cookie('token', dude.access_token);

		return dude;
	}
}
