import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
} from 'sequelize-typescript';

@Table({
    tableName: 'user_otp',
    timestamps: true,
})
export class UserOTP extends Model<UserOTP> {
    @AutoIncrement
    @Column({
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.UUID,
    })
    userId: string;

    @Column
    otp: string;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}
