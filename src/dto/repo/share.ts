import { ApiProperty } from '@tsdy/express-plugin-swagger'

export enum RepoType {
    PUBLIC = 0,
    PRIVATE = 1,
}

export enum ToggleState {
    ACTIVE = 0,
    PASSIVE = 1,
}

export class RepoDto {
    @ApiProperty({
        type: 'number',
    })
    id: number

    @ApiProperty({
        type: 'number',
    })
    type: RepoType

    @ApiProperty({
        type: 'string',
    })
    repoName: string

    @ApiProperty({
        type: 'string',
    })
    createTime: number

    @ApiProperty({
        type: 'number',
    })
    starNum: number

    @ApiProperty({
        type: 'number',
    })
    isStar: number

    @ApiProperty({
        type: 'integer',
    })
    isOverview: number

    @ApiProperty({
        type: 'string',
    })
    about: string

    // 提交时间，不是commit time
    @ApiProperty({
        type: 'string',
    })
    updateTime: number

    // 创建仓库时为空
    @ApiProperty({
        type: 'string',
    })
    language: string
}
