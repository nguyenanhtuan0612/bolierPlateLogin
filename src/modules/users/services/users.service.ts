import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUsers.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { User } from '../entities/user.entity';
import { genSalt, hash } from 'bcrypt';
import { UserDto } from '../dto/responeUsers.dto';
import { UserTarger } from '../entities/userTarget.entity';
import errors from 'src/constants/errors';

@Injectable()
export class UsersService {
    constructor() {}

    async create(createUserDto: CreateUserDto) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = new User();
                user.email = createUserDto.email;
                user.firstName = createUserDto.firstName;
                user.lastName = createUserDto.lastName;
                user.role = createUserDto.role;
                user.fullName = createUserDto.fullName
                    ? createUserDto.fullName
                    : `${user.firstName} ${user.lastName}`;

                const salt = await genSalt(10);
                user.password = await hash(createUserDto.password, salt);

                const userData = await user.save();
                return resolve(new UserDto(userData));
            } catch (error) {
                reject(error);
            }
        });
    }

    async list(options: any = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const listUsers = await User.findAndCountAll(options);
                const data = JSON.parse(JSON.stringify(listUsers));
                data.rows = listUsers.rows.map((user) => new UserDto(user));
                return resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async detail(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findByPk<User>(id);
                const data = JSON.parse(JSON.stringify(new UserDto(user)));
                const target = await UserTarger.findOne({
                    where: { userId: id },
                });
                if (target) {
                    data.target = target.target;
                    data.point = target.point;
                }
                return resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return User.findOne({ where: { email: email } });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findByPk<User>(id);
                if (!user) {
                    throw errors.USER_NOT_FOUND;
                }
                user.firstName = updateUserDto.firstName || user.firstName;
                user.lastName = updateUserDto.lastName || user.lastName;
                user.gender = updateUserDto.gender || user.gender;
                if (
                    updateUserDto.active !== null ||
                    updateUserDto.active !== undefined
                ) {
                    user.active = updateUserDto.active;
                }
                user.phone = updateUserDto.phone;
                user.birthday = updateUserDto.birthday || user.birthday;
                user.avatarImage =
                    updateUserDto.avatarImage || user.avatarImage;
                user.backgroundImage =
                    updateUserDto.backgroundImage || user.backgroundImage;
                user.fullName = `${user.firstName} ${user.lastName}`;
                await user.save();
                return resolve(new UserDto(user));
            } catch (error) {
                reject(error);
            }
        });

        // return user;
    }

    async remove(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findByPk<User>(id);
                await user.destroy();

                return resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    async googleFindOrCreate(gUser: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = new User();
                const emailUser = await User.findOne({
                    where: { email: gUser.email },
                });
                if (emailUser) {
                    emailUser.googleId = gUser.id;
                    await emailUser.save();
                    return resolve(emailUser);
                }
                const curUser = await User.findOne({
                    where: { googleId: gUser.id },
                });
                if (curUser) {
                    return resolve(curUser);
                }
                user.email = gUser.email;
                user.role = 'user';
                user.googleId = gUser.id;
                user.firstName = gUser.firstName;
                user.lastName = gUser.lastName;
                user.avatarImage = gUser.picture;
                user.gender = gUser.gender;
                user.fullName = `${user.firstName} ${user.lastName}`;
                const resData = await user.save();
                return resolve(resData);
            } catch (error) {
                reject(error);
            }
        });
    }

    async facebookFindOrCreate(fUser: any) {
        return new Promise(async (resolve, reject) => {
            try {
                if (fUser.email) {
                    const emailUser = await User.findOne({
                        where: { email: fUser.email },
                    });
                    if (emailUser) {
                        emailUser.facebookId = fUser.id;
                        await emailUser.save();
                        return resolve(emailUser);
                    }
                }
                const user = new User();
                const curUser = await User.findOne({
                    where: { facebookId: fUser.id },
                });
                if (curUser) {
                    return resolve(curUser);
                }
                user.email = fUser.email;
                user.role = 'user';
                user.facebookId = fUser.id;
                user.firstName = fUser.firstName;
                user.lastName = fUser.lastName;
                user.fullName = `${user.firstName} ${user.lastName}`;
                const resData = await user.save();
                return resolve(resData);
            } catch (error) {
                reject(error);
            }
        });
    }

    async setTarget(userId: string, target: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const curTarget = await UserTarger.findOne({
                    where: { userId },
                });
                if (!curTarget) {
                    const newTarget = new UserTarger();
                    newTarget.userId = userId;
                    newTarget.target = target;
                    newTarget.point = 0;
                    const data = await newTarget.save();
                    return resolve(data);
                }
                const data = await curTarget.update({ target });
                return resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async updatePoint(userId: string, point: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const curTarget = await UserTarger.findOne({
                    where: { userId },
                });
                if (!curTarget) {
                    return reject(errors.USER_NOT_FOUND);
                }
                const data = await curTarget.update({ point });
                return resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}
