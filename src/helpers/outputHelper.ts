import { Injectable } from '@nestjs/common';

@Injectable()
export class OutputHelper {
    displayErrorMessage(error: any) {
        const result = {
            errCode: error.code || 400,
            message: {},
            error: 'Bad Request',
        };

        try {
            //=== SQL string error ===
            if (typeof error == 'object' && !error.errors) {
                result.message = '{{common.somethingWentWrong}}';

                if (error.original && error.original.detail) {
                    result.message = error.original.detail;
                }
            }

            //=== validation error ===
            if (error && error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((error) => {
                    result.message = error.message;
                });
            }

            //=== excetion ===
            if (typeof error == 'object' && error.message && !error.errors) {
                result.message = error.message;
            }

            //=== string ===
            if (typeof error == 'string') {
                result.message = error;
            }

            //axios error
            if (error && error.response && error.response.data) {
                result.message = error.response.data;
                if (error.response.data.errorMessage) {
                    result.message = error.response.data.errorMessage;
                }
            }

            //=== other ===
            if (
                !(
                    (typeof error == 'object' && !error.errors) ||
                    (error && error.errors && Array.isArray(error.errors)) ||
                    (error && error.response && error.response.data)
                )
            ) {
                result.message = error;
            }
        } catch (exception) {
            result.message = '{{common.somethingWentWrong}}';
        }

        return result;
    }

    formatOutputData(data: any = {}, message?: string) {
        return {
            statusCode: 200,
            data: typeof data === 'object' ? data : null,
            message: message ? message : '{{common.success}}',
        };
    }
}
