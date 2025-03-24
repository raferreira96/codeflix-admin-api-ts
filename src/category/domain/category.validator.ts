import {IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {Category} from "./category.entity";
import {ClassValidatorFields} from "../../shared/domain/validators/class-validator-fields";

export class CategoryRules {
    @MinLength(4)
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @MinLength(8)
    @MaxLength(255)
    @IsString()
    @IsOptional()
    description: string | null;

    @IsOptional()
    @IsBoolean()
    is_active: boolean;

    constructor({ name, description, is_active }: Category) {
        Object.assign(this, { name, description, is_active });
    }
}

class CategoryValidator extends ClassValidatorFields<CategoryRules>{
    validate(entity: Category) {
        return super.validate(new CategoryRules(entity));
    }
}

export class CategoryValidatorFactory {
    static create() {
        return new CategoryValidator();
    }
}