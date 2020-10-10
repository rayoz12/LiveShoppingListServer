import { Controller, Post, Body, HttpException, Get, Param, UseGuards, Req, Delete } from "@nestjs/common";
import { CreateFamilyDTO, AddUsertoFamilyDTO, SetFamilyManagerDTO } from "src/DTO/family.dto";
import { Family } from "src/model/family.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, safeIUser } from "src/model/user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request } from "express";
import { ShoppingList } from "src/model/shoppingList.entity";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("family")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyController {
    constructor(
        @InjectRepository(Family)
        private familyRepository: Repository<Family>,
        @InjectRepository(ShoppingList)
        private shoppingListRepository: Repository<ShoppingList>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    @Get("user")
    async getUsersFamilies(@Req() req: Request) {
        const user: safeIUser = req.user as safeIUser;
        const families: { family_id: number }[] = await this.familyRepository
            .createQueryBuilder("family")
            .select("family.id")
            .leftJoin("family.members", "member")
            .where("member.id = :id", { id: user.id })
            .execute();

        return this.familyRepository.findByIds(families.map((item) => item.family_id));
    }

    // Create Family
    @Post()
    async createFamily(@Body() body: CreateFamilyDTO) {
        let family = new Family();
        family.name = body.name;

        const user = await this.usersRepository.findOne({ id: body.manager, isActive: true });
        if (!user) {
            throw new HttpException("Invalid Manager", 400);
        }
        family.manager = user;
        family.members = [user];
        family = await this.familyRepository.save(family);
        return family;
    }

    // Add User to Family
    @Post("addUser")
    async addUser(@Body() body: AddUsertoFamilyDTO) {
        const family = await this.familyRepository.findOne({ id: body.family, isActive: true });
        const user = await this.usersRepository.findOne({ id: body.user, isActive: true });
        if (!user) {
            throw new HttpException("Invalid User", 400);
        }
        family.members.push(user);
        return this.familyRepository.save(family);
    }

    @Post("setManager")
    async setManager(@Body() body: SetFamilyManagerDTO) {
        const family = await this.familyRepository.findOne({ id: body.family, isActive: true });
        const user = await this.usersRepository.findOne({ id: body.user, isActive: true });
        if (!user) {
            throw new HttpException("Invalid User", 400);
        }
        if (!family) {
            throw new HttpException("Invalid Family", 400);
        }
        family.manager = user;
        return this.familyRepository.save(family);
    }

    @Delete(":id")
    async deleteFamily(@Param("id") id: string) {
        await this.shoppingListRepository
            .createQueryBuilder()
            .delete()
            .where("family.id = :id", { id })
            .execute();
        await this.familyRepository.delete({ id: +id });
    }

    @Get(":id")
    async getFamily(@Param("id") id: string) {
        return this.familyRepository.findOne({ id: +id });
    }
}
