## Diário
### 19/05
Inicializei o projeto, utilizando todas as ferramentas previamente requisitadas (TypeORM, React), com SQLite para ter um aplicativo mais self-contained. 
Optei por, no back-end, fazer uma pasta exclusiva para o banco de dados, onde eu consigo definir as entidades e configurar o DataSource do TypeORM.
Como temos um baixo número de entidades, que por si só são bem pequenas, optei por deixá-las no mesmo arquivo para reduzir o número de arquivos, deixando tanto o código quanto o projeto num geral mais limpo.
Achei mais correto utilizar o ActiveRecord ao invés do DataMapper por conta do volume da aplicação.
Resolvi utilizar uma id gerada automaticamente por consistência entre as contas e transações.
Atualmente, o método de gerar as transferências será com duas transações diferentes, uma de crédito e outra de débito.
