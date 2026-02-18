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
exports.FilmService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../../environments/environment");
let FilmService = class FilmService {
    http;
    base = `${environment_1.environment.apiUrl}/films`;
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(this.base);
    }
    getOne(id) {
        return this.http.get(`${this.base}/${id}`);
    }
    create(body) {
        return this.http.post(this.base, body);
    }
    update(id, body) {
        return this.http.patch(`${this.base}/${id}`, body);
    }
    delete(id) {
        return this.http.delete(`${this.base}/${id}`);
    }
};
exports.FilmService = FilmService;
exports.FilmService = FilmService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], FilmService);
//# sourceMappingURL=film.service.js.map