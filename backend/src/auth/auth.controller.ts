import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/user-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/api/auth')
export class AuthController {
	constructor(private readonly service: AuthService) { }

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Body() user: loginUserDto) {
		console.log('LOGIN.controller', user);
		return this.service.login(user);
	}
}
