import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NextFunction } from 'express';
import { lastValueFrom } from 'rxjs';
import rmqConfigs from 'src/configs/rmq.configs';

@Injectable()
export class Partition implements NestMiddleware {
    constructor(
        @Inject(rmqConfigs().clientList.partition)
        private partitionClient: ClientProxy,
    ) {}

    async use(req: any, res: any, next: NextFunction) {
        try {
            const partition = await req.get('partition');
            if (partition) {
                const part = await lastValueFrom(
                    this.partitionClient.send(
                        { mod: 'partitions', act: 'detail' },
                        { id: partition },
                    ),
                );
                if (part) {
                    req.partition = part;
                } else {
                    req.partition = null;
                }
            }
        } catch (error) {
            req.partition = null;
        }

        next();
    }
}
