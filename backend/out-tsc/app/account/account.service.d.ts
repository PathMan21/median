import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';
export declare class AccountService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAccountRequest: CreateAccountRequest): any;
    findOne(uid: string): any;
    update(uid: string, editAccountRequest: EditAccountRequest): any;
}
