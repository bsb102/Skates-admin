import { useEffect, useMemo, useState } from 'react'
import { obtenerCatalogo, type Skate } from './api'
import { cerrarSesion, iniciarSesion } from './auth'
import './App.css'

type Pedido = {
  id: number
  cliente: string
  producto: string
  fecha: string
  estado: 'Pendiente' | 'Enviado' | 'Entregado'
  cantidad: number
  total: number
}

const pedidosDemo: Pedido[] = [
  { id: 101, cliente: 'Ana García', producto: 'Street / DC', fecha: '2026-09-17', estado: 'Enviado', cantidad: 2, total: 240000 },
  { id: 102, cliente: 'Luis Pérez', producto: 'Longboard / Loaded', fecha: '2026-09-16', estado: 'Pendiente', cantidad: 1, total: 180000 },
  { id: 103, cliente: 'Camila Soto', producto: 'Downhill / Rayne', fecha: '2026-09-15', estado: 'Entregado', cantidad: 3, total: 420000 },
  { id: 104, cliente: 'Diego Ruiz', producto: 'Street / Maui & Sons', fecha: '2026-09-14', estado: 'Pendiente', cantidad: 1, total: 110000 },
]

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

  const resumenStock = useMemo(() => {
    const totalStock = skates.reduce((sum, skate) => sum + (skate.stock ?? 0), 0)
    const modelos = new Set(skates.map((skate) => skate.modelo)).size
    const bajoStock = skates.filter((skate) => (skate.stock ?? 0) <= 5).length

    return { totalStock, modelos, bajoStock }
  }, [skates])

  const pedidos = useMemo(() => {
    return pedidosDemo.map((pedido) => ({
      ...pedido,
      producto: pedido.producto,
    }))
  }, [])

  if (!autenticado) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#0f172a', color: '#f8fafc' }}>
        <form onSubmit={(event) => { event.preventDefault(); iniciarSesion(usuario, clave).then(() => setAutenticado(true)).catch((loginError: Error) => setErrorLogin(loginError.message)); }} style={{ width: 'min(420px, 90vw)', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px' }}>
          <p style={{ color: '#f97316', fontWeight: 700 }}>SKATES ADMIN LOCAL</p>
          <h1>Acceso de administrador</h1>
          <input value={usuario} onChange={(event) => setUsuario(event.target.value)} placeholder='Usuario' style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '12px', boxSizing: 'border-box' }} />
          <input type='password' value={clave} onChange={(event) => setClave(event.target.value)} placeholder='Contraseña' style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '12px', boxSizing: 'border-box' }} />
          <button type='submit'>Entrar</button>
          {errorLogin && <p style={{ color: '#fca5a5' }}>{errorLogin}</p>}
          <small>Demo local: admin / admin123</small>
        </form>
      </main>
    )
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
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
              gap: '10px',
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
              gap: '10px',
            }}
          >
            📋 Órdenes y Pedidos
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px', height: '100vh', overflowY: 'auto', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>
              {activeTab === 'products' ? 'Panel de Productos' : 'Panel de Órdenes'}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Inventario en H2 y pedidos del negocio de skate.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '20px', border: '1px solid #334155' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            <button type='button' onClick={() => { cerrarSesion(); setAutenticado(false) }} style={{ fontSize: '12px', padding: '6px 10px' }}>Salir</button>
          </div>
        </header>

        <section style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', flex: 1 }}>
          {activeTab === 'products' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px' }}>
                  <small style={{ color: '#94a3b8' }}>Stock total</small>
                  <h3 style={{ margin: '10px 0 0', fontSize: '28px', color: '#f8fafc' }}>{resumenStock.totalStock}</h3>
                </div>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px' }}>
                  <small style={{ color: '#94a3b8' }}>Modelos</small>
                  <h3 style={{ margin: '10px 0 0', fontSize: '28px', color: '#f8fafc' }}>{resumenStock.modelos}</h3>
                </div>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px' }}>
                  <small style={{ color: '#94a3b8' }}>Stock bajo</small>
                  <h3 style={{ margin: '10px 0 0', fontSize: '28px', color: '#f8fafc' }}>{resumenStock.bajoStock}</h3>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Inventario guardado en H2</h3>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '14px' }}>{error ?? `${skates.length} productos cargados desde el backend.`}</p>

              <div style={{ marginTop: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <th style={{ textAlign: 'left', padding: '12px 10px', color: '#94a3b8' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '12px 10px', color: '#94a3b8' }}>Modelo</th>
                      <th style={{ textAlign: 'left', padding: '12px 10px', color: '#94a3b8' }}>Marca</th>
                      <th style={{ textAlign: 'left', padding: '12px 10px', color: '#94a3b8' }}>Medida</th>
                      <th style={{ textAlign: 'left', padding: '12px 10px', color: '#94a3b8' }}>Wheelbase</th>
                      <th style={{ textAlign: 'left', padding: '12px 10px', color: '#94a3b8' }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skates.map((skate) => (
                      <tr key={skate.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                        <td style={{ padding: '12px 10px' }}>{skate.id}</td>
                        <td style={{ padding: '12px 10px' }}>{skate.modelo}</td>
                        <td style={{ padding: '12px 10px' }}>{skate.marca}</td>
                        <td style={{ padding: '12px 10px' }}>{skate.medida ?? '—'}</td>
                        <td style={{ padding: '12px 10px' }}>{skate.wheelbase ?? '—'}</td>
                        <td style={{ padding: '12px 10px', color: skate.stock <= 5 ? '#fca5a5' : '#86efac', fontWeight: 700 }}>{skate.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#f8fafc' }}>Historial de Órdenes de Clientes</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Pedidos recientes del negocio, conectados al inventario y a la operación local.</p>

              <div style={{ display: 'grid', gap: '16px' }}>
                {pedidos.map((pedido) => (
                  <article key={pedido.id} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <div>
                        <small style={{ color: '#f97316' }}>Pedido #{pedido.id}</small>
                        <h4 style={{ margin: '6px 0 0', fontSize: '18px', color: '#f8fafc' }}>{pedido.cliente}</h4>
                      </div>
                      <span style={{ backgroundColor: pedido.estado === 'Entregado' ? '#14532d' : pedido.estado === 'Enviado' ? '#1d4ed8' : '#78350f', color: '#f8fafc', padding: '6px 10px', borderRadius: '999px', fontSize: '12px' }}>
                        {pedido.estado}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', color: '#cbd5e1' }}>
                      <div><strong>Producto:</strong><br />{pedido.producto}</div>
                      <div><strong>Cantidad:</strong><br />{pedido.cantidad}</div>
                      <div><strong>Fecha:</strong><br />{pedido.fecha}</div>
                      <div><strong>Total:</strong><br />${pedido.total.toLocaleString('es-CL')}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
