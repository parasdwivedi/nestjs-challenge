import { AuthService } from './auth.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthDto, signInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //we are creating here API endpoints for signup and signin

  @Post('signup')
  signup(@Body() dto: AuthDto, @Req() req: Request) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: signInDto) {
    return this.authService.signin(dto);
  }
}
