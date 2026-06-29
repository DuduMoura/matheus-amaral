import React, { useState, useEffect } from 'react';
import './App.css';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';


function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState({});
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [numeroPedidoConfirmado, setNumeroPedidoConfirmado] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'produtos'));
        const produtosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProdutosDestaque(produtosData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, []);

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
    const produto = produtosDestaque.find((p) => String(p.id) === String(id));
    return acc + (produto ? Number(produto.preco || 0) * qtd : 0);
  }, 0);

  // Função para confirmar o pedido (Autoatendimento)
  const confirmarPedido = async () => {
    setIsCartModalOpen(false);
    
    try {
      const querySnapshot = await getDocs(collection(db, 'pedidos'));
      let proximoNumero = 1001;
      
      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        if (pedido.numero) {
          const numeroLimpo = pedido.numero.replace('#', '');
          const numInt = parseInt(numeroLimpo, 10);
          if (!isNaN(numInt) && numInt >= proximoNumero) {
            proximoNumero = numInt + 1;
          }
        }
      });
      
      const numeroGerado = `#${proximoNumero}`;
      setNumeroPedidoConfirmado(numeroGerado);

      const itensDoPedido = Object.entries(carrinho).map(([id, qtd]) => {
        const produto = produtosDestaque.find((p) => String(p.id) === String(id));
        return {
          nome: produto ? produto.nome : 'Produto Desconhecido',
          qtd: qtd,
          precoTotal: produto ? Number(produto.preco || 0) * qtd : 0
        };
      });

      await addDoc(collection(db, 'pedidos'), {
        numero: numeroGerado,
        total: totalPreco,
        itens: itensDoPedido,
        dataHora: new Date().toISOString()
      });

      setPedidoConfirmado(true);

      for (const [id, qtd] of Object.entries(carrinho)) {
        const produto = produtosDestaque.find((p) => String(p.id) === String(id));
        if (produto) {
          const novoEstoque = Math.max(0, parseInt(produto.estoque || 0) - qtd);
          await updateDoc(doc(db, 'produtos', String(id)), { estoque: novoEstoque });
        }
      }

      setProdutosDestaque(prev => prev.map(p => {
        const qtdComprada = carrinho[p.id] || 0;
        return { ...p, estoque: Math.max(0, parseInt(p.estoque || 0) - qtdComprada) };
      }));

      setTimeout(() => {
        setPedidoConfirmado(false);
        setCarrinho({});
        setProdutoSelecionado(null);
      }, 5000);

    } catch (error) {
      console.error("Erro ao salvar o pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };

  return (
    <>
      {/* --- Navbar --- */}
      <nav className="app-navbar">
        <div className="nav-content">
          <div className="nav-logo-group">
            <img src="/logo.png" alt="Logo Padaria" className="logo-img"/>
            <div className="logo"> Bread Pitt</div>
          </div>
          
          <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
            ☰
          </button>

          <ul className={`nav-links ${menuAberto ? 'open' : ''}`}>
            <li><a href="#home">Início</a></li>
            <li><a href="#produtos">Produtos</a></li>
            <li><a href="#sobre">Nossa História</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>
      </nav>

      <div className="app-container">
      {/* --- Hero Section --- */}
      <header id="home" className="hero">
        <div className="hero-content">
          <h1>O cheiro de pão quente <br/>no seu café da manhã</h1>
          <p>Feito com ingredientes seleccionados e muito carinho, do jeito caseiro que você adora.</p>
        </div>
      </header>

      {/* --- Produtos --- */}
      <section id="produtos" className="products-section">
        <h2>Nossos Produtos</h2>
        <div className="products-grid">
          {produtosDestaque.map((produto) => (
            <div key={produto.id} className="product-card" onClick={() => setProdutoSelecionado(produto)}>
              <div className="card-image">
                <img src={produto.imagem} alt={produto.nome} />
              </div>
              <div className="card-content">
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <span className="price">R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')} / un</span>
                
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
          ))}
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
            
            {produtoSelecionado.ingredientes && (
              <div className="modal-extra">
                <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{produtoSelecionado.ingredientes}</p>
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

      {/* --- Footer --- */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h3>Pão Artesanal</h3>
            <p>Trazendo o melhor para sua mesa desde 1990.</p>
          </div>
          <div className="footer-col">
            <h3>Horário de Funcionamento</h3>
            <p>Seg - Sáb: 6h00 - 20h00</p>
            <p>Dom: 7h00 - 12h00</p>
          </div>
          <div className="footer-col">
            <h3>Contato</h3>
            <p>Rua dos Padeiros, 123 - Centro</p>
            <p>(11) 99999-9999</p>
          </div>
        </div>
        <div className="copyright">
          © 2023 Padaria Pão Artesanal. Todos os direitos reservados.
        </div>
      </footer>

      {/* --- Modal de Revisar Pedido --- */}
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

      {/* --- Barra do Carrinho (Página do Cliente) --- */}
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
    </>
  );
}

export default App;