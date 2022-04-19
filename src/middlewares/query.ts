import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;
const specific = ['like', 'notLike', 'iLike', 'notILike'];
const operators = {
    '=': Sequelize.Op.eq,
    eq: Sequelize.Op.eq,
    '>': Sequelize.Op.gt,
    gt: Sequelize.Op.gt,
    '>=': Sequelize.Op.gte,
    gte: Sequelize.Op.gte,
    '<': Sequelize.Op.lt,
    lt: Sequelize.Op.lt,
    '<=': Sequelize.Op.lte,
    lte: Sequelize.Op.lte,
    '!=': Sequelize.Op.ne,
    ne: Sequelize.Op.ne,
    in: Sequelize.Op.in,
    notIn: Sequelize.Op.notIn,
    like: Sequelize.Op.like,
    notLike: Sequelize.Op.notLike,
    iLike: Sequelize.Op.iLike,
    notILike: Sequelize.Op.notILike,
    regexp: Sequelize.Op.regexp,
    notRegexp: Sequelize.Op.notRegexp,
    between: Sequelize.Op.between,
};

@Injectable()
export class Query implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction) {
        const paginate = this.paginate(req);
        const where = this.where(req);
        const order = this.sort(req);

        Object.assign(req, {
            options: Object.assign({}, paginate, where, order),
        });
        next();
    }

    private where(req) {
        let { filter, tags, categories } = req.query;
        const where = {};
        if (this.isJson(filter)) {
            filter = JSON.parse(filter);

            if (Array.isArray(filter)) {
                filter.forEach((field) => {
                    const { operator, property } = field;
                    let { value } = field;

                    if (typeof value === 'string' || value instanceof String) {
                        value = value.replace(/%/g, '\\%');
                        value = value.replace(/\\/g, '\\');
                    }

                    if (property && operator && operators[operator]) {
                        if (specific.indexOf(operator) >= 0) {
                            value = `%${value}%`;
                        }

                        Object.assign(where, {
                            [property]: {
                                [operators[operator]]: value,
                            },
                        });
                    }
                    if (operator === 'search') {
                        const value = {
                            [Op.iLike]: '%' + field.value.toString() + '%',
                        };
                        const fields = field.property.split(',');
                        const filters = {};
                        fields.forEach((item: any) => (filters[item] = value));
                        Object.assign(where, { [Op.or]: filters });
                    }
                });
            }
        }

        // Handle tags when query list by tag name
        if (this.isJson(tags)) {
            tags = JSON.parse(tags);
            if (Array.isArray(tags)) {
                tags.forEach((tag) => {
                    const fields = tag.split(',');
                    Object.assign(where, { tags: fields });
                });
            }
        }

        // Handle categories when query list by category name
        if (this.isJson(categories)) {
            categories = JSON.parse(categories);
            if (Array.isArray(categories)) {
                categories.forEach((category) => {
                    const fields = category.split(',');
                    Object.assign(where, { categories: fields });
                });
            }
        }

        if (req.partition) {
            Object.assign(where, {
                partitionCode: req.partition.code,
            });
        }

        return { where };
    }

    private sort(req) {
        let { sort } = req.query;
        const order = [];

        if (!this.isJson(sort)) {
            return order;
        }

        sort = JSON.parse(sort);

        if (Array.isArray(sort)) {
            sort.forEach((field) => {
                order.push([field.property, field.direction]);
            });
        }

        return {
            order,
        };
    }

    private paginate(req) {
        const { limit, start } = req.query;
        const paginate = { limit: 10, offset: 0 };
        const ourl = req.originalUrl;
        const bookstr = [
            'books?filter',
            'questions/get-other-info',
            'books/book-total-point',
            '/exercises?',
            'exams?start=0&limit=10000',
            'questions?',
            'trainingChapters?filter',
        ];

        // has
        if (
            ourl.indexOf(bookstr[0]) > -1 ||
            ourl.indexOf(bookstr[1]) > -1 ||
            ourl.indexOf(bookstr[2]) > -1 ||
            ourl.indexOf(bookstr[4]) > -1 ||
            ourl.indexOf(bookstr[5]) > -1 ||
            ourl.indexOf(bookstr[6]) > -1 ||
            ourl.indexOf(bookstr[3]) > -1
        ) {
            if (limit) {
                paginate.limit = limit;
            }
        } else {
            if (limit) {
                paginate.limit = limit;
                if (limit > 10) {
                    paginate.limit = 10;
                }
            } else paginate.limit = 10;
        }

        if (start != undefined) {
            paginate.offset = start;
        }

        return paginate;
    }

    private isJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}
