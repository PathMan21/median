import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenRequest } from './dto/create-token.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

interface TokenPayload {
  sub: number;
  login?: string;
  type?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createToken(createTokenRequest: CreateTokenRequest) {
    const user = await this.prisma.user.findUnique({
      where: { login: createTokenRequest.login },
    });

    let mdp = false;

    if (user) {
      mdp = await bcrypt.compare(createTokenRequest.password, user.password);
    }

    if (!user || !mdp) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    if (user.status === 'pending') {
      throw new UnauthorizedException(
        'Veuillez vérifier votre adresse email avant de vous connecter.',
      );
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException(
        "Compte désactivé. Contactez l'administrateur.",
      );
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      login: user.login,
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        type: 'refresh',
      },
      {
        expiresIn: '2h',
      },
    );

    return {
      accessToken,
      accessTokenExpiresAt: new Date(
        Date.now() + 60 * 60 * 1000,
      ).toISOString(),
      refreshToken,
      refreshTokenExpiresAt: new Date(
        Date.now() + 2 * 60 * 60 * 1000,
      ).toISOString(),
      user: {
        id: user.id,
        login: user.login,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(
        refreshToken,
      ) as TokenPayload;

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        login: user.login,
      });

      const newRefreshToken = this.jwtService.sign(
        {
          sub: user.id,
          type: 'refresh',
        },
        {
          expiresIn: '2h',
        },
      );

      return {
        accessToken,
        accessTokenExpiresAt: new Date(
          Date.now() + 60 * 60 * 1000,
        ).toISOString(),
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt: new Date(
          Date.now() + 2 * 60 * 60 * 1000,
        ).toISOString(),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateToken(accessToken: string) {
    try {
      const decoded = this.jwtService.verify(
        accessToken,
      ) as TokenPayload;

      if (decoded.type === 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        valid: true,
        user: {
          id: user.id,
          login: user.login,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}