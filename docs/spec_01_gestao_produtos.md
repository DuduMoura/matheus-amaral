# 1. Gestão de Produtos (Administrador)

## Objetivo

Permitir que gerentes e funcionários mantenham o catálogo de produtos e o estoque atualizados.

## Requisitos Funcionais

### RF01 – Cadastro de Produto

O sistema deve permitir cadastrar produtos informando:

* Nome
* Fotografia
* Categoria
* Preço
* Ingredientes
* Alergênicos
* Quantidade em estoque

### RF02 – Edição de Produto

O sistema deve permitir alterar informações dos produtos cadastrados.

### RF03 – Exclusão de Produto

O sistema deve permitir remover produtos do catálogo.

### RF04 – Consulta de Produto

O sistema deve permitir visualizar produtos cadastrados.

### RF05 – Controle de Estoque

O sistema deve permitir adicionar ou remover itens do estoque.

## Requisitos Técnicos

### RT01 – Persistência dos Dados

Os produtos devem ser armazenados no Firebase Firestore.

### RT02 – Armazenamento de Imagens

As imagens dos produtos devem ser armazenadas no Firebase Storage.

### RT03 – Atualização Imediata

Alterações realizadas devem ser refletidas automaticamente no catálogo.

### RT04 – Validação de Dados

O sistema deve validar:

* Nome obrigatório;
* Categoria obrigatória;
* Preço maior que zero;
* Estoque não negativo.

## Dados Manipulados

| Campo        | Tipo    |
| ------------ | ------- |
| id           | String  |
| nome         | Texto   |
| foto         | URL     |
| categoria    | Texto   |
| preco        | Decimal |
| ingredientes | Lista   |
| alergenicos  | Lista   |
| estoque      | Inteiro |

## Fluxo

1. Administrador acessa a área de produtos.
2. Seleciona cadastrar, editar ou excluir.
3. Sistema valida os dados.
4. Dados são armazenados no Firestore.
5. Catálogo é atualizado automaticamente.

## Critérios de Aceitação

* Produto pode ser criado.
* Produto pode ser editado.
* Produto pode ser removido.
* Estoque é atualizado corretamente.
* Alterações aparecem no catálogo sem atualização manual.