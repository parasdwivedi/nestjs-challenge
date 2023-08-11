import { signInDto } from './dto/signin.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2'; //to hash passwords
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  //sign up if user is here for the first time

  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);

    //save the new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      //send back the token generated for user which is valid for 10 minutes

      return this.signToken(user.id, user.email, user.firstName, user.lastName);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  //to login if user already exists
  async signin(dto: signInDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user does not exists throw an exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    //compare password
    const isMatching = await argon.verify(user.hash, dto.password);
    //if password does not matches then throw an exception
    if (!isMatching) {
      throw new ForbiddenException('Password does not matches');
    }

    //send back the token generated for user which is valid for 10 minutes

    return this.signToken(user.id, user.email, user.firstName, user.lastName);
  }

  //function to generate jwt
  async signToken(
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      firstName,
      lastName,
    };
    const secret = this.config.get('JWT_SECRET'); //to get the secret from .env file
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '40m',
      secret: secret,
    });

    return { access_token: token };
  }
}
