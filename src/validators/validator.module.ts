import { Global, Module } from '@nestjs/common';
import { PasswordConfirmValidator } from './password-confirm.validator';

@Global()
@Module({
    providers: [PasswordConfirmValidator],
    exports: [PasswordConfirmValidator],
})
export class ValidatorModule {}
