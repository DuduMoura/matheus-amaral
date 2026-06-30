
# 3. Carrinho de Compras (Cliente)

## Objetivo

Permitir que o cliente monte e revise seu pedido antes da finalização.

## Requisitos Funcionais

### RF09 – Adicionar Produto

Permitir adicionar produtos ao carrinho.

### RF10 – Alterar Quantidade

Permitir alterar quantidades dos produtos selecionados.

### RF11 – Remover Produto

Permitir remover produtos do carrinho.

### RF12 – Cálculo Automático

Permitir atualização automática do valor total.

### RF13 – Finalização da Compra

Permitir concluir o pedido.

## Requisitos Técnicos

### RT08 – Atualização Instantânea

O valor total deve ser recalculado automaticamente.

### RT09 – Validação de Estoque

A quantidade solicitada não pode exceder o estoque disponível.

### RT10 – Persistência Temporária

O carrinho deve permanecer armazenado durante a sessão de compra.

## Dados Manipulados

| Campo         | Tipo    |
| ------------- | ------- |
| produto       | Objeto  |
| quantidade    | Inteiro |
| valorUnitario | Decimal |
| valorTotal    | Decimal |

## Fluxo

1. Cliente seleciona um produto.
2. Produto é adicionado ao carrinho.
3. Cliente altera quantidades.
4. Sistema recalcula o valor total.
5. Cliente confirma a compra.
6. Pedido é gerado.

## Critérios de Aceitação

* Produtos podem ser adicionados.
* Produtos podem ser removidos.
* Quantidades podem ser alteradas.
* Valor total é atualizado automaticamente.
* Pedido é criado após confirmação.