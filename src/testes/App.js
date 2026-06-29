import React, { useState } from 'react';
import './App.css';

// Dados mockados para os produtos
const produtosDestaque = [
  {
    id: 1,
    nome: 'Pão Francês',
    descricao: 'Crocante por fora, macio por dentro. Feito todas as manhãs.',
    preco: 'R$ 12,00/kg',
    imagem: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    nome: 'Croissant',
    descricao: 'Massa folhada amanteigada, receita tradicional francesa.',
    preco: 'R$ 6,00 un',
    imagem: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    nome: 'Bolo de Chocolate',
    descricao: 'Molhadinho e rico, perfeito para o café da tarde.',
    preco: 'R$ 45,00 (inteiro)',
    imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    nome: 'Pão de Queijo',
    descricao: 'Sem glúten, crocante por fora e mole por dentro.',
    preco: 'R$ 25,00/kg',
    imagem: 'https://images.unsplash.com/photo-1589119908995-68329363d343?auto=format&fit=crop&w=600&q=80'
  }
];

function App() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="app-container">
      {/* --- Navbar --- */}
      <nav className="navbar">
        <div className="logo">Pão <span>Artesanal</span></div>
        
        <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>

        <ul className={`nav-links ${menuAberto ? 'open' : ''}`}>
          <li><a href="#home">Início</a></li>
          <li><a href="#produtos">Produtos</a></li>
          <li><a href="#sobre">Nossa História</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>

      {/* --- Hero Section --- */}
      <header id="home" className="hero">
        <div className="hero-content">
          <h1>O cheiro de pão quente <br/>no seu café da manhã</h1>
          <p>Feito com ingredientes seleccionados e muito carinho, do jeito caseiro que você adora.</p>
          <button className="btn-primary">Ver Cardápio</button>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1517686467724-ca559551694e?auto=format&fit=crop&w=800&q=80" alt="Pães diversos" />
        </div>
      </header>

      {/* --- Features --- */}
      <section className="features">
        <div className="feature-item">
          <span>🌾</span>
          <h3>Trigo 100% Nacional</h3>
          <p> apoiamos produtores locais.</p>
        </div>
        <div className="feature-item">
          <span>🔥</span>
          <h3>Forno à Lenha</h3>
          <p>Sabor defumado único.</p>
        </div>
        <div className="feature-item">
          <span>🚚</span>
          <h3>Entrega Rápida</h3>
          <p>Fresh na porta da sua casa.</p>
        </div>
      </section>

      {/* --- Produtos --- */}
      <section id="produtos" className="products-section">
        <h2>Nossos Principais Deles</h2>
        <div className="products-grid">
          {produtosDestaque.map((produto) => (
            <div key={produto.id} className="product-card">
              <div className="card-image">
                <img src={produto.imagem} alt={produto.nome} />
              </div>
              <div className="card-content">
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <span className="price">{produto.preco}</span>
                <button className="btn-add">Adicionar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
}

export default App;