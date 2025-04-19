import {CastMemberType} from "@core/cast-member/domain/cast-member-type.vo";
import {Uuid} from "@core/shared/domain/value-objects/uuid.vo";
import {AggregateRoot} from "@core/shared/domain/aggregate-root";
import {CastMemberValidatorFactory} from "@core/cast-member/domain/cast-member.validator";
import {CastMemberFakeBuilder} from "@core/cast-member/domain/cast-member-fake.builder";

export type CastMemberConstructorProps = {
    cast_member_id?: CastMemberId;
    name: string;
    type: CastMemberType;
    created_at?: Date;
};

export type CastMemberCreateCommand = {
    name: string;
    type: CastMemberType;
};

export class CastMemberId extends Uuid {}

export class CastMember extends AggregateRoot {
    cast_member_id: CastMemberId;
    name: string;
    type: CastMemberType;
    created_at: Date;

    constructor(props: CastMemberConstructorProps) {
        super();
        this.cast_member_id = props.cast_member_id ?? new CastMemberId();
        this.name = props.name;
        this.type = props.type;
        this.created_at = props.created_at ?? new Date();
    }

    static create(props: CastMemberCreateCommand): CastMember {
        const cast_member = new CastMember(props);
        cast_member.validate(['name']);
        return cast_member;
    }

    changeName(name: string): void {
        this.name = name;
        this.validate(['name']);
    }

    changeType(type: CastMemberType): void {
        this.type = type;
    }

    validate(fields?: string[]) {
        const validator = CastMemberValidatorFactory.create();
        return validator.validate(this.notification, this, fields);
    }

    static fake() {
        return CastMemberFakeBuilder;
    }

    get entity_id(): Uuid {
        return this.cast_member_id;
    }

    toJSON() {
        return {
            cast_member_id: this.cast_member_id,
            name: this.name,
            type: this.type,
            created_at: this.created_at,
        };
    }
}