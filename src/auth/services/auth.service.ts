import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, safeIUser } from "./../../model/user.entity";
import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<safeIUser | null> {
        const results = await this.usersRepository
            .createQueryBuilder()
            .select("*")
            .where({ email, isActive: true })
            .limit(1)
            .execute();
        const user = results[0];

        if (user) {
            const match = await compare(pass, user.password);

            if (match) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return result;
            } else {
                return null;
            }
        }
        return null;
    }

    async login(user: User) {
        const payload = { username: user.email, sub: user.id, user: user };
        return {
            token: this.jwtService.sign(payload, {expiresIn: "30d"})
        };
    }

    async register(email: string, password: string, firstName: string, lastName: string): Promise<safeIUser> {
        let user = new User();
        user.email = email;
        user.isActive = true;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = await hash(password, 10);

        user = await this.usersRepository.save(user);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        delete user.password;
        return user;
    }
}
