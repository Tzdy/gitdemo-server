import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('user_repo_relation')
export class UserRepoRelation {
    @PrimaryColumn()
    user_id: number

    @PrimaryColumn()
    repo_id: number

    @Column({
        default: 0,
    })
    is_star: number

    @Column({
        default: 0,
    })
    is_fork: number

    @Column({
        default: 0,
    })
    is_watch: number
}
