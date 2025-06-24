import {DeleteCastMemberUseCase} from "@core/cast-member/application/use-cases/delete/delete-cast-member.use-case";
import {
    CastMemberModel,
    CastMemberSequelizeRepository
} from "@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository";
import {setupSequelize} from "@core/shared/infra/testing/helpers";
import {CastMember, CastMemberId} from "@core/cast-member/domain/cast-member.aggregate";
import {NotFoundError} from "@core/shared/domain/errors/not-found.error";

describe('DeleteCastMemberUseCase Integration Tests', () => {
    let useCase: DeleteCastMemberUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new DeleteCastMemberUseCase(repository);
    });

    it('should throws error when entity not found', async () => {
        const castMemberId = new CastMemberId();
        await expect(() =>
            useCase.execute({ id: castMemberId.id }),
        ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
    });

    it('should delete a cast member', async () => {
        const castMember = CastMember.fake().anActor().build();
        await repository.insert(castMember);
        await useCase.execute({
            id: castMember.cast_member_id.id,
        });
        const noHasModel = await CastMemberModel.findByPk(
            castMember.cast_member_id.id,
        );
        expect(noHasModel).toBeNull();
    });
});