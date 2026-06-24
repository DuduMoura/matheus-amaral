# 5. Sistema de Senha (Administrador e Cliente)

## Objetivo

Permitir a identificação e consulta dos pedidos através de uma senha única.

## Requisitos Funcionais

### RF19 – Geração Automática de Senha

O sistema deve gerar uma senha ao finalizar um pedido.

### RF20 – Associação da Senha ao Pedido

A senha deve ser vinculada ao pedido correspondente.

### RF21 – Consulta por Senha

Funcionários devem localizar pedidos através da senha.

## Requisitos Técnicos

### RT14 – Unicidade

Cada pedido deve possuir uma senha única.

### RT15 – Persistência

As senhas devem ser armazenadas juntamente com os pedidos.

### RT16 – Geração Automática

A geração da senha deve ocorrer sem intervenção do usuário.

## Dados Manipulados

| Campo    | Tipo   |
| -------- | ------ |
| senha    | Texto  |
| idPedido | String |
| status   | Texto  |

## Fluxo

1. Cliente finaliza a compra.
2. Sistema cria o pedido.
3. Sistema gera uma senha única.
4. Senha é exibida ao cliente.
5. Funcionário utiliza a senha para localizar o pedido.

## Critérios de Aceitação

* Toda compra gera uma senha.
* Não existem senhas duplicadas.
* Funcionários conseguem localizar pedidos pela senha.
* Cliente recebe a senha após finalizar a compra.
