'use client'

import Cookies from "js-cookie"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FiUsers, FiMenu } from "react-icons/fi"
import Image from "next/image"

export function Titulo({ abrirMenuMobile }: { abrirMenuMobile: () => void }) {
  const [adminNome, setAdminNome] = useState("")

  useEffect(() => {
    const nome = Cookies.get("admin_logado_nome")
    if (nome) setAdminNome(nome)
  }, [])

  return (
    <nav className="
      bg-blue-400 
      dark:bg-gray-900 
      fixed top-0 left-0 w-full z-50 
      flex items-center justify-between
      px-4 h-20
    ">

      {/* Botão Mobile */}
      <button
        className="text-white text-3xl sm:hidden"
        onClick={abrirMenuMobile}
      >
        <FiMenu />
      </button>

      {/* Logo + Título */}
      <Link href="/principal" className="flex items-center space-x-3">
        <Image
          src="/logo.png"
          alt="Abrigo"
          width={64}
          height={64}
          className="h-16 w-auto"
        />

        <span className="text-2xl sm:text-3xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
          Adote.com - Acesso Administrativo
        </span>
      </Link>

      {/* Nome admin */}
      <div className="flex items-center font-bold text-gray-900 dark:text-white">
        <FiUsers className="mr-2" />
        {adminNome}
      </div>
    </nav>
  )
}
