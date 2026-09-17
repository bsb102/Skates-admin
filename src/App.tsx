import { useEffect, useState } from 'react'
import { obtenerCatalogo, type Skate } from './api'
import { cerrarSesion, iniciarSesion } from './auth'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [skates, setSkates] = useState<Skate[]>([])
  const [error, setError] = useState<string | null>(null)
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem('skates-token')))
  const [errorLogin, setErrorLogin] = useState<string | null>(null)

  useEffect(() => {
    if (!autenticado) return
    obtenerCatalogo()
      .then(setSkates)
      .catch(() => setError('No se pudo cargar el inventario.'))
  }, [autenticado])

  if (!autenticado) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#0f172a', color: '#f8fafc' }}>
        <form 
          onSubmit={(event) => { 
            event.preventDefault(); 
            iniciarSesion(usuario, clave)
              .then(() => setAutenticado(true))
              .catch((loginError: Error) => setErrorLogin(loginError.message)); 
          }} 
          style={{ width: 'min(400px, 90vw)', padding: '36px', backgroundColor: '#1e293b', borderRadius: '14px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)' }}
        >
          <p style={{ color: '#f97316', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>SKATES ADMIN LOCAL</p>
          <h1 style={{ fontSize: '24px', marginBottom: '24px', color: '#f8fafc' }}>Acceso de administrador</h1>
          
          <div style={{ marginBottom: '16px' }}>
            <input 
              value={usuario} 
              onChange={(event) => setUsuario(event.target.value)} 
              placeholder='Usuario' 
              style={{ display: 'block', width: '100%', padding: '12px 14px', boxSizing: 'border-box', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', outline: 'none' }} 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input 
              type='password' 
              value={clave} 
              onChange={(event) => setClave(event.target.value)} 
              placeholder='Contraseña' 
              style={{ display: 'block', width: '100%', padding: '12px 14px', boxSizing: 'border-box', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', outline: 'none' }} 
            />
          </div>

          <button 
            type='submit' 
            style={{ width: '100%', padding: '12px', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s', marginBottom: '16px' }}
          >
            Entrar
          </button>

          {errorLogin && <p style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '12px' }}>{errorLogin}</p>}
          
          <small style={{ color: '#94a3b8', fontSize: '12px', display: 'block', textAlign: 'center' }}>Demo local: admin / admin123</small>
        </form>
      </main>
    )
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b', padding: '6px 14px', borderRadius: '20px', border: '1px solid #334155' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            <button 
              type='button' 
              onClick={() => { cerrarSesion(); setAutenticado(false) }} 
              style={{ fontSize: '13px', padding: '4px 10px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: '600' }}
            >
              Salir
            </button>
          </div>
        </header>

        <section style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', flex: 1 }}>
          {activeTab === 'products' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Inventario de Patinetas y Accesorios</h3>
                <button style={{ backgroundColor: '#f97316', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  + Agregar Nuevo Producto
                </button>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>{error ?? `${skates.length} productos cargados desde el backend.`}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', marginTop: '24px' }}>
                {skates.map((skate) => (
                  <article key={skate.id} style={{ padding: '18px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}>
                    <small style={{ color: '#f97316' }}>{skate.modelo}</small>
                    <h4 style={{ margin: '8px 0', color: '#f8fafc', fontSize: '18px' }}>{skate.marca}</h4>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                      {skate.medida ? `Medida ${skate.medida}"` : `Wheelbase ${skate.wheelbase}"`} · Stock {skate.stock}
                    </p>
                  </article>
                ))}
              </div>
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