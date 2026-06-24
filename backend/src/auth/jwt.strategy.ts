import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  login: string;
  type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'change_this_secret',
    });
  }

  validate(payload: JwtPayload) {
    // Reject refresh tokens used as access tokens
    if (payload.type === 'refresh') {
      throw new UnauthorizedException('Token de type invalide');
    }

    return {
      userId: payload.sub,
      login: payload.login,
    };
  }
}
