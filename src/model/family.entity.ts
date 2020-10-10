import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { ShoppingList } from "./shoppingList.entity";

@Entity()
export class Family {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @ManyToOne(
        (type) => User,
        (user) => user.managedFamilies,
        { eager: true }
    )
    manager: User;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(
        (type) => User,
        (user) => user.families,
        { eager: true }
    )
    members: User[];

    @OneToMany(
        (type) => ShoppingList,
        (list) => list.family,
        { eager: true }
    )
    lists: ShoppingList[];
}
