"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = exports.authGuard = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const auth_service_1 = require("../services/auth.service");
const authGuard = () => {
    const auth = (0, core_1.inject)(auth_service_1.AuthService);
    const router = (0, core_1.inject)(router_1.Router);
    if (auth.isLoggedIn())
        return true;
    return router.createUrlTree(['/login']);
};
exports.authGuard = authGuard;
const adminGuard = () => {
    const auth = (0, core_1.inject)(auth_service_1.AuthService);
    const router = (0, core_1.inject)(router_1.Router);
    if (auth.isAdmin())
        return true;
    return router.createUrlTree(['/']);
};
exports.adminGuard = adminGuard;
//# sourceMappingURL=auth.guard.js.map