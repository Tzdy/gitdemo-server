import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user_repo_relation')
export class UserRepoRelation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
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
