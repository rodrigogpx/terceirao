// src/pages/HomePage.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, GraduationCap, DollarSign, Ticket, Trophy, LogIn, Eye, EyeOff, X } from 'lucide-react'
import ForestBg from '../components/ForestBg'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { useState } from 'react'

const CARDS = [
  { to: '/alunos', title: 'Alunos', desc: 'Conheça a turma', icon: Users, color: '#00ff88' },
  { to: '/professores', title: 'Professores', desc: 'Homenagens e história', icon: GraduationCap, color: '#00ccff' },
  { to: '/financeiro', title: 'Financeiro', desc: 'Meta e arrecadação', icon: DollarSign, color: '#ffcc00' },
  { to: '/rifas', title: 'Rifas', desc: 'Prêmios e participantes', icon: Ticket, color: '#ff9060' },
  { to: '/contribuidores', title: 'Contribuidores', desc: 'Ranking gamificado', icon: Trophy, color: '#aa88ff' },
]

export default function HomePage() {
  const { isAuth, user, logout, setAuth } = useAuthStore()
  const [loginOpen, setLoginOpen] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ username: '', password: '' })

  const handleLogin = async e => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.user, data.accessToken)
      setLoginOpen(false)
      setForm({ username: '', password: '' })
    } catch (e) {
      setErr(e.response?.data?.error || 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ForestBg/>

      <main className="relative z-10 p-5 pt-10">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display font-black text-3xl text-green-100 leading-tight">
              Turma <span style={{ color: '#00ff88' }}>Pantera</span>
            </h1>
            <p className="text-green-800 text-sm mt-2">Site de formatura — 3º Ano</p>
          </div>

          {isAuth && (
            <div className="glass p-4 mb-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-green-900">Logado como</p>
                  <p className="text-sm font-semibold text-green-200 truncate">{user?.name}</p>
                  <p className="text-xs font-mono text-green-800">{user?.role}</p>
                </div>
                <button className="btn-danger px-4 justify-center" onClick={logout}>Sair</button>
              </div>
            </div>
          )}

          {!isAuth && (
            <div className="flex justify-center mb-6">
              <button className="btn-ghost justify-center" onClick={() => setLoginOpen(true)}>
                <LogIn size={15} />
                Entrar (Admin)
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={c.to}
                  className="glass p-4 h-full block transition-transform"
                  style={{ borderColor: `${c.color}33` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-green-100 text-sm">{c.title}</p>
                      <p className="text-xs text-green-800 mt-1">{c.desc}</p>
                    </div>
                    <c.icon size={18} style={{ color: c.color }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {loginOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0" style={{ background: 'rgba(0,4,2,0.82)', backdropFilter: 'blur(10px)' }}
              onClick={() => setLoginOpen(false)} />

            <motion.div className="relative glass p-6 w-full max-w-sm"
              initial={{ scale: .78, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .78, y: 30 }}
              transition={{ type: 'spring', damping: 22 }}>
              <button onClick={() => setLoginOpen(false)} className="absolute top-4 right-4 text-green-800 hover:text-green-400 transition-colors">
                <X size={18} />
              </button>

              <h2 className="font-display text-lg font-bold text-green-100 text-center mb-1">Área Administrativa</h2>
              <p className="text-xs text-green-800 text-center uppercase tracking-widest mb-5">Acesso restrito</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="lbl">Usuário</label>
                  <input className="inp" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                </div>
                <div>
                  <label className="lbl">Senha</label>
                  <div className="relative">
                    <input className="inp pr-10" type={showPw ? 'text' : 'password'}
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-400">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {err && <p className="text-red-400 text-xs text-center py-2 rounded-lg" style={{ background: 'rgba(255,60,60,0.08)' }}>{err}</p>}
                <button type="submit" disabled={loading} className="btn-g w-full justify-center text-sm">
                  {loading ? '⏳ Entrando...' : <><LogIn size={15} /> Entrar</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
