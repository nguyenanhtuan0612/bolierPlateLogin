import {
    Table,
    Column,
    Model,
    Unique,
    IsEmail,
    DataType,
    CreatedAt,
    UpdatedAt,
    IsIn,
} from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Unique
    @IsEmail
    @Column
    email: string;

    @Column
    password: string;

    @Column
    firstName: string;

    @Column({ defaultValue: true })
    active: boolean;

    @Column
    lastName: string;

    @Column
    fullName: string;

    @Column
    googleId: string;

    @Column
    facebookId: string;

    @IsIn({
        msg: 'Gender Is Invalid',
        args: [['male', 'female', 'orther']],
    })
    @Column
    gender: string;

    @Column
    avatarImage: string;

    @Column
    phone: string;

    @Column
    backgroundImage: string;

    @IsIn({
        msg: 'Role Is Invalid',
        args: [['admin', 'user', 'collaborators']],
    })
    @Column({ defaultValue: 'reader' })
    role: string;

    @Column(DataType.DATE)
    birthday: string;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}
