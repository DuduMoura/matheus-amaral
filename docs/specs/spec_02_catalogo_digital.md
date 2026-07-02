# 2. Catálogo Digital (Cliente)

## Objetivo

Permitir que os clientes consultem os produtos disponíveis e suas informações detalhadas.

## Requisitos Funcionais

### RF06 – Visualização de Produtos

O sistema deve exibir todos os produtos disponíveis.

### RF07 – Consulta de Informações

O sistema deve exibir:

* Nome;
* Fotografia;
* Categoria;
* Preço;
* Ingredientes;
* Alergênicos.

### RF08 – Navegação por Categorias

O sistema deve permitir visualizar produtos agrupados por categoria.

## Requisitos Técnicos

### RT05 – Consulta em Tempo Real

As informações exibidas devem ser sincronizadas com o Firestore.

### RT06 – Exibição de Imagens

As imagens devem ser carregadas a partir do Firebase Storage.

### RT07 – Compatibilidade com Totem

A interface deve ser adequada para telas touchscreen.

## Dados Manipulados

| Campo        | Tipo    |
| ------------ | ------- |
| produto      | Objeto  |
| categoria    | Texto   |
| preco        | Decimal |
| ingredientes | Lista   |
| alergenicos  | Lista   |

## Fluxo

1. Cliente acessa o totem.
2. Sistema consulta produtos disponíveis.
3. Catálogo é exibido.
4. Cliente seleciona um produto.
5. Informações detalhadas são apresentadas.

## Critérios de Aceitação

* Produtos são exibidos corretamente.
* Ingredientes são visíveis.
* Alergênicos são visíveis.
* Informações correspondem aos dados cadastrados.