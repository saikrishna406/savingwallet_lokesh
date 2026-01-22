"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap(app) {
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
}
if (require.main === module) {
    (async () => {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await bootstrap(app);
        const port = process.env.PORT || 3002;
        await app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}/api`);
    })();
}
async function handler(req, res) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await bootstrap(app);
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
}
//# sourceMappingURL=main.js.map