import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('repo_commit_item')
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    repo_id: number

    @Column()
    commit_hash: string

    @Column()
    committer_name: string

    @Column({
        type: 'timestamp',
    })
    commit_time: Date

    @Column()
    commit_body: string

    @Column()
    hash: string
}
