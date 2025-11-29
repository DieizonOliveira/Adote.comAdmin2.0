"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IoExitOutline } from "react-icons/io5";
import { RiInboxArchiveFill } from "react-icons/ri";
import { FaUsers, FaDog } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import Link from "next/link";
import { useState } from "react";

export function MenuLateral() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);

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
      {/* BOTÃO HAMBURGER – APENAS NO MOBILE */}
      <button
        className="fixed top-24 left-4 z-50 sm:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setAberto(true)}
      >
        ☰
      </button>

      {/* OVERLAY ESCURO NO MOBILE */}
      {aberto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setAberto(false)}
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={`
          fixed top-24 left-0 z-50 
          w-64 h-screen
          bg-blue-200 dark:bg-blue-950 
          px-3 py-4 overflow-y-auto
          transform transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0   /* SEMPRE ABERTO NO DESKTOP */
        `}
        aria-label="Sidebar"
      >
        <ul className="space-y-2 font-medium">

          <li>
            <Link href="/principal" className="flex items-center p-2">
              <IoMdHome className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">O Abrigo</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/animais" className="flex items-center p-2">
              <FaDog className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">Cadastro de Animais</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/adotantes" className="flex items-center p-2">
              <FaUsers className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">Cadastro de Adotantes</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/admins" className="flex items-center p-2">
              <FaUsers className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">Cadastro de Administradores</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/pedidos" className="flex items-center p-2">
              <RiInboxArchiveFill className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">Pedidos de Adoção</span>
            </Link>
          </li>

          <li>
            <Link href="/principal/adocoes" className="flex items-center p-2">
              <FaDog className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">Adoções</span>
            </Link>
          </li>

          <li>
            <span className="flex items-center p-2 cursor-pointer" onClick={adminSair}>
              <IoExitOutline className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="ms-2 mt-1">Sair do Sistema</span>
            </span>
          </li>
        </ul>
      </aside>
    </>
  );
}
