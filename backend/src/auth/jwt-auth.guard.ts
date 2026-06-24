import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser>(
    err: unknown,
    user: TUser,
    info: unknown,
  ): TUser {
    console.log('JWT ERROR:', err);
    console.log('JWT USER:', user);
    console.log('JWT INFO:', info);

    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }

    return user;
  }
}