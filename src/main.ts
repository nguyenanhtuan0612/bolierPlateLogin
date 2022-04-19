import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import appConfigs from './configs/app.configs';
import rmqConfigs from './configs/rmq.configs';
import { setupSwagger } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.get(ConfigService);

    const user = rmqConfigs().username;
    const password = rmqConfigs().password;
    const url = rmqConfigs().url;
    const queueName = rmqConfigs().queue;

    //Microservices
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${user}:${password}@${url}`],
            queue: queueName,
            noAck: true,
            queueOptions: {
                durable: true,
            },
        },
    });
    await app.startAllMicroservices();

    //RestApi
    app.setGlobalPrefix(`api/v1`);
    app.useGlobalPipes(new ValidationPipe({}));
    setupSwagger(app);
    await app.listen(appConfigs().port || 80);
}
bootstrap();
