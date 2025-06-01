import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm"
import { Conta } from "./conta.ts"

export enum TipoTransacao {
    Credito = 0,
    Debito = 1,
}
@Entity()
export class Transacao extends BaseEntity  {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column("tinyint")
    tipo: number

    @OneToOne(() => Conta)
    @JoinColumn()
    conta: Conta

    @Column("double")
    valor: number

    @Column("varchar", { length: 255 })
    descricao: string

    @Column("date")
    data: Date
}

