import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/model/user.entity";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { get } from "config";

let expiresIn: string = "";
if (get<boolean>("isDev")) {
    console.log("NODE_ENV", process.env.NODE_ENV);
    console.log("JWT", process.env.JWTSecret);

    //Set expires in
    expiresIn = "30d"
}
else {
    expiresIn = "30m";
}

const jwtSecret = process.env.JWTSecret;
if (jwtSecret === undefined) {
    console.error("Please set the env var 'JWTSecret' with the secret to use");
    process.exit(-1);
}

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWTSecret, // TODO: Move to a secure location
            signOptions: { expiresIn }
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
