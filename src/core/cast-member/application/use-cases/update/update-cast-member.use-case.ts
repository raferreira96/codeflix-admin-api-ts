import {IUseCase} from "@core/shared/application/use-case.interface";
import {UpdateCastMemberInput} from "@core/cast-member/application/use-cases/update/update-cast-member.input";
import {ICastMemberRepository} from "@core/cast-member/domain/cast-member.repository";
import {CastMember, CastMemberId} from "@core/cast-member/domain/cast-member.aggregate";
import {NotFoundError} from "@core/shared/domain/errors/not-found.error";
import {CastMemberType} from "@core/cast-member/domain/cast-member-type.vo";
import {EntityValidationError} from "@core/shared/domain/validators/validation.error";
import {
    CastMemberOutput,
    CastMemberOutputMapper
} from "@core/cast-member/application/use-cases/common/cast-member.output";

export class UpdateCastMemberUseCase
    implements IUseCase<UpdateCastMemberInput, UpdateCastMemberOutput>
{
    constructor(private castMemberRepo: ICastMemberRepository) {}

    async execute(input: UpdateCastMemberInput): Promise<UpdateCastMemberOutput> {
        const castMemberId = new CastMemberId(input.id);
        const castMember = await this.castMemberRepo.findById(castMemberId);

        if (!castMember) {
            throw new NotFoundError(input.id, CastMember);
        }

        input.name && castMember.changeName(input.name);

        if (input.type) {
            const [type, errorCastMemberType] = CastMemberType.create(
                input.type,
            ).asArray();

            castMember.changeType(type);

            errorCastMemberType &&
            castMember.notification.setError(errorCastMemberType.message, 'type');
        }

        if (castMember.notification.hasErrors()) {
            throw new EntityValidationError(castMember.notification.toJSON());
        }

        await this.castMemberRepo.update(castMember);

        return CastMemberOutputMapper.toOutput(castMember);
    }
}

export type UpdateCastMemberOutput = CastMemberOutput;