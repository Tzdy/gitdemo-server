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
    star_num: number

    // 1-6表示展示顺序。0表示非展示仓库
    @Column({
        default: 0,
    })
    is_overview: number

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
        type: 'integer',
        default: -1,
    })
    language_id: number

    @Column({
        type: 'json',
        // default: () => '(JSON_ARRAY())', 8.0.13前不能设置。。
    })
    language_analysis: LanguageAnalysisItem[]
}
