import {IUseCase} from "@core/shared/application/use-case.interface";
import {ListCastMembersInput} from "@core/cast-member/application/use-cases/list/list-cast-members.input";
import {
    CastMemberSearchParams,
    CastMemberSearchResult,
    ICastMemberRepository
} from "@core/cast-member/domain/cast-member.repository";
import {
    CastMemberOutput,
    CastMemberOutputMapper
} from "@core/cast-member/application/use-cases/common/cast-member.output";
import {PaginationOutput, PaginationOutputMapper} from "@core/shared/application/pagination-output";

export class ListCastMembersUseCase
    implements IUseCase<ListCastMembersInput, ListCastMembersOutput>
{
    constructor(private castMemberRepo: ICastMemberRepository) {}

    async execute(input: ListCastMembersInput): Promise<ListCastMembersOutput> {
        const params = CastMemberSearchParams.create(input);
        const searchResult = await this.castMemberRepo.search(params);
        return this.toOutput(searchResult);
    }

    private toOutput(
        searchResult: CastMemberSearchResult,
    ): ListCastMembersOutput {
        const { items: _items } = searchResult;
        const items = _items.map((i) => {
            return CastMemberOutputMapper.toOutput(i);
        });
        return PaginationOutputMapper.toOutput(items, searchResult);
    }
}

export type ListCastMembersOutput = PaginationOutput<CastMemberOutput>;