# 4. Gestão de Pedidos (Administrador)

## Objetivo

Permitir o gerenciamento dos pedidos realizados pelos clientes.

## Requisitos Funcionais

### RF14 – Recebimento de Pedidos

O sistema deve receber pedidos enviados pelo totem.

### RF15 – Listagem de Pedidos

O sistema deve exibir pedidos recebidos.

### RF16 – Consulta de Pedido

O sistema deve permitir consultar pedidos específicos.

### RF17 – Alteração de Status

O sistema deve permitir alterar o status dos pedidos.

### RF18 – Conclusão de Pedido

O sistema deve registrar a entrega do pedido.

## Requisitos Técnicos

### RT11 – Sincronização em Tempo Real

Novos pedidos devem aparecer automaticamente para os funcionários.

### RT12 – Persistência dos Pedidos

Os pedidos devem ser armazenados no Firestore.

### RT13 – Integridade dos Dados

Todos os itens e valores do pedido devem ser preservados após sua criação.

## Dados Manipulados

| Campo      | Tipo    |
| ---------- | ------- |
| idPedido   | String  |
| itens      | Lista   |
| valorTotal | Decimal |
| senha      | Texto   |
| status     | Texto   |

## Fluxo

1. Cliente finaliza compra.
2. Pedido é registrado.
3. Pedido aparece para os funcionários.
4. Funcionário prepara o pedido.
5. Funcionário marca o pedido como concluído.

## Critérios de Aceitação

* Pedido aparece automaticamente.
* Pedido pode ser consultado.
* Status pode ser alterado.
* Pedido pode ser concluído.