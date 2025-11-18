'use client'

import { useEffect, useState } from "react"
import { AcompanhamentoI } from "@/utils/types/acompanhamento"
import ItemAcompanhamento from "@/components/ItemAcompanhamento"
import Cookies from "js-cookie"

export default function ControleAcompanhamentos() {
  const [acompanhamentos, setAcompanhamentos] = useState<AcompanhamentoI[]>([])

  useEffect(() => {
    async function getAcompanhamentos() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/acompanhamentos`, {
        headers: {
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        }
      })
      const dados = await response.json()
      setAcompanhamentos(dados)
    }
    getAcompanhamentos()
  }, [])

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Controle de Acompanhamentos</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Animal</th>
              <th className="px-6 py-3">Adotante</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Observações</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {acompanhamentos.map(acomp => (
              <ItemAcompanhamento
                key={acomp.id}
                acompanhamento={acomp}
                acompanhamentos={acompanhamentos}
                setAcompanhamentos={setAcompanhamentos}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
