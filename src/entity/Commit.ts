import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('repo_commit')
export class Commit {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    repo_id: number

    @Column()
    commit_hash: string
}
