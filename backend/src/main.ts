import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Helper to configure the app (shared between local and vercel)
async function bootstrap(app) {
    // Enable CORS
    app.enableCors({
        origin: (origin, callback) => {
            callback(null, true);
        },
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global prefix for all routes
    app.setGlobalPrefix('api');
}

// Local Development Entry Point
if (require.main === module) {
    (async () => {
        const app = await NestFactory.create(AppModule);
        await bootstrap(app);
        const port = process.env.PORT || 3002;
        await app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}/api`);
    })();
}

// Vercel / Serverless Entry Point
export default async function handler(req: any, res: any) {
    const app = await NestFactory.create(AppModule);
    await bootstrap(app);
    await app.init();

    // Get the underlying express instance
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
}
