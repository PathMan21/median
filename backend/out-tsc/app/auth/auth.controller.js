"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const create_token_dto_1 = require("./dto/create-token.dto");
const token_entity_1 = require("./entities/token.entity");
const validate_token_entity_1 = require("./entities/validate-token.entity");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    createToken(createTokenRequest) {
        return this.authService.createToken(createTokenRequest);
    }
    refreshAccessToken(refreshToken) {
        return this.authService.refreshAccessToken(refreshToken);
    }
    validateToken(accessToken) {
        return this.authService.validateToken(accessToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('token'),
    (0, swagger_1.ApiCreatedResponse)({ type: token_entity_1.TokenEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_token_dto_1.CreateTokenRequest]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createToken", null);
__decorate([
    (0, common_1.Post)('refresh-token/:refreshToken/token'),
    (0, swagger_1.ApiCreatedResponse)({ type: token_entity_1.TokenEntity }),
    __param(0, (0, common_1.Param)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    (0, common_1.Get)('validate/:accessToken'),
    (0, swagger_1.ApiOkResponse)({ type: validate_token_entity_1.ValidateTokenResponse }),
    __param(0, (0, common_1.Param)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "validateToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map