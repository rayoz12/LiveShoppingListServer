import { Controller, UseGuards, Post, Get, Req, Res } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./services/auth.service";
import { Response, Request } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { LoginDTO } from "src/DTO/auth.dto";
import { User } from "src/model/user.entity";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("me")
    me(@Req() req): {id: number, username: string, user: User} {
        return req.user;
    }

    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDTO })
    @Post("login")
    async login(@Req() req: Request) {
        const user = req.user as User;
        user.isActive = ((user.isActive as unknown) as number) === 1 ? true : false;
        return this.authService.login(req.user as User);
    }

    @Post("register")
    async register(@Req() req: Request) {
        const { email, password, firstName, lastName } = req.body;

        return this.authService.register(email, password, firstName, lastName);
    }
}
