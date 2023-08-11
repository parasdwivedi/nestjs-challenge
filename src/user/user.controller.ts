import { JwtGuard } from './../auth/guard/jwt.guard';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  //Uses GetUser Decorator in auth folder to get users data
  @Get()
  getMe(@GetUser() user: User) {
    return user;
  }
}
