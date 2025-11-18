'use client'
import { useEffect, useState } from "react"
import { PedidoI } from "@/utils/types/pedidos"
import ItemPedido from "@/components/ItemPedido"

function ControlePedidos() {
  const [pedidos, setPedidos] = useState<PedidoI[]>([])

  useEffect(() => {
    async function getPedidos() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos`)
      const dados = await response.json()
      setPedidos(dados)
    }
    getPedidos()
  }, [])

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        Controle de Propostas
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Foto</th>
              <th scope="col" className="px-6 py-3">Espécie</th>
              <th scope="col" className="px-6 py-3">Idade</th>
              <th scope="col" className="px-6 py-3">Adotante</th>
              <th scope="col" className="px-6 py-3">Pedido de Adoção</th>
              <th scope="col" className="px-6 py-3">Resposta do Abrigo</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Nenhum pedido registrado.
                </td>
              </tr>
            ) : (
              pedidos.map(pedido => (
                <ItemPedido
                  key={pedido.id}
                  pedido={pedido}
                  pedidos={pedidos}
                  setPedidos={setPedidos}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ControlePedidos
