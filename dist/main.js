"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_guard_1 = require("./auth/guard/jwt.guard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalGuards(new jwt_guard_1.JwtAuthGuard());
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map