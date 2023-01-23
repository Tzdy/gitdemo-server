import { CatRepoFileReqDto, CatRepoFileResDto } from '@/dto/repo/catRepoFileDto'
import { CreateRepoResDto, CreateRepoReqDto } from '@/dto/repo/createRepoDto'
import { GetOneRepoReqDto, GetOneRepoResDto } from '@/dto/repo/getOneRepoDto'
import {
    ListAllRepoLanguageReqDto,
    ListAllRepoLanguageResDto,
} from '@/dto/repo/listAllRepoLanguageDto'
import { ListRepoReqDto, ListRepoResDto } from '@/dto/repo/listRepoDto'
import {
    ListRepoFileReqDto,
    ListRepoFileResDto,
} from '@/dto/repo/listRepoFileDto'
import { ListRepoRefReqDto, ListRepoRefResDto } from '@/dto/repo/listRepoRefDto'
import { SetRepoReqDto, SetRepoResDto } from '@/dto/repo/setRepoDto'
import { AvailableTokenMiddleWare, TokenMiddleWare } from '@/middleware/token'
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

    @Post('/get_one_repo')
    @ApiResponse(200, GetOneRepoResDto)
    @UseGuards(AvailableTokenMiddleWare)
    @ApiSecurity('token')
    async getOneRepo(
        @Body() body: GetOneRepoReqDto,
        @TokenPlyload('id') id?: number
    ) {
        return await this.repoService.getOneRepo(body, id)
    }

    @Post('/list_repo')
    @ApiResponse(200, ListRepoResDto)
    @UseGuards(AvailableTokenMiddleWare)
    @ApiSecurity('token')
    async listRepo(
        @Body() dto: ListRepoReqDto,
        @TokenPlyload('id') id?: number
    ) {
        return this.repoService.listRepo(dto, id)
    }

    @Post('/list_all_repo_language')
    @ApiResponse(200, ListAllRepoLanguageResDto)
    @UseGuards(AvailableTokenMiddleWare)
    @ApiSecurity('token')
    async listAllRepoLanguage(
        @Body() dto: ListAllRepoLanguageReqDto,
        @TokenPlyload('id') id?: number
    ) {
        return this.repoService.listAllRepoLanguage(dto, id)
    }

    @Post('/set_repo')
    @ApiResponse(200, SetRepoResDto)
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    async setRepo(@Body() dto: SetRepoReqDto, @TokenPlyload('id') id: number) {
        return this.repoService.setRepo(id, dto)
    }

    @Post('/list_repo_ref')
    @ApiResponse(200, ListRepoRefResDto)
    @UseGuards(AvailableTokenMiddleWare)
    @ApiSecurity('token')
    async listRepoRef(
        @Body() dto: ListRepoRefReqDto,
        @TokenPlyload('id') id: number
    ) {
        return await this.repoService.listRepoRef(dto, id)
    }

    @Post('/get_one_latest_commit')
    async getOneLatestCommit() {}

    @Post('/list_repo_file')
    @ApiResponse(200, ListRepoFileResDto)
    @UseGuards(AvailableTokenMiddleWare)
    @ApiSecurity('token')
    async listRepoFile(
        @Body() dto: ListRepoFileReqDto,
        @TokenPlyload('id') id?: number
    ) {
        return this.repoService.listRepoFile(dto, id)
    }

    @Post('/cat_repo_file')
    @ApiResponse(200, CatRepoFileResDto)
    @UseGuards(AvailableTokenMiddleWare)
    @ApiSecurity('token')
    async catRepoFile(
        @Body() dto: CatRepoFileReqDto,
        @TokenPlyload('id') id?: number
    ) {
        return this.repoService.catRepoFile(dto, id)
    }
}
