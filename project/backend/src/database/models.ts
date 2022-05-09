import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
@Index(['email'], {unique: true})
export class User {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column({nullable: false})
    name: string = '';

    @Column({nullable: false})
    email: string = '';

}