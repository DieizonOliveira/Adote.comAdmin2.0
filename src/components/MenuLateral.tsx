"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";
import { RiInboxArchiveFill } from "react-icons/ri";
import { FaUsers, FaDog } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { FiX } from "react-icons/fi";

export function MenuLateral({
  aberto,
  fecharMenuMobile,
}: {
  aberto: boolean;
  fecharMenuMobile: () => void;
}) {
  const router = useRouter();

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      Cookies.remove("admin_logado_id");
      Cookies.remove("admin_logado_nome");
      Cookies.remove("admin_logado_token");
      router.replace("/");
    }
  }

  return (
    <>
      {/* Fundo escuro no mobile quando o menu abre */}
      {aberto && (
        <div
          onClick={fecharMenuMobile}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
        />
      )}

      <aside
        className={`
          fixed top-20 left-0 z-50 w-64 h-screen 
          bg-blue-190 dark:bg-blue-190 
          transition-transform duration-300 
          ${aberto ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0
        `}
      >
        {/* Botão fechar apenas no mobile */}
        <button
          onClick={fecharMenuMobile}
          className="sm:hidden absolute right-3 top-3 text-white text-3xl"
        >
          <FiX />
        </button>

        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">

            <li>
              <Link href="/principal" className="flex items-center p-2">
                <IoMdHome className="text-gray-600 text-2xl" />
                <span className="ml-3">O Abrigo</span>
              </Link>
            </li>

            <li>
              <Link href="/principal/animais" className="flex items-center p-2">
                <FaDog className="text-gray-600 text-2xl" />
                <span className="ml-3">Cadastro de Animais</span>
              </Link>
            </li>

            <li>
              <Link href="/principal/adotantes" className="flex items-center p-2">
                <FaUsers className="text-gray-600 text-2xl" />
                <span className="ml-3">Cadastro de Adotantes</span>
              </Link>
            </li>

            <li>
              <Link href="/principal/admins" className="flex items-center p-2">
                <FaUsers className="text-gray-600 text-2xl" />
                <span className="ml-3">Cadastro de Administradores</span>
              </Link>
            </li>

            <li>
              <Link href="/principal/pedidos" className="flex items-center p-2">
                <RiInboxArchiveFill className="text-gray-600 text-2xl" />
                <span className="ml-3">Pedidos de Adoção</span>
              </Link>
            </li>

            <li>
              <Link href="/principal/adocoes" className="flex items-center p-2">
                <FaDog className="text-gray-600 text-2xl" />
                <span className="ml-3">Adoções</span>
              </Link>
            </li>

            <li onClick={adminSair} className="flex items-center p-2 cursor-pointer">
              <IoExitOutline className="text-gray-600 text-2xl" />
              <span className="ml-3">Sair do Sistema</span>
            </li>

          </ul>
        </div>
      </aside>
    </>
  );
}
