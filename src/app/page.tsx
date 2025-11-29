'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import Image from 'next/image';
import Cookies from 'js-cookie'

type Inputs = {
  email: string
  senha: string
}

export default function Home() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const router = useRouter()

  useEffect(() => {
    setFocus("email")
  }, [setFocus])

  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins/login`, {
      method: "POST",
      headers: {"Content-type": "Application/json"},
      body: JSON.stringify({ email: data.email, senha: data.senha })
    })

    // -------------------------------
    // LOGIN OK
    // -------------------------------
    if (response.status === 200) {
      const admin = await response.json()

      // Salva sessão
      Cookies.set("admin_logado_id", admin.id)
      Cookies.set("admin_logado_nome", admin.nome)
      Cookies.set("admin_logado_token", admin.token)

      // ⚠️ SE ESTIVER USANDO SENHA PADRÃO → REDIRECIONA PARA TROCA OBRIGATÓRIA
      if (admin.senhaPadrao) {
        router.push("/principal/alterar-senha-obrigatorio")
        return
      }

      // Login normal
      router.push("/principal")
      return
    }

    // -------------------------------
    // ERRO 400: login ou senha incorretos
    // -------------------------------
    else if (response.status === 400) {
      toast.error("Erro... Login ou senha incorretos")
    }

    // -------------------------------
    // ERRO 403: mostrar mensagem da API
    // -------------------------------
    else if (response.status === 403) {
      const erroAPI = await response.json()
      toast.error(erroAPI.erro || "Acesso não permitido")
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center mx-auto p-6 bg-gray-100">

  <Image
    src="/logo.png"
    alt="Revenda"
    width={240}
    height={240}
    className="mb-6"
  />

  <div className="max-w-sm bg-white shadow-md rounded-xl p-8 border border-gray-200 w-full">

    <h1 className="text-3xl font-bold mb-6 text-center">Admin: Adote.com</h1>

    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(verificaLogin)}>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          type="email"
          placeholder="Login"
          required
          {...register("email")}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                     focus:ring-primary-600 focus:border-primary-600 
                     block w-full p-2.5"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Senha
        </label>
        <input
          type="password"
          placeholder="*******"
          required
          {...register("senha")}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                     focus:ring-primary-600 focus:border-primary-600 
                     block w-full p-2.5"
        />
      </div>

      <div className="flex items-center justify-between">
        <a className="text-sm font-medium text-primary-600 hover:underline">
          Esqueceu a senha?
        </a>
      </div>

      <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 
                   focus:ring-4 focus:outline-none focus:ring-blue-300 
                   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Entrar
      </button>

    </form>

  </div>
</main>
  );
}
