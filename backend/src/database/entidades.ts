import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm"

@Entity()
export class Conta extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    nome: string

    @Column("tinyint")
    tipo: number

    @Column("double")
    saldo: number
}

export enum TipoConta {
    Corrente = 0,
    Poupanca = 1,
    Investimento = 2,
    CartaoCredito = 3,
}
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

