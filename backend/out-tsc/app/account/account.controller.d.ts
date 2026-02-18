import { AccountService } from './account.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    create(createAccountRequest: CreateAccountRequest): any;
    findOne(uid: string): any;
    update(uid: string, editAccountRequest: EditAccountRequest): any;
}
