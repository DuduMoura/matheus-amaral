import React, { useState, useEffect } from 'react';
import './Adm.css';
import './Adm.header.css';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [activeTab, setActiveTab] = useState('pedidos'); // pedidos, pedidosConcluidos, estoque, produtos, categorias

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosConcluidos, setPedidosConcluidos] = useState([]);

  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do Firebase ao carregar o dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnapshot = await getDocs(collection(db, 'categorias'));
        setCategories(catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const prodSnapshot = await getDocs(collection(db, 'produtos'));
        setProdutos(prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const pedSnapshot = await getDocs(collection(db, 'pedidos'));
        const pedidosData = pedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPedidos(pedidosData.filter(p => p.status !== 'Concluído'));
        setPedidosConcluidos(pedidosData.filter(p => p.status === 'Concluído'));

      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handlers do Administrador
  const finalizarPedido = async (id) => {
    if (!window.confirm("Deseja realmente finalizar este pedido?")) return;

    try {
      // Se já está concluído, vamos "remover da lista" ocultando
      // (não deleta do Firestore; apenas muda o status para não aparecer nas listas).
      const docRef = doc(db, 'pedidos', String(id));
      const snap = await (await import('firebase/firestore')).getDoc(docRef);
      const currentStatus = snap.exists() ? snap.data()?.status : null;

      const novoStatus = currentStatus === 'Concluído' ? 'Oculto' : 'Concluído';

      await updateDoc(docRef, { status: novoStatus });



      // Recarrega do Firestore para garantir que a lista de concluídos está correta
      const pedSnapshot = await getDocs(collection(db, 'pedidos'));
      const pedidosData = pedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPedidos(pedidosData.filter(p => p.status !== 'Concluído'));
      setPedidosConcluidos(pedidosData.filter(p => p.status === 'Concluído'));
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido.");
    }
  };


  // Adiciona ou Remove estoque clicando no (+) e (-) sincronizando com o Firebase
  const updateStock = async (id, delta) => {
    const p = produtos.find(prod => prod.id === id);
    if (!p) return;
    const novoEstoque = Math.max(0, p.estoque + delta);
    
    setProdutos(prev => prev.map(prod => prod.id === id ? { ...prod, estoque: novoEstoque } : prod));
    
    try {
      await updateDoc(doc(db, 'produtos', String(id)), { estoque: novoEstoque });
    } catch (e) {
      console.error("Erro ao atualizar estoque:", e);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza apenas localmente enquanto o admin digita no input
  const setManualStock = (id, value) => {
    const novoEstoque = parseInt(value, 10);
    setProdutos(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, estoque: isNaN(novoEstoque) ? 0 : Math.max(0, novoEstoque) };
      }
      return p;
    }));
  };

  // Salva no Firebase quando o admin tira o foco (onBlur) do input de estoque
  const saveManualStockDB = async (id, estoque) => {
    try {
      await updateDoc(doc(db, 'produtos', String(id)), { estoque });
    } catch(e) {
      console.error("Erro ao salvar estoque manual:", e);
    }
  };

  // Prepara o modal para criar um novo produto (id nulo)
  const handleAddProduct = () => {
    setEditingProduct({
      id: null,
      nome: '',
      categoriaId: '',
      descricao: '',
      ingredientes: '',
      preco: '',
      estoque: 0,
      imagem: ''
    });
  };

  // Exclui um produto local e no Firebase
  const deleteProduct = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteDoc(doc(db, 'produtos', String(id)));
        setProdutos(prev => prev.filter(p => p.id !== id));
        setEditingProduct(null);
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto.");
      }
    }
  };

  // Cria ou Edita um produto enviando pro Firebase
  const saveProduct = async () => {
    if (!editingProduct.nome) return alert("O nome do produto é obrigatório!");
    if (!editingProduct.categoriaId) return alert("A categoria é obrigatória!");
    
    const prodData = {
      nome: editingProduct.nome,
      descricao: editingProduct.descricao,
      ingredientes: editingProduct.ingredientes || '',
      preco: parseFloat(editingProduct.preco) || 0,
      estoque: parseInt(editingProduct.estoque) || 0,
      imagem: editingProduct.imagem,
      categoriaId: editingProduct.categoriaId
    };

    try {
      if (editingProduct.id) {
        await updateDoc(doc(db, 'produtos', String(editingProduct.id)), prodData);
        setProdutos(prev => prev.map(p => p.id === editingProduct.id ? { id: p.id, ...prodData } : p));
      } else {
        const docRef = await addDoc(collection(db, 'produtos'), prodData);
        setProdutos(prev => [...prev, { id: docRef.id, ...prodData }]);
      }
      setEditingProduct(null);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Verifique o console.");
    }
  };

  // Handlers de Categorias
  const handleCategoryEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    setEditingCategory({
      id: null,
      name: '',
      image: ''
    });
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await deleteDoc(doc(db, 'categorias', String(id)));
        setCategories(prev => prev.filter(c => c.id !== id));
        setEditingCategory(null);
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        alert("Erro ao excluir categoria.");
      }
    }
  };

  const saveCategory = async () => {
    if (!editingCategory.name) return alert("O nome da categoria é obrigatório!");
    
    const catData = {
      name: editingCategory.name,
      image: editingCategory.image || ''
    };

    try {
      if (editingCategory.id) {
        await updateDoc(doc(db, 'categorias', String(editingCategory.id)), catData);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { id: c.id, ...catData } : c));
      } else {
        const docRef = await addDoc(collection(db, 'categorias'), catData);
        setCategories(prev => [...prev, { id: docRef.id, ...catData }]);
      }
      setEditingCategory(null);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria. Verifique o console.");
    }
  };

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-screen">Carregando Painel Administrativo...</div>
      )}

      {/* --- Navbar --- */}
      <nav className="admin-navbar">
        <div className="admin-logo"> Bread <span>Pitt | Admin</span></div>
        <ul className="admin-nav-links">
<li><a className={`cursor-pointer ${activeTab === 'pedidos' ? 'admin-tab-active' : ''}`} onClick={() => setActiveTab('pedidos')}>Pedidos em Aberto</a></li>
<li><a className={`cursor-pointer ${activeTab === 'pedidosConcluidos' ? 'admin-tab-active' : ''}`} onClick={() => setActiveTab('pedidosConcluidos')}>Pedidos Concluídos</a></li>

          <li><a className={`cursor-pointer ${activeTab === 'estoque' ? 'admin-tab-active' : ''}`} onClick={() => setActiveTab('estoque')}>Controle de Estoque</a></li>
          <li><a className={`cursor-pointer ${activeTab === 'produtos' ? 'admin-tab-active' : ''}`} onClick={() => setActiveTab('produtos')}>Gerenciar Produtos</a></li>
          <li><a className={`cursor-pointer ${activeTab === 'categorias' ? 'admin-tab-active' : ''}`} onClick={() => setActiveTab('categorias')}>Gerenciar Categorias</a></li>
        </ul>
      </nav>

      {/* --- Aba: Pedidos em Aberto --- */}
      {activeTab === 'pedidos' && (
        <section className="products-section">
          <h2>Pedidos em Aberto</h2>


          <div className="orders-grid">
            {pedidos.length > 0 ? pedidos.map(pedido => (
              <div key={pedido.id} className="order-card">
                <h3>Pedido {pedido.numero}</h3>
                <ul className="order-items">
                  {(Array.isArray(pedido.itens) ? pedido.itens : Object.values(pedido.itens || {})).map((item, index) => (
                    <li key={index}>
                      <span>{item.qtd}x {item.nome}</span>
                      <span>R$ {Number(item.precoTotal || 0).toFixed(2).replace('.', ',')}</span>
                    </li>
                  ))}
                </ul>
                <span className="price">Total: R$ {Number(pedido.total || 0).toFixed(2).replace('.', ',')}</span>
                <button className="btn-primary" style={{width: '100%'}} onClick={() => finalizarPedido(pedido.id)}>Finalizar Pedido ✅</button>
              </div>
            )) : <p>Todos os pedidos foram finalizados! Bom trabalho.</p>}
          </div>
        </section>
      )}

      {/* --- Aba: Pedidos Concluídos --- */}
      {activeTab === 'pedidosConcluidos' && (
        <section className="products-section">
          <h2>Pedidos Concluídos</h2>

          <div className="orders-grid">
            {pedidosConcluidos.length > 0 ? (
              [...pedidosConcluidos].sort((a, b) => {
                const aNum = parseInt(String(a.numero || '').replace('#', ''), 10);
                const bNum = parseInt(String(b.numero || '').replace('#', ''), 10);
                if (Number.isNaN(aNum) && Number.isNaN(bNum)) return 0;
                if (Number.isNaN(aNum)) return 1;
                if (Number.isNaN(bNum)) return -1;
                return bNum - aNum; // decrescente
              }).map(pedido => (

                <div key={pedido.id} className="order-card">
                  <h3>Pedido {pedido.numero}</h3>
                  <ul className="order-items">
                    {(Array.isArray(pedido.itens) ? pedido.itens : Object.values(pedido.itens || {})).map((item, index) => (
                      <li key={index}>
                        <span>{item.qtd}x {item.nome}</span>
                        <span>R$ {Number(item.precoTotal || 0).toFixed(2).replace('.', ',')}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="price">Total: R$ {Number(pedido.total || 0).toFixed(2).replace('.', ',')}</span>

                  <button
                    className="btn-danger"
                    style={{ width: '100%', marginTop: '0.8rem' }}
                    onClick={() => finalizarPedido(pedido.id)}
                    title="Remover"
                  >
                    Remover 🗑️
                  </button>
                </div>
              ))
            ) : (
              <p>Nenhum pedido concluído ainda.</p>
            )}
          </div>
        </section>
      )}

      {/* --- Aba: Controle de Estoque --- */}
      {activeTab === 'estoque' && (

        <section className="products-section">
          <h2>Controle de Estoque</h2>
          <div className="stock-list">
            {produtos.map(p => (
              <div key={p.id} className="stock-item">
                <div className="stock-info">
                  <img src={p.imagem} alt={p.nome} />
                  <span>{p.nome}</span>
                </div>
                <div className="qty-control-admin">
                  <button onClick={() => updateStock(p.id, -1)}>-</button>
                  <input 
                    type="number" 
                    className="stock-input-inline" 
                    value={p.estoque} 
                    onChange={(e) => setManualStock(p.id, e.target.value)} 
                    onBlur={() => saveManualStockDB(p.id, p.estoque)}
                  />
                  <button onClick={() => updateStock(p.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Aba: Gerenciar Produtos --- */}
      {activeTab === 'produtos' && (
        <section className="products-section">
          <h2>Gerenciar Produtos</h2>
          <button className="btn-primary" style={{ marginBottom: '2rem' }} onClick={handleAddProduct}>+ Adicionar Novo Produto</button>
          <div className="products-grid">
            {produtos.map(produto => (
              <div key={produto.id} className="product-card">
                <div className="card-image">
                  <img src={produto.imagem} alt={produto.nome} />
                </div>
                <div className="card-content">
                  <h3>{produto.nome}</h3>
                  <p>{categories.find(c => c.id === produto.categoriaId)?.name || 'Sem Categoria'} | Estoque: {produto.estoque}</p>
                  <span className="price">R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
                  <button className="btn-add" onClick={() => setEditingProduct(produto)}>Editar Produto</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Aba: Gerenciar Categorias --- */}
      {activeTab === 'categorias' && (
        <section className="products-section">
          <h2>Gerenciar Categorias</h2>
          <button className="btn-primary" style={{ marginBottom: '2rem' }} onClick={handleAddCategory}>+ Adicionar Nova Categoria</button>
          <div className="products-grid">
            {categories.map(categoria => (
              <div key={categoria.id} className="product-card">
                <div className="card-image">
                  <img src={categoria.image} alt={categoria.name} />
                </div>
                <div className="card-content">
                  <h3>{categoria.name}</h3>
                  <button className="btn-add" onClick={() => setEditingCategory(categoria)}>Editar Categoria</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal de Edição (Pop-up) */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct.id ? `Editar: ${editingProduct.nome}` : 'Adicionar Novo Produto'}</h2>
            
            <label>Nome do Produto</label>
            <input name="nome" value={editingProduct.nome} onChange={handleEditChange} className="admin-input" />
            
            <label>Preço (R$)</label>
            <input name="preco" type="number" step="0.01" value={editingProduct.preco} onChange={handleEditChange} className="admin-input" />
            
            <label>Estoque Inicial</label>
            <input name="estoque" type="number" value={editingProduct.estoque} onChange={handleEditChange} className="admin-input" />
            
            <label>Categoria</label>
            <select name="categoriaId" value={editingProduct.categoriaId} onChange={handleEditChange} className="admin-input">
              <option value="">Selecione uma categoria...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            
            <label>Descrição</label>
            <textarea name="descricao" value={editingProduct.descricao} onChange={handleEditChange} className="admin-textarea" />
            
            <label>Informações Adicionais / Ingredientes</label>
            <textarea name="ingredientes" value={editingProduct.ingredientes || ''} onChange={handleEditChange} className="admin-textarea" />
            
            <label>URL da Imagem</label>
            <input name="imagem" value={editingProduct.imagem} onChange={handleEditChange} className="admin-input" />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn-primary" style={{ flex: 2 }} onClick={saveProduct}>Salvar</button>
              {editingProduct.id && (
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => deleteProduct(editingProduct.id)}>Excluir</button>
              )}
              <button className="btn-add" style={{ flex: 1 }} onClick={() => setEditingProduct(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Categoria (Pop-up) */}
      {editingCategory && (
        <div className="admin-modal-overlay" onClick={() => setEditingCategory(null)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingCategory.id ? `Editar: ${editingCategory.name}` : 'Adicionar Nova Categoria'}</h2>
            
            <label>Nome da Categoria</label>
            <input name="name" value={editingCategory.name} onChange={handleCategoryEditChange} className="admin-input" />
            
            <label>URL da Imagem</label>
            <input name="image" value={editingCategory.image} onChange={handleCategoryEditChange} className="admin-input" />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn-primary" style={{ flex: 2 }} onClick={saveCategory}>Salvar</button>
              {editingCategory.id && (
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => deleteCategory(editingCategory.id)}>Excluir</button>
              )}
              <button className="btn-add" style={{ flex: 1 }} onClick={() => setEditingCategory(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;