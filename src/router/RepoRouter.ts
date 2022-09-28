import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/RepoDto'
import { TokenMiddleWare } from '@/middleware/token'
import { RepoServiceImpl } from '@/service/impl/RepoServiceImpl'
import {
    ApiResponse,
    ApiSecurity,
    ApiTag,
    Body,
    Controller,
    Post,
    TokenPlyload,
    UseGuards,
} from '@/utils/decorator'

@ApiTag('Repo')
@Controller('repo')
export class RepoRouter {
    constructor(private readonly repoService: RepoServiceImpl) {}

    @Post('/create_repo')
    @ApiResponse(200, CreateRepoResDto)
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    async createRepo(
        @Body() dto: CreateRepoReqDto,
        @TokenPlyload('id') id: number
    ) {
        return this.repoService.createRepo(id, dto)
    }
}
