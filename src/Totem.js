import React, { useState, useEffect } from 'react';
import './Totem.css';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Nosso novo arquivo

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  // null significa que nenhuma categoria específica está selecionada (ou seja, mostra todas por padrão)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  // Estado para controlar qual produto está sendo exibido no modal (popup)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  // Estado do Carrinho de Compras, guarda o ID do produto e a quantidade. Ex: { 1: 2, 3: 1 } (Dois pães franceses, um bolo)
  const [carrinho, setCarrinho] = useState({});
  // Estado para controlar a abertura do modal de "Revisar Pedido"
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  // Estado para controlar a exibição da tela de sucesso
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  // Estado para guardar a senha do pedido gerado
  const [numeroPedidoConfirmado, setNumeroPedidoConfirmado] = useState('');


  // Novos estados para os dados do Firebase
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados do Firebase ao carregar o app
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnapshot = await getDocs(collection(db, 'categorias'));
        setCategories(catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const prodSnapshot = await getDocs(collection(db, 'produtos'));
        setProdutosDestaque(prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      } finally {
        setLoading(false); // Remove a tela de carregamento após buscar
      }
    };
    fetchData();
  }, []);

  // Filtra os produtos com base na categoria selecionada
  const produtosEmEstoque = produtosDestaque.filter(produto => parseInt(produto.estoque || 0) > 0);
  const produtosFiltrados = categoriaSelecionada === null 
    ? produtosEmEstoque 
    : produtosEmEstoque.filter(produto => produto.categoriaId === categoriaSelecionada);

  // Função para adicionar ou remover quantidades
  const alterarQuantidade = (id, delta, e) => {
    e.stopPropagation(); // Impede que o card abra o modal ao clicar no + ou -
    setCarrinho((prev) => {
      const produto = produtosDestaque.find(p => String(p.id) === String(id));
      const estoqueDisponivel = produto ? parseInt(produto.estoque || 0) : 0;

      const novaQuantidade = (prev[id] || 0) + delta;

      if (novaQuantidade > estoqueDisponivel) {
        alert(`Desculpe, só temos ${estoqueDisponivel} unidades disponíveis em estoque.`);
        return prev;
      }

      if (novaQuantidade <= 0) {
        const novoCarrinho = { ...prev };
        delete novoCarrinho[id]; // Remove do carrinho se chegar a 0
        return novoCarrinho;
      }
      return { ...prev, [id]: novaQuantidade };
    });
  };

  const getQuantidade = (id) => carrinho[id] || 0;

  // Cálculos do Carrinho
  const totalItens = Object.values(carrinho).reduce((acc, curr) => acc + curr, 0);
  const totalPreco = Object.entries(carrinho).reduce((acc, [id, qtd]) => {
    // Usa String() pois os IDs do Firebase são strings alfanuméricas
    const produto = produtosDestaque.find((p) => String(p.id) === String(id));
    return acc + (produto ? Number(produto.preco || 0) * qtd : 0);
  }, 0);

  // Função para confirmar o pedido e resetar o totem
  const confirmarPedido = async () => {
    setIsCartModalOpen(false); // Fecha o popup do carrinho
    
    try {
      // 1. Busca todos os pedidos para achar o maior número gerado e continuar a sequência
      const querySnapshot = await getDocs(collection(db, 'pedidos'));
      // Início obrigatório: 1000 (caso não existam pedidos com número maior)
      let proximoNumero = 1000;


      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        // compatibilidade: número pode estar em `numero` (versões antigas)
        const numeroTexto = pedido.numero;
        if (typeof numeroTexto === 'string' && numeroTexto.startsWith('#')) {
          const numeroLimpo = numeroTexto.replace('#', '');
          const numInt = parseInt(numeroLimpo, 10);
          // Mantém sempre a sequência crescente a partir do maior número encontrado
          if (!isNaN(numInt) && numInt >= proximoNumero) {
            proximoNumero = numInt + 1;
          }

        }
      });

      // Gera a senha/número
      const numeroGerado = `#${proximoNumero}`;
      setNumeroPedidoConfirmado(numeroGerado);


      // 2. Prepara os itens do carrinho
      const itensDoPedido = Object.entries(carrinho).map(([id, qtd]) => {
        const produto = produtosDestaque.find((p) => String(p.id) === String(id));
        return {
          nome: produto ? produto.nome : 'Produto Desconhecido',
          qtd: qtd,
          precoTotal: produto ? Number(produto.preco || 0) * qtd : 0
        };
      });

      // 3. Salva no banco de dados na nuvem (Firebase)
      await addDoc(collection(db, 'pedidos'), {
        numero: numeroGerado,
        total: totalPreco,
        itens: itensDoPedido,
        status: 'Recebido',
        dataHora: new Date().toISOString()
      });


      setPedidoConfirmado(true); // Só exibe a tela de sucesso depois que salvar com segurança

      // 4. Atualiza o estoque no banco de dados
      for (const [id, qtd] of Object.entries(carrinho)) {
        const produto = produtosDestaque.find((p) => String(p.id) === String(id));
        if (produto) {
          const novoEstoque = Math.max(0, parseInt(produto.estoque || 0) - qtd);
          await updateDoc(doc(db, 'produtos', String(id)), { estoque: novoEstoque });
        }
      }

      // Atualiza o estado local para o próximo cliente não ver itens que esgotaram
      setProdutosDestaque(prev => prev.map(p => {
        const qtdComprada = carrinho[p.id] || 0;
        return { ...p, estoque: Math.max(0, parseInt(p.estoque || 0) - qtdComprada) };
      }));

      // 5. Aguarda 5 segundos antes de resetar o totem
      setTimeout(() => {
        setPedidoConfirmado(false);
        setCarrinho({});
        setCategoriaSelecionada(null);
        setProdutoSelecionado(null);
        setNumeroPedidoConfirmado('');
      }, 5000);


    } catch (error) {
      console.error("Erro ao salvar o pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-screen">Carregando cardápio...</div>
      )}

      {/* --- Hero Section --- */}
      <header id="home" className="hero">
        <div className="hero-content">
          <h1>O que deseja pedir hoje?</h1>
          <p>Feito com ingredientes selecionados e muito carinho, do jeito caseiro que você adora.</p>
        </div>
      </header>

      {/* --- Categorias --- */}
      <section className="categories-section"> 
        <div className="categories-grid">
          {categories.map((category) => {
            // Verifica se a categoria atual é a mesma que está no estado
            const isSelected = categoriaSelecionada === category.id;
            return (
              <button 
                key={category.id} 
                className={`category-button ${isSelected ? 'selected' : ''}`}
                onClick={() => setCategoriaSelecionada(isSelected ? null : category.id)}
              >
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- Produtos --- */}
      <section id="produtos" className="products-section">
        <h2>{categoriaSelecionada ? 'Produtos da Categoria' : 'Nossos Principais Deles'}</h2>
        <div className="products-grid">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((produto) => (
              <div 
                key={produto.id} 
                className="product-card" 
                onClick={() => setProdutoSelecionado(produto)}
              >
                <div className="card-image">
                  <img src={produto.imagem} alt={produto.nome} />
                </div>
                <div className="card-content">
                  <h3>{produto.nome}</h3>
                  <span className="price">R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')} / un</span>
                  <div className="stock-info" style={{ textAlign: 'center' }}>
                    Disponível: {Number(produto.estoque || 0)}
                  </div>
                  

                  
                  {getQuantidade(produto.id) > 0 ? (
                    <div className="quantity-control" onClick={(e) => e.stopPropagation()}>
                      <button className="btn-qty" onClick={(e) => alterarQuantidade(produto.id, -1, e)}>-</button>
                      <span className="qty-value">{getQuantidade(produto.id)}</span>
                      <button className="btn-qty" onClick={(e) => alterarQuantidade(produto.id, 1, e)}>+</button>
                    </div>
                  ) : (
                    <button className="btn-add" onClick={(e) => alterarQuantidade(produto.id, 1, e)}>Adicionar</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado para esta categoria no momento.</p>
          )}
        </div>
      </section>



      {/* --- Modal do Produto --- */}
      {produtoSelecionado && (
        <div className="modal-overlay" onClick={() => setProdutoSelecionado(null)}>
          {/* O e.stopPropagation() no content evita que o clique dentro do modal o feche */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProdutoSelecionado(null)}>×</button>
            <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} className="modal-image" />
            <h2>{produtoSelecionado.nome}</h2>
            <p className="modal-description">{produtoSelecionado.descricao}</p>
            <span className="modal-price">R$ {Number(produtoSelecionado.preco || 0).toFixed(2).replace('.', ',')} / un</span>
            
            {(produtoSelecionado.ingredientes || produtoSelecionado.alergenicos) && (
              <div className="modal-extra">
                {produtoSelecionado.ingredientes && (
                  <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                    <strong>Ingredientes:</strong> {produtoSelecionado.ingredientes}
                  </p>
                )}

                {produtoSelecionado.alergenicos && (
                  <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                    <strong>Alergênicos:</strong> {produtoSelecionado.alergenicos}
                  </p>
                )}
              </div>
            )}

            
            {getQuantidade(produtoSelecionado.id) > 0 ? (
              <div className="quantity-control modal-qty">
                <button className="btn-qty" onClick={(e) => alterarQuantidade(produtoSelecionado.id, -1, e)}>-</button>
                <span className="qty-value">{getQuantidade(produtoSelecionado.id)}</span>
                <button className="btn-qty" onClick={(e) => alterarQuantidade(produtoSelecionado.id, 1, e)}>+</button>
              </div>
            ) : (
              <button className="btn-primary modal-btn-add" onClick={(e) => alterarQuantidade(produtoSelecionado.id, 1, e)}>Adicionar ao Carrinho</button>
            )}
          </div>
        </div>
      )}

      {/* --- Modal de Revisar Pedido --- */}
      {/* O modal só renderiza se estiver aberto E tiver itens no carrinho */}
      {isCartModalOpen && totalItens > 0 && (
        <div className="modal-overlay" onClick={() => setIsCartModalOpen(false)}>
          <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsCartModalOpen(false)}>×</button>
            <h2>Seu Pedido</h2>
            
            <div className="cart-items-list">
              {Object.entries(carrinho).map(([id, qtd]) => {
                const produto = produtosDestaque.find(p => String(p.id) === String(id));
                if (!produto) return null;
                
                return (
                  <div key={id} className="cart-item">
                    <img src={produto.imagem} alt={produto.nome} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4>{produto.nome}</h4>
                      <span className="cart-item-price">R$ {(Number(produto.preco || 0) * qtd).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="quantity-control cart-item-qty">
                      <button className="btn-qty" onClick={(e) => alterarQuantidade(produto.id, -1, e)}>-</button>
                      <span className="qty-value">{qtd}</span>
                      <button className="btn-qty" onClick={(e) => alterarQuantidade(produto.id, 1, e)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-total-section">
              <h3><span>Total:</span> <span>R$ {totalPreco.toFixed(2).replace('.', ',')}</span></h3>
              <button className="btn-primary btn-finish" onClick={confirmarPedido}>Confirmar Pedido</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Barra do Carrinho (Autoatendimento) --- */}
      {totalItens > 0 && (
        <div className="cart-fixed-bar">
          <div className="cart-info">
            <span className="cart-icon">🛒</span>
            <span className="cart-details">{totalItens} {totalItens === 1 ? 'item' : 'itens'} | R$ {totalPreco.toFixed(2).replace('.', ',')}</span>
          </div>
          <button className="btn-checkout" onClick={() => setIsCartModalOpen(true)}>Revisar Pedido</button>
        </div>
      )}

      {/* --- Tela de Sucesso --- */}
      {pedidoConfirmado && (
        <div className="success-overlay">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Pedido Confirmado!</h2>
            <p>Seu número de pedido é:</p>
            <div className="order-number">{numeroPedidoConfirmado}</div>
            <p className="success-footer">Aguarde sua senha no painel.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;