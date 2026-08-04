import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { Session } from '@supabase/supabase-js'

const G = '#c9a227'
const D = '#1a1207'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #5a3f10',
  borderRadius: 6,
  padding: '10px 12px',
  color: '#f5e6c8',
  fontFamily: 'Georgia,serif',
  fontSize: 15,
  outline: 'none',
  marginBottom: 12,
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 20,
  border: '1px solid ' + G,
  background: G,
  color: D,
  fontSize: 15,
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'Georgia,serif',
  marginTop: 4,
}

const linkStyle: React.CSSProperties = {
  color: G,
  cursor: 'pointer',
  fontSize: 13,
  textAlign: 'center',
  display: 'block',
  marginTop: 14,
  textDecoration: 'underline',
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoadingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMensagem('')
    setCarregando(true)

    if (modo === 'entrar') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) setMensagem('Erro ao entrar: ' + error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha })
      if (error) setMensagem('Erro ao cadastrar: ' + error.message)
      else setMensagem('Cadastro feito! Se pedir confirmacao, verifique seu e-mail. Caso contrario, clique em Entrar.')
    }

    setCarregando(false)
  }

  if (loadingSession) {
    return (
      <div style={{ minHeight: '100vh', background: D, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0a060', fontFamily: 'Georgia,serif' }}>
        Carregando...
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: D, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: '100%', maxWidth: 380, background: 'rgba(40,25,5,0.85)', border: '1px solid #5a3f10', borderRadius: 12, padding: 28 }}>
          <h1 style={{ color: G, fontFamily: 'Georgia,serif', fontSize: 20, textAlign: 'center', marginBottom: 4 }}>
            Assistente de Sermões
          </h1>
          <p style={{ color: '#c0a060', fontSize: 13, textAlign: 'center', marginBottom: 22 }}>
            {modo === 'entrar' ? 'Entre para acessar sua Biblioteca' : 'Crie sua conta'}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              style={inputStyle}
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              required
            />
            <button style={buttonStyle} type="submit" disabled={carregando}>
              {carregando ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          {mensagem && (
            <p style={{ color: '#f0e0b8', fontSize: 13, marginTop: 14, textAlign: 'center' }}>{mensagem}</p>
          )}

          <span
            style={linkStyle}
            onClick={() => {
              setModo(modo === 'entrar' ? 'cadastrar' : 'entrar')
              setMensagem('')
            }}
          >
            {modo === 'entrar' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
          </span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
