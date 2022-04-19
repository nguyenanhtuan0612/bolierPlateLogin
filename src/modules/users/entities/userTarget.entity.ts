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
    tableName: 'user_target',
    timestamps: true,
})
export class UserTarger extends Model<UserTarger> {
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
    point: number;

    @Column
    target: number;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}
