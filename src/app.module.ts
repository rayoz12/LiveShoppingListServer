import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { get } from "config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./model/user.entity";
import { Family } from "./model/family.entity";
import { AuthModule } from "./auth/auth.module";
import { IDatabaseConfig } from "./services/config.interface";
import { FamilyModule } from "./family/family.module";
import { ShoppingListModule } from "./shopping-list/shopping-list.module";
import { ShoppingList } from "./model/shoppingList.entity";
import { Item } from "./model/item.entity";

const config: IDatabaseConfig = get("database");

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: config.path,
            entities: [User, Family, ShoppingList, Item],
            synchronize: true,
            logging: ["query", "error"]
        }),
        ConfigModule.forRoot({
            envFilePath: get("envFile"),
            isGlobal: true
        }),
        AuthModule,
        FamilyModule,
        ShoppingListModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
