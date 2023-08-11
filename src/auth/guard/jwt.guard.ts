import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  //'jwt' uses the JwtStrategy defined in strategy folder
  constructor() {
    super();
  }
}
