import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Family } from "./family.entity";
import { Item } from "./item.entity";

export interface IUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    families?: Family[];
}
/*
 * A User Type without the password
 */
export type safeIUser = Omit<IUser, "password">;

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ select: false })
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(
        (type) => Family,
        (family) => family.members
    )
    @JoinTable()
    families: Family[];

    @OneToMany(
        (type) => Family,
        (family) => family.manager
    )
    managedFamilies: Family[];

    @OneToMany(
        (type) => Item,
        (item) => item.addedBy
    )
    items: Item[];
}
