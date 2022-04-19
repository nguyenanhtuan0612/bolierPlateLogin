import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import errors from 'src/constants/errors';

@Injectable()
export class PartitionGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const partition = await req.get('partition');
        if (partition && !req.partition) {
            throw new BadRequestException(errors.PARTITION_NOT_FOUND.message);
        }
        if (!partition) {
            throw new BadRequestException(errors.PARTITION_NOT_FOUND.message);
        }
        if (req.method !== 'DELETE') {
            req.body.partitionKey = req.partition.code;
        }
        return true;
    }
}
