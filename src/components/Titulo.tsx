'use client'
import Cookies from "js-cookie"
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi"
import Image from 'next/image';

export function Titulo() {
  const [adminNome, setAdminNome] = useState<string>("")

  useEffect(() => {
    const nome = Cookies.get("admin_logado_nome")
    if (nome) setAdminNome(nome)
  }, [])

  return (
    <nav className="bg-blue-400 border-gray-200 dark:bg-gray-900 flex flex-wrap justify-between fixed top-0 left-0 w-full z-50">
      <div className="flex flex-wrap justify-between max-w-screen-xl p-4">
        <Link href="/principal" className="flex items-center space-x-3 rtl:space-x-reverse">
          
          <Image
            src="/logo.png"
            alt="Abrigo"
            width={64}
            height={64}
            className="h-16 w-auto"
          />

          <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
            Adote.com - Acesso Administrativo
          </span>
        </Link>
      </div>

      {/* Nome do admin segue o mesmo padrão: dark:text-white */}
      <div className="flex me-4 items-center font-bold text-gray-900 dark:text-white">
        <FiUsers className="mr-2" />
        {adminNome}
      </div>
    </nav>
  )
}
