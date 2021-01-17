import Head from 'next/head'
import React, { FormEvent, useState } from 'react'
import EllaLogo from '../assets/images/ella.png'
import { Container, Main } from '../styles/pages/Login'
import { api } from '../config/axios'
import { useRouter } from 'next/router'

const Login: React.FC = () => {
  const router = useRouter()

  const [user, setUser] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [error, setError] = useState<string>()
  const [label, setLabel] = useState('Entrar')

  const login = async (user: string, password: string): Promise<any> => {
    try {
      setLabel('Carregando...')
      const resp = await api.post('/api/auth', { user, password })
      setLabel('Entrar')

      return { code: resp.status, data: resp.data }
    } catch (error) {
      setLabel('Entrar')
      return { code: 401, data: { error: 'Erro ao tentar fazer login' } }
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (user.trim().length === 0 || password.trim().length === 0) {
      setError('Informe um Usuário e Senha válidos')
    }

    const resp = await login(user, password)
    if (resp.code !== 200) {
      setError(resp.data.error)
    }

    const token = resp.data.data.token
    window.localStorage.setItem('@ella-web', token)
    api.defaults.headers.Authorization = `Bearer ${token}`
    router.push('/')
  }

  return (
    <Container>
      <Head>
        <title>EllA Money Web</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <Main>
        <header>
          <img src={EllaLogo} alt="Ella Logo" />
          <h3>Login</h3>
        </header>
        <form onSubmit={submit}>
          <input
            onChange={e => setUser(e.target.value)}
            type="text"
            placeholder="Usuário"
            name="User"
            required
          />
          <input
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Senha"
            name="Password"
            required
          />
          <button type="submit">{label}</button>
          <p>{error}</p>
        </form>
      </Main>
    </Container>
  )
}

export default Login
