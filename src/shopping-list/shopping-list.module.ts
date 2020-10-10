import { Module } from "@nestjs/common";
import { ShoppingListController } from "./shopping-list.controller";
import { Family } from "src/model/family.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShoppingList } from "src/model/shoppingList.entity";
import { User } from "src/model/user.entity";
import { Item } from "src/model/item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Family, ShoppingList, User, Item])],
    controllers: [ShoppingListController]
})
export class ShoppingListModule {}
