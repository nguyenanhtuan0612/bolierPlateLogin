import { INestApplication } from '@nestjs/common';
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerCustomOptions,
} from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('Nest.js example API')
        .setDescription('API Documentation')
        .setVersion('2.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'authorization',
        )
        .build();

    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            docExpansion: 'none',
        },
    };
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`api/v1`, app, document, customOptions);
}
