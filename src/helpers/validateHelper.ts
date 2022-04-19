import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateHelper {
    email(email: string) {
        const re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    phone(phone: string) {
        const phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
        return phoneReg.test(phone);
    }

    birthday = (birthday: string) => {
        const birthdayReg = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        return birthdayReg.test(birthday);
    };
}
