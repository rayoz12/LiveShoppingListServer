import { IsNotEmpty } from "class-validator";

export class CreateListDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    family: number;
}

export class RenameListDTO {
    @IsNotEmpty()
    name: string;
}

export class AddItemDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    comments: string;
}

export class MarkOffItemDTO {}
