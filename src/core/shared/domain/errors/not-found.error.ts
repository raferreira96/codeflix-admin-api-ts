import {Entity} from "../entity";

export class NotFoundError extends Error {
    constructor(
        id: any[] | any,
        entityClass: new (...args: any[]) => Entity,
    ) {
        const idsMessage = Array.isArray(id) ? id.join(',') : id;
        super(`${entityClass.name} with id ${idsMessage} not found`);
        this.name = "NotFoundError";
    }
}