import { Controller, Post, Get, Delete, Body, Param, HttpException, Req, UseGuards, Put } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Family } from "src/model/family.entity";
import { Repository } from "typeorm";
import { ShoppingList } from "src/model/shoppingList.entity";
import { CreateListDTO, RenameListDTO, AddItemDTO } from "src/DTO/list.dto";
import { Item, IItem } from "src/model/item.entity";
import { User } from "src/model/user.entity";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

// TODO complete endpoints
// Add Guard to check if the user is in the family of the list

@Controller("shopping-list")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ShoppingListController {
    constructor(
        @InjectRepository(Family)
        private familyRepository: Repository<Family>,
        @InjectRepository(ShoppingList)
        private shoppingListRepository: Repository<ShoppingList>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}

    @Post()
    async createList(@Body() body: CreateListDTO) {
        const list = new ShoppingList();
        list.name = body.name;
        const family = await this.familyRepository.findOne({ id: body.family });
        list.family = family;
        return this.shoppingListRepository.save(list);
    }

    @Delete(":id")
    async deleteList(@Param("id") id: string) {
        const list = await this.shoppingListRepository.findOneOrFail({ id: +id });
        list.isActive = false;
        await this.shoppingListRepository.save(list);
        return;
    }

    @Post(":id/rename")
    async renameList(@Param("id") id: string, @Body() body: RenameListDTO) {
        const list = await this.shoppingListRepository.findOneOrFail({ id: +id });
        list.name = body.name;
        return await this.shoppingListRepository.save(list);
    }

    @Get(":id")
    async getList(@Param("id") id: string) {
        return this.getShoppingList(id);

        // return await this.shoppingListRepository
        //     .createQueryBuilder("list")
        //     .leftJoinAndSelect("list.items", "item")
        //     .where("list.id = :id", { id })
        //     .andWhere("item.isDeleted = :isDeleted", { isDeleted: false })
        //     .getOne();
    }

    @Post(":id/add")
    async addItem(@Param("id") id: string, @Body() body: AddItemDTO, @Req() req: Request) {
        const user = await this.userRepository.findOneOrFail((req.user as any).id);
        const item = new Item(body.name, body.quantity, body.comments, user);
        item.list = await this.shoppingListRepository.findOneOrFail(id);
        await this.itemRepository.insert(item);
        // const list = await this.shoppingListRepository.findOneOrFail(id);
        await this.shoppingListRepository
            .createQueryBuilder()
            .relation("items")
            .of(id)
            .add(item);
        return this.getShoppingList(id);
    }

    @Delete(":id/delete/:itemId")
    async removeItem(@Param("id") id: string, @Param("itemId") itemId: string) {
        // const item = await this.itemRepository.findOneOrFail(itemId, {
        //     loadEagerRelations: false,
        //     relations: ["list"]
        // });
        await this.itemRepository
            .createQueryBuilder()
            .update()
            .set({ isDeleted: true, timeDeleted: new Date() })
            .where({ id: +itemId })
            .execute();
        return this.getShoppingList(id);
    }

    @Put(":id/markoff/:itemId")
    async markOffItem(@Param("id") id: string, @Param("itemId") itemId: string) {
        const item: IItem = await this.itemRepository
            .createQueryBuilder("Item")
            .select(["Item.id", "Item.markedOff"])
            .where({ id: +itemId })
            .getOne();
        if (item.markedOff) {
            await this.itemRepository
                .createQueryBuilder()
                .update()
                .set({ markedOff: false, timeMarkedOff: null })
                .where({ id: +itemId })
                .execute();
        } else {
            await this.itemRepository
                .createQueryBuilder()
                .update()
                .set({ markedOff: true, timeMarkedOff: new Date() })
                .where({ id: +itemId })
                .execute();
        }

        return this.getShoppingList(id);
    }

    @Post(":id")
    changeOrder(@Param("id") id: string) {
        throw new HttpException("Not Implemented", 500);
    }

    async getShoppingList(id: string | number): Promise<ShoppingList> {
        // const [list, items] = await Promise.all([
        //     this.shoppingListRepository.findOneOrFail(id),
        //     this.itemRepository
        //         .createQueryBuilder()
        //         .select("*")
        //         .where("listId = :id", { id })
        //         .andWhere("isDeleted = false")
        //         .getMany()
        // ]);
        // list.items = items;
        //console.log(list);
        return this.shoppingListRepository.findOneOrFail(id);
    }
}
