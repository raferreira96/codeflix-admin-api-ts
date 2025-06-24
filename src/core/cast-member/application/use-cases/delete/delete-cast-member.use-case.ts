import {IUseCase} from "@core/shared/application/use-case.interface";
import {ICastMemberRepository} from "@core/cast-member/domain/cast-member.repository";
import {CastMemberId} from "@core/cast-member/domain/cast-member.aggregate";

export class DeleteCastMemberUseCase
    implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
    constructor(private castMemberRepository: ICastMemberRepository) {}

    async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
        const castMemberId = new CastMemberId(input.id);
        await this.castMemberRepository.delete(castMemberId);
    }
}

export type DeleteCastMemberInput = {
    id: string;
};

type DeleteCastMemberOutput = void;