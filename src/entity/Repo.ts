import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

export enum RepoType {
    PUBLIC = 0,
    PRIVATE = 1,
}

export type LanguageAnalysisItem = {
    language_id: number
    file_num: number
}

@Entity('repo')
@Index(['user_id', 'repo_name'], { unique: true })
export class Repo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column({
        type: 'int',
        default: RepoType.PUBLIC,
    })
    type: RepoType

    @Column()
    repo_name: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    create_time: Date

    @Column({
        default: 0,
    })
    stars_num: number

    @Column({
        default: false,
    })
    is_overview: boolean

    @Column({
        default: '',
    })
    about: string

    @Column({
        default: '',
    })
    website: string

    // 提交时间，不是commit time
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    update_time: Date

    // 创建仓库时为空
    @Column({
        default: null,
    })
    language_id: number

    @Column({
        type: 'json',
        default: () => '(JSON_ARRAY())',
    })
    language_analysis: LanguageAnalysisItem[]
}
