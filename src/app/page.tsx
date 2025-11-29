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

  if (response.status == 200) {
    const admin = await response.json()

    Cookies.set("admin_logado_id", admin.id)
    Cookies.set("admin_logado_nome", admin.nome)
    Cookies.set("admin_logado_token", admin.token)

    router.push("/principal")      
  } 
  
  else if (response.status == 400) {
    toast.error("Erro... Login ou senha incorretos")
  } 
  
  // 👇 AQUI: mostrar exatamente o erro retornado pela API
  else if (response.status == 403) {
    const erroAPI = await response.json()
    toast.error(erroAPI.erro || "Acesso não permitido")
  }
}

  return (
    <main className="max-w-screen-xl flex flex-col items-center mx-auto p-6">
      <Image
        src="/logo.png"
        alt="Revenda"
        width={240}
        height={240} 
        className="d-block"
      />

      <div className="max-w-sm">
        <h1 className="text-3xl font-bold my-8">Admin: Adote.com</h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(verificaLogin)}>

    <div>
        <label 
            htmlFor="email" 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Email
        </label>

        <input
            type="email"
            id="email"
            placeholder="Login"
            required
            {...register("email")}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                       focus:ring-primary-600 focus:border-primary-600 
                       block w-full p-2.5 
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
    </div>

    <div>
        <label 
            htmlFor="password" 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Senha
        </label>

        <input
            type="password"
            id="password"
            placeholder="*******"
            required
            {...register("senha")}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                       focus:ring-primary-600 focus:border-primary-600 
                       block w-full p-2.5 
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
    </div>

    <div className="flex items-center justify-between">
        <a 
            href="#"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
            Esqueceu a senha?
        </a>
    </div>

    <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 
                   focus:ring-4 focus:outline-none focus:ring-blue-300 
                   font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
        Entrar
    </button>

    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Não tem cadastro?{" "}
        <a 
            href="/cadastro" 
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
            Criar conta
        </a>
    </p>

</form>
      </div>
    </main>
  );
}

