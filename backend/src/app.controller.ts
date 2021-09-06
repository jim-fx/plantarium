import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
	@Get('login')
	@Render('Login')
	getLogin() {
		return { message: 'NestJS ❤ Svelte' };
	}

	@Get()
	@Render('Home')
	getHello() {
		return { message: 'NestJS ❤ Svelte' };
	}
}
