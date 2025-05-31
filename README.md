# Desafio TechLab-WebApp, por João Henrique Flauzino

## Diário

Inicializei o projeto, utilizando todas as ferramentas previamente requisitadas (TypeORM, React), com SQLite para ter um aplicativo mais self-contained.
Optei por, no back-end, fazer uma pasta exclusiva para o banco de dados, onde eu consigo definir as entidades e configurar o DataSource do TypeORM.
Como temos um baixo número de entidades, que por si só são bem pequenas, optei por deixá-las no mesmo arquivo para reduzir o número de arquivos, deixando tanto o código quanto o projeto num geral mais limpo.
Achei mais correto utilizar o ActiveRecord ao invés do DataMapper por conta do volume da aplicação.
Resolvi utilizar uma id gerada automaticamente por consistência entre as contas e transações.
Atualmente, o método de gerar as transferências será com duas transações diferentes, uma de crédito e outra de débito.
Utilizei o conceito de transactions para executar as transferências, já que a atomicidade merece um cuidado a mais, pois pode acontecer da transação ser criada e o saldo não atualizado, ou vice-versa.
Adicionei os testes para os services de conta e transação, para melhorar a qualidade do código.

Iniciei o dia fazendo um layout básico do site, que me trouxe insights sobre como ele deve agir, e coisas que faltam no back-end.
Iniciei também, um leve esboço no front-end para o CRUD de contas.

Eu terminei a versão básica do front-end, e utilizei bastante tabelas para melhorar a visualização das contas e transações considerando o fato que elas tem a possibilidade de ter bastante quantidade vertical, e pode ser útil comparar as informações (conta corrente vs crédito, etc) de diferentes transações e diferentes.
Eu também iniciei todo o processo de edição e adição de contas com algo realmente muito baseado em contas, onde o registro se transformaria no formulário, o input do nome no mesmo lugar que o nome estava/estará.
Contudo, ao pensar num ponto de vista responsivo, isso não funcionaria tão bem, e ter um formulário feito de uma maneira completamente diferente no celular e no computador pode ser um indicador de um deisgn ruim, então eu repensei essa approach, e decidi distribuir as informações de formulário (de adição e exclusão) de maneira mais vertical. Creio que fazer assim é melhor, por conta do fato de ser mais consistente, além do fato de ter a informação que o usuário precisa focar para preencher disponibilizada em um outro eixo, deixa ela com um destaque maior.
