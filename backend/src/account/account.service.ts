import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountRequest: CreateAccountRequest) {
    if (!createAccountRequest.login || !createAccountRequest.password) {
        console.log("info : ", createAccountRequest);
      throw new BadRequestException('Login et mot de passe requis.');
    }
    try {
      // Hash password with salt
      const saltRounds = 10;
      const hashed = await bcrypt.hash(createAccountRequest.password, saltRounds);

      // console.log("pwd => ", createAccountRequest.password);
      return await this.prisma.user.create({
        data: {
          login: createAccountRequest.login,
          password: hashed,
          roles: createAccountRequest.roles || ['ROLE_USER'],
          status: createAccountRequest.status || 'open',
        },
        select: {
          id: true,
          login: true,
          roles: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException(`Le login "${createAccountRequest.login}" est déjà utilisé.`);
      }
      throw e;
    }
  }

  findOne(uid: string) {
    const id = parseInt(uid, 10);
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, login: true, roles: true, status: true, createdAt: true, updatedAt: true } });
  }

  update(uid: string, editAccountRequest: EditAccountRequest) {
    const id = parseInt(uid, 10);
    return this.prisma.user.update({ where: { id }, data: editAccountRequest, select: { id: true, login: true, roles: true, status: true, createdAt: true, updatedAt: true } });
  }
}