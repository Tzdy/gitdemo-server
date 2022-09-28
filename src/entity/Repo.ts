import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

export enum RepoType {
    PUBLIC = 0,
    PRIVATE = 1,
}

@Entity('repo')
@Index(['user_id', 'repo_name'], { unique: true })
export class Repo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column({
        type: 'enum',
        enum: RepoType,
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
}
