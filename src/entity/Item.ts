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
    hash: string
}
