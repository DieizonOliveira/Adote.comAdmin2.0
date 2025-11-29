"use client"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { IoExitOutline } from "react-icons/io5"
import { RiInboxArchiveFill } from "react-icons/ri";
import { FaUsers, FaDog } from "react-icons/fa6"
import { IoMdHome } from "react-icons/io";
import Link from "next/link"

export function MenuLateral() {
  const router = useRouter()

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      Cookies.remove("admin_logado_id")
      Cookies.remove("admin_logado_nome")
      Cookies.remove("admin_logado_token")
      router.replace("/")
    }
  }

  return (
    <aside id="default-sidebar" className="fixed mt-24 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-190 dark:bg-blue-190">
        <ul className="space-y-2 font-medium">

          <li>
            <Link href="/principal" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <IoMdHome />
              </span>
              <span className="ms-2 mt-1">O Abrigo</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/animais" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <FaDog />
              </span>
              <span className="ms-2 mt-1">Cadastro de Animais</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/adotantes" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <FaUsers />
              </span>
              <span className="ms-2 mt-1">Cadastro de Adotantes</span>
            </Link>
          </li>

          {/* ➕ Novo item adicionado aqui */}
          <li>
            <Link href="/principal/admins" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <FaUsers />
              </span>
              <span className="ms-2 mt-1">Cadastro de Administradores</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/pedidos" className="flex items-center p-2 cursor-pointer">
              <span className="h-5 text-gray-600 text-2xl">
                <RiInboxArchiveFill />
              </span>
              <span className="ms-2 mt-1">Pedidos de Adoção</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/adocoes" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <FaDog />
              </span>
              <span className="ms-2 mt-1">Adoções</span>
            </Link>
          </li>

          <li>
            <span className="flex items-center p-2 cursor-pointer">
              <span className="h-5 text-gray-600 text-2xl">
                <IoExitOutline />
              </span>
              <span className="ms-2 mt-1" onClick={adminSair}>Sair do Sistema</span>
            </span>
          </li>

        </ul>
      </div>
    </aside>
  )
}
