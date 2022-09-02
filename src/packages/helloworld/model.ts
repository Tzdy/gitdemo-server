import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('hello')
export class HelloWorld {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        generated: 'uuid',
    })
    hh_id: string
}
