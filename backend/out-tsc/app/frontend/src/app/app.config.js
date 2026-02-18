"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const http_1 = require("@angular/common/http");
const app_routes_1 = require("./app.routes");
const auth_interceptor_1 = require("./core/interceptors/auth.interceptor");
const common_1 = require("@angular/common");
const fr_1 = __importDefault(require("@angular/common/locales/fr"));
(0, common_1.registerLocaleData)(fr_1.default);
exports.appConfig = {
    providers: [
        (0, core_1.provideZoneChangeDetection)({ eventCoalescing: true }),
        (0, router_1.provideRouter)(app_routes_1.routes),
        (0, http_1.provideHttpClient)((0, http_1.withInterceptors)([auth_interceptor_1.authInterceptor])),
        { provide: core_1.LOCALE_ID, useValue: 'fr-FR' },
    ]
};
//# sourceMappingURL=app.config.js.map