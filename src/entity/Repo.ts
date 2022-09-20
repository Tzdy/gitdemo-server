import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('repos')
export class Repo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    default_branch_id: number

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
