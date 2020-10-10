import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Family } from "src/model/family.entity";
import { User } from "src/model/user.entity";
import { FamilyController } from "./family.controller";
import { ShoppingList } from "src/model/shoppingList.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Family, User, ShoppingList])],
    controllers: [FamilyController]
})
export class FamilyModule {}
