import { CreateRepoResDto, CreateRepoReqDto } from '@/dto/repo/createRepoDto'
import {
    ListAllRepoLanguageReqDto,
    ListAllRepoLanguageResDto,
} from '@/dto/repo/listAllRepoLanguageDto'
import { ListRepoReqDto, ListRepoResDto } from '@/dto/repo/listRepoDto'
import {
    ListRepoFileReqDto,
    ListRepoFileResDto,
} from '@/dto/repo/listRepoFileDto'
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

    @Post('/list_repo')
    @ApiResponse(200, ListRepoResDto)
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    async listRepo(
        @Body() dto: ListRepoReqDto,
        @TokenPlyload('id') id: number
    ) {
        return this.repoService.listRepo(id, dto)
    }

    @Post('/list_all_repo_language')
    @ApiResponse(200, ListAllRepoLanguageResDto)
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    async listAllRepoLanguage(
        @Body() dto: ListAllRepoLanguageReqDto,
        @TokenPlyload('id') id: number
    ) {
        return this.repoService.listAllRepoLanguage(id, dto)
    }

    @Post('/list_repo_file')
    @ApiResponse(200, ListRepoFileResDto)
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    async listRepoFile(
        @Body() dto: ListRepoFileReqDto,
        @TokenPlyload('id') id: number
    ) {
        return this.repoService.listRepoFile(id, dto)
    }
}
