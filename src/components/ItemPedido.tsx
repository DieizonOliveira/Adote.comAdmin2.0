'use client'

import { Dispatch, SetStateAction } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { FaRegEdit } from "react-icons/fa"
import Cookies from "js-cookie"
import { PedidoI } from "@/utils/types/pedidos"
import Image from "next/image"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface ListaPedidoProps {
  pedido: PedidoI
  pedidos: PedidoI[]
  setPedidos: Dispatch<SetStateAction<PedidoI[]>>
}

export default function ItemPedido({ pedido, pedidos, setPedidos }: ListaPedidoProps) {

  async function excluirPedido() {
    const result = await MySwal.fire({
      title: `Confirma Exclusão do Pedido "${pedido.descricao}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true,
      toast: false,
      customClass: { popup: 'swal-front' }
    })

    if (!result.isConfirmed) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos/${pedido.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + (Cookies.get("admin_logado_token") || "")
        },
      })

      if (response.ok) {
        setPedidos(pedidos.filter(x => x.id !== pedido.id))
        await MySwal.fire({
          icon: 'success',
          title: "Proposta excluída com sucesso",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })
      } else {
        await MySwal.fire({
          icon: 'error',
          title: "Erro... Proposta não foi excluída",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })
      }
    } catch (err) {
      console.error(err)
      await MySwal.fire({
        icon: 'error',
        title: 'Erro de conexão com o servidor',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  async function responderPedido() {
    const { value: respostaAbrigo } = await MySwal.fire({
      title: `Responder Pedido "${pedido.descricao}"`,
      input: 'textarea',
      inputPlaceholder: 'Escreva a resposta aqui...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value.trim() === '') return 'Você precisa escrever uma resposta!'
      }
    })

    if (!respostaAbrigo) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos/${pedido.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + (Cookies.get("admin_logado_token") || "")
        },
        body: JSON.stringify({ resposta: respostaAbrigo, aprovado: true })
      })

      if (response.ok) {
        setPedidos(pedidos.map(x => x.id === pedido.id ? { ...x, resposta: respostaAbrigo, aprovado: true } : x))
        await MySwal.fire({
          icon: 'success',
          title: '✅ Pedido respondido com sucesso!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })
      } else {
        await MySwal.fire({
          icon: 'error',
          title: 'Erro ao responder pedido',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })
      }
    } catch (err) {
      console.error(err)
      await MySwal.fire({
        icon: 'error',
        title: 'Erro de conexão com o servidor',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-100 transition-colors duration-150">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <Image
          src={pedido.animal.fotos?.[0]?.codigoFoto || "/sem-foto.jpg"}
          alt={`Foto de ${pedido.animal.nome}`}
          width={100}
          height={100}
          className="rounded-lg object-cover"
        />
      </th>

      <td className="px-6 py-4">{pedido.animal.especie.nome}</td>
      <td className="px-6 py-4">{pedido.animal.idade}</td>
      <td className="px-6 py-4">{pedido.adotante.nome}</td>
      <td className="px-6 py-4">{pedido.descricao}</td>
      <td className="px-6 py-4">{pedido.resposta}</td>

      <td className="px-6 py-4 text-center">
        {pedido.resposta ? (
          <Image src="/ok.png" alt="Ok" width={60} height={60} />
        ) : (
          <>
            <TiDeleteOutline
              className="text-2xl text-red-600 cursor-pointer inline-block mr-2 transition-transform transform hover:scale-110"
              title="Excluir"
              onClick={excluirPedido}
            />
            <FaRegEdit
              className="text-2xl text-yellow-600 cursor-pointer inline-block transition-transform transform hover:scale-110"
              title="Responder"
              onClick={responderPedido}
            />
          </>
        )}
      </td>
    </tr>
  )
}
