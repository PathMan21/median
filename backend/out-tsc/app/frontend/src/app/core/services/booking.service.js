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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../../environments/environment");
let BookingService = class BookingService {
    http;
    base = `${environment_1.environment.apiUrl}/bookings`;
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(this.base);
    }
    getByUser(userId) {
        return this.http.get(`${this.base}/user/${userId}`);
    }
    getOne(id) {
        return this.http.get(`${this.base}/${id}`);
    }
    create(body) {
        return this.http.post(this.base, body);
    }
    confirm(id) {
        return this.http.patch(`${this.base}/${id}/confirm`, {});
    }
    cancel(id) {
        return this.http.patch(`${this.base}/${id}/cancel`, {});
    }
    delete(id) {
        return this.http.delete(`${this.base}/${id}`);
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], BookingService);
//# sourceMappingURL=booking.service.js.map