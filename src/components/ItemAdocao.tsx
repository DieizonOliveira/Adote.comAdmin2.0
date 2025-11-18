'use client'

import { Dispatch, SetStateAction } from "react";
import Cookies from "js-cookie";
import { AdocaoI } from "@/utils/types/adocoes";
import { TiDeleteOutline } from "react-icons/ti";
import Image from "next/image";

interface ItemAdocaoProps {
  adocao: AdocaoI;
  adocoes: AdocaoI[];
  setAdocoes: Dispatch<SetStateAction<AdocaoI[]>>;
}

export default function ItemAdocao({ adocao, adocoes, setAdocoes }: ItemAdocaoProps) {
  async function excluirAdocao() {
    if (!confirm(`Confirma exclusão da adoção do pedido #${adocao.id}?`)) return;
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/adocoes/${adocao.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + Cookies.get("admin_logado_token") as string,
      },
    });
    if (response.ok) {
      setAdocoes(adocoes.filter(a => a.id !== adocao.id));
      alert("Adoção excluída com sucesso");
    } else {
      alert("Erro ao excluir adoção");
    }
  }

  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700 hover:bg-gray-100 transition-colors duration-150">
      <td className="px-6 py-4">
        <Image
          src={adocao.animal.fotos?.[0]?.codigoFoto || "/sem-foto.jpg"}
          alt={`Foto de ${adocao.animal.nome}`}
          width={100}
          height={100}
          className="rounded-lg object-cover"
        />
      </td>
      <td className="px-6 py-4">{adocao.animal.nome}</td>
      <td className="px-6 py-4">{adocao.adotante.nome}</td>
      <td className="px-6 py-4">{new Date(adocao.dataAdocao).toLocaleDateString()}</td>
      <td className="px-6 py-4">{adocao.status}</td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-2xl text-red-600 cursor-pointer"
          title="Excluir adoção"
          onClick={excluirAdocao}
        />
      </td>
    </tr>
  );
}
