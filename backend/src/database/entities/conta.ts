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