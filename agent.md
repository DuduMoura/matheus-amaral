# AGENT.md

# Sistema Automatizado para Padaria

## Objetivo

Este projeto consiste no desenvolvimento de um sistema de autoatendimento para padarias, composto por um totem para clientes e um painel administrativo para gerenciamento de produtos, estoque e pedidos.

O objetivo é reduzir o tempo de atendimento, diminuir erros humanos e facilitar o gerenciamento dos pedidos e do estoque.

---

# Escopo

O sistema possui cinco módulos principais:

1. Gestão de Produtos
2. Catálogo Digital
3. Carrinho de Compras
4. Gestão de Pedidos
5. Sistema de Senhas

Não implementar funcionalidades fora desse escopo sem solicitação.

---

# Tecnologias

## Frontend

* React
* JavaScript
* CSS

## Backend

* Firebase

## Banco de Dados

* Firebase Firestore

## Armazenamento de Arquivos

* Firebase Storage

---

# Arquitetura

A aplicação é dividida em duas interfaces com duas url diferentes:

## Cliente

Executada em um totem de autoatendimento.

Permite:

* visualizar catálogo;
* consultar ingredientes;
* consultar alergênicos;
* adicionar produtos ao carrinho;
* finalizar pedidos;
* receber senha.

## Administração

Utilizada por gerentes e funcionários.

Permite:

* cadastrar produtos;
* editar produtos;
* excluir produtos;
* controlar estoque;
* visualizar pedidos;
* concluir pedidos.

---

# Entidades Principais

## Produto

Campos mínimos:

* id
* nome
* categoria
* preço
* imagem
* ingredientes
* alergênicos
* estoque

---

## Pedido

Campos mínimos:

* id
* itens
* valorTotal
* senha
* status
* data

Status possíveis:

* Recebido
* Concluído
* Cancelado

---

## Categoria

Campos mínimos:

* id
* nome

---

# Regras de Negócio

## Produtos

* Todo produto possui categoria.
* Todo produto possui preço.
* Estoque nunca pode ser negativo.
* Apenas produtos com estoque disponível podem ser comprados.

## Carrinho

* Quantidade mínima igual a 1.
* Quantidade não pode ultrapassar o estoque.
* O valor total deve ser atualizado automaticamente.

## Pedidos

* Todo pedido inicia como **Recebido**.
* Apenas pedidos recebidos podem ser concluídos.
* Pedidos concluídos não podem ser alterados.

## Senhas

* Cada pedido possui uma senha única.
* A senha é gerada automaticamente.
* A senha identifica o pedido para clientes e funcionários.

---

# Atualização de Dados

Utilizar os recursos em tempo real do Firebase Firestore sempre que possível para sincronizar:

* produtos;
* estoque;
* pedidos.

Evitar atualizações manuais da interface.

---

# Organização do Projeto

```text
src/
 ├── components/
 ├── pages/
 │    ├── Catalogo/
 │    ├── Carrinho/
 │    ├── Produtos/
 │    ├── Pedidos/
 │    └── Login/
 ├── services/
 ├── hooks/
 ├── context/
 ├── firebase/
 └── assets/
```

---

# Padrões de Desenvolvimento

* Componentes reutilizáveis.
* Separação entre interface e lógica.
* Funções pequenas e com responsabilidade única.
* Evitar duplicação de código.
* Utilizar nomes descritivos para componentes, funções e variáveis.

---

# Interface

Priorizar uma interface simples e intuitiva.

No totem:

* botões grandes;
* navegação por toque;
* poucas etapas até finalizar um pedido.

No painel administrativo:

* foco em produtividade;
* visualização rápida dos pedidos;
* gerenciamento simples dos produtos.

---

# Fora do Escopo

Não implementar:

* pagamentos online;
* cadastro de clientes;
* programas de fidelidade;
* emissão de nota fiscal;
* múltiplas unidades da padaria.

Essas funcionalidades poderão ser adicionadas em versões futuras.

---

# Objetivo do Agente

Toda implementação deve seguir o PRD e a Specification do projeto.

Em caso de dúvida:

1. Priorizar simplicidade.
2. Não adicionar funcionalidades não especificadas.
3. Manter consistência entre catálogo, estoque e pedidos.
4. Garantir que toda alteração seja refletida automaticamente utilizando os recursos do Firebase.