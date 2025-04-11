import {ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe} from "@nestjs/common";
import {WrapperDataInterceptor} from "./shared-module/interceptors/wrapper-data/wrapper-data.interceptor";
import {Reflector} from "@nestjs/core";
import {NotFoundFilter} from "./shared-module/filters/not-found.filter";
import {EntityValidationFilter} from "./shared-module/filters/entity-validation.filter";

export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(
        new WrapperDataInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.useGlobalFilters(new NotFoundFilter(), new EntityValidationFilter());
}