import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('JWT ERROR:', err);
    console.log('JWT USER:', user);
    console.log('JWT INFO:', info);

    return super.handleRequest(err, user, info);
  }
}