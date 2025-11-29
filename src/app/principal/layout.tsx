"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Titulo } from "../../components/Titulo";
import { MenuLateral } from "../../components/MenuLateral";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [logado, setLogado] = useState(false);

  // Estado do menu mobile
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!Cookies.get("admin_logado_id")) {
      router.replace("/");
    } else {
      setLogado(true);
    }
  }, [router]);

  function abrirMenuMobile() {
    setMenuAberto(true);
  }

  function fecharMenuMobile() {
    setMenuAberto(false);
  }

  return (
    <>
      {logado && (
        <div>
          {/* Cabeçalho */}
          <Titulo abrirMenuMobile={abrirMenuMobile} />

          {/* Menu lateral responsivo */}
          <MenuLateral 
            aberto={menuAberto} 
            fecharMenuMobile={fecharMenuMobile} 
          />

          {/* Área de conteúdo */}
          <div className="p-4 sm:ml-64 mt-24">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
