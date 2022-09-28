import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        collation: 'utf8_bin',
    })
    username: string

    @Column({
        collation: 'utf8_bin',
    })
    password: string

    @Column({
        unique: true,
    })
    nickname: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_time: Date

    @Column({
        default: 'https://www.tsdy.club/git/manage/user/info/avatar/Tsdy',
    })
    avatar: string

    @Column({
        default: '',
    })
    bio: string

    @Column({
        default: '',
    })
    address: string

    @Column({
        default: '',
    })
    link: string

    @Column({
        default: '',
    })
    twitter: string
}
