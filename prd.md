# Problema:
Grande parte das padarias ainda depende de processos manuais para atendimento, controle de estoque e gerenciamento de pedidos. Isso gera:
- Lentidão no atendimento.
- Erros humanos durante a venda.
- Falta de informações sobre ingredientes e alergênicos.
- Dificuldade no controle de estoque.
- Falta de acompanhamento dos pedidos.
- Dependência do conhecimento dos funcionários.

# Público-Alvo:
## Clientes com Restrições Alimentares
Pessoas com:
- Intolerância à lactose.
- Intolerância ao glúten.
- Alergia a ovos.
- Alergia a amendoim.
- Outras restrições alimentares.
Necessidade: Consultar ingredientes e alergênicos dos produtos.
## Consumidores com Alimentação Consciente
Pessoas que seguem dietas:
- Vegana.
- Low Carb.
- Sem açúcar.
- Alimentação saudável.
Necessidade: Conhecer a composição dos alimentos.
## Proprietários, Gerentes e Funcionários
- Controlar produtos.
- Acompanhar pedidos.
- Gerenciar estoque.
- Aumentar produtividade.
- Consultar informações dos produtos.
- Organizar pedidos.
- Reduzir erros de atendimento.

# Funcionalidades:
## Gestão de Produtos
- Cadastro de produtos.
- Edição de produtos.
- Exclusão de produtos.
- Consulta de produtos.
- Gestão completa de estoque.


O gerente do estabelecimento em questão terá a capacidade de criar qualquer produto que desejar, definindo seu nome, fotografia, valor unitário e à qual categoria aquele produto pertence. Após sua criação, conseguirá a qualquer momento editar as informações para atualizar ou corrigir algum campo, bem como realizar a exclusão ou apenas consulta do produto.
Ele também conseguirá gerenciar em tempo real o estoque de cada produto, adicionando ou removendo itens dependendo de sua necessidade.

## Gestão de Pedidos
- Recebimento de pedidos.
- Listagem de pedidos.
- Alteração de status.
- Conclusão de pedidos.

O gerente e funcionários do estabelecimento em questão poderão visualizar em tempo real os pedidos realizados pelos seus clientes, tendo acesso a todas as informações de quantidades de cada produto, valor individual por produto e valor total do pedido. Com o pedido tendo sido gerado, conseguirão marcar a conclusão do mesmo, maneira na qual realizarão o registro da entrega do pedido ao cliente que o solicitou.

## Catálogo Digital
- Exibição dos produtos.
- Informações detalhadas.
- Consulta de ingredientes.
- Consulta de alergênicos.

Os clientes do estabelecimento em questão terão acesso a todo o catálogo de produtos em estoque através do totem de atendimento. Lá, poderão ver os produtos e suas informações detalhadas, como sua composição de ingredientes para aqueles que possuirem alguma limitação alimentar.

## Carrinho de Compras
- Adicionar produtos.
- Remover produtos.
- Alterar quantidades.
- Calcular valor total.

Dentro do totem de atendimento do estabelecimento em questão, os clientes poderão selecionar os produtos que desejam comprar, recebendo o retorno em tempo real do valor atual do carrinho de compras, tendo a possibilidade de remover e alterar a quantidade de cada produto quando desejar antes de finalizar seu pedido.

## Sistema de Senha
- Geração automática de código.
- Identificação do pedido.
- Consulta do pedido pelo gerente.

Tendo finalizado uma compra através do carrinho, o cliente receberá automaticamente um código de identificação do seu pedido, código esse que também será utilizado pelos funcionários para consultar o pedido em questão.

# Fluxos
## Fluxo do Cliente
- Acessar totem de atendimento.
- Visualizar catálogo.
- Consultar informações do produto.
- Adicionar itens ao carrinho.
- Visualizar pedido.
- Finalizar compra.
- Receber senha do pedido.

O cliente com acesso ao totem de atendimento terá acesso a todos os produtos, podendo buscar o que deseja e quando necessário consultar as informações detalhadas.
Tendo escolhido o produto, poderá adiciona-lo no carrinho, alterando a quantidade até que esteja pronto para finalizar a compra.
Antes de finalizar a compra, o sistema entregará ao cliente uma visualização completa e detalhada do seu pedido para conferência.
Tendo finalizado sua compra, o cliente receberá a senha referente ao seu pedido, este que será enviado para os funcionários do estabelecimento.

## Fluxo do Gerente
- Acessar aba do gerenciamento.
- Gerenciar produtos.
- Visualizar pedidos recebidos.
- Marcar pedidos como concluídos.
- Criar e editar produtos.
- Gerenciar estoque.

O funcionário ou gerente poderão acessar as abas de gerenciamento de produtos, criando ou alterando os produtos, suas categorias ou seus estoques.
Poderão também acessar a aba de pedidos, que conterá os pedidos em abertos enviados pelo totem. Ali, quando finalizado o pedido, poderão marcar o mesmo como concluido para remove-lo da tela.
Por não possuir um acompanhamento da parte do cliente em tempo real do status do pedido, seu ciclo de vida será somente recebido, finalizado ou cancelado.