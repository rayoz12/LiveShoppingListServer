import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from "typeorm";
import { Family } from "./family.entity";
import { Item } from "./item.entity";

export enum ShoppingListSortOrder {
    dateAdded = "dateAdded",
    alphabetical = "alphabetical"
}

export interface IShoppingList {
    id: number;
    name: string;
    isActive: boolean;
    sortOrder: ShoppingListSortOrder;
    items: Item[];
    family?: Family;
}

@Entity()
export class ShoppingList implements IShoppingList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: ShoppingListSortOrder.dateAdded })
    sortOrder: ShoppingListSortOrder;

    @ManyToOne(
        (type) => Family,
        (family) => family.manager,
        { nullable: false }
    )
    family: Family;

    @OneToMany(
        (type) => Item,
        (item) => item.list,
        { eager: true, cascade: true }
    )
    items: Item[];

    @Column({ default: true })
    isActive: boolean;
}
