import { IsNotEmpty } from "class-validator";

export class CreateFamilyDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    manager: number; // A user id
}

export class AddUsertoFamilyDTO {
    @IsNotEmpty()
    user: number;
    @IsNotEmpty()
    family: number;
}

export class SetFamilyManagerDTO {
    @IsNotEmpty()
    user: number;

    @IsNotEmpty()
    family: number;
}
