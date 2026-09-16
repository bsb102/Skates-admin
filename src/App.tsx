import { useState } from 'react'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      {/* Barra Lateral (Sidebar) Estilo Urbano */}
      <aside style={{ width: '280px', backgroundColor: '#090d16', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '24px 20px', fontSize: '22px', fontWeight: '800', letterSpacing: '0.5px', color: '#f97316', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b' }}>
          <span>SKATES</span> <span style={{ color: '#f8fafc', fontSize: '14px', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px' }}>ADMIN</span>
        </div>
        
        <nav style={{ padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{
              padding: '14px 16px',
              textAlign: 'left',
              backgroundColor: activeTab === 'products' ? '#f97316' : 'transparent',
              color: activeTab === 'products' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📦 Gestión de Productos
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '14px 16px',
              textAlign: 'left',
              backgroundColor: activeTab === 'orders' ? '#f97316' : 'transparent',
              color: activeTab === 'orders' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📋 Órdenes y Pedidos
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '40px', height: '100vh', overflowY: 'auto', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>
              {activeTab === 'products' ? 'Panel de Productos' : 'Panel de Órdenes'}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Administra el inventario y los pedidos de la tienda de skate.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '20px', border: '1px solid #334155' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>Sistema Conectado</span>
          </div>
        </header>

        <section style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', flex: 1 }}>
          {activeTab === 'products' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Inventario de Patinetas y Accesorios</h3>
                <button style={{ backgroundColor: '#f97316', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}>
                  + Agregar Nuevo Producto
                </button>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Aquí podrás dar de alta, modificar precios o eliminar los artículos disponibles en la tienda.</p>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#f8fafc' }}>Historial de Órdenes de Clientes</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Revisa el estado de los envíos y las compras realizadas en la plataforma.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
