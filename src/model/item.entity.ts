import { User } from "./user.entity";
import { Family } from "./family.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { ShoppingList } from "./shoppingList.entity";

export interface IItem {
    id: number;
    name: string;
    quantity: number;
    comments: string;
    markedOff: boolean;
    isDeleted: boolean;
    timeAdded: Date;
    timeMarkedOff: Date | null;
    timeDeleted: Date | null;
    addedBy: User;
    list: ShoppingList;
}

@Entity()
export class Item implements IItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    quantity: number;

    @Column({ nullable: false })
    comments: string;

    @Column({ nullable: false, default: false })
    markedOff: boolean;

    @CreateDateColumn()
    timeAdded: Date;

    @Column({ nullable: true })
    timeMarkedOff: Date | null;

    @Column({ nullable: true })
    timeDeleted: Date | null;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne((type) => User, { eager: true })
    addedBy: User;

    @ManyToOne(
        (type) => ShoppingList,
        (list) => list.items,
        { onUpdate: "CASCADE" }
    )
    list: ShoppingList;

    constructor(name: string, quantity: number, comments: string, addedBy: User) {
        this.name = name;
        this.quantity = quantity;
        this.comments = comments;
        this.addedBy = addedBy;
        this.markedOff = false;
    }
}
