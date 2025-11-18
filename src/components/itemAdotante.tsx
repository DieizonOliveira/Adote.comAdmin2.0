'use client'

import { useState } from "react"
import { TiDeleteOutline, TiEdit } from "react-icons/ti"
import Cookies from "js-cookie"
import { AdotanteI } from "@/utils/types/adotantes"
import ModalAdotante from "./ModalAdotante"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

interface ListaAdotanteProps {
  adotante: AdotanteI
  adotantes: AdotanteI[]
  setAdotantes: React.Dispatch<React.SetStateAction<AdotanteI[]>>
}

function ItemAdotante({ adotante, adotantes, setAdotantes }: ListaAdotanteProps) {
  const [abrirModal, setAbrirModal] = useState(false)

  async function excluirAdotante() {
    const confirmResult = await MySwal.fire({
      title: 'Confirmação',
      text: `Deseja realmente excluir o adotante ${adotante.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })

    if (!confirmResult.isConfirmed) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/adotantes/${adotante.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (Cookies.get("admin_logado_token") || "")
        }
      })

      if (response.ok) {
        const adotantesAtualizados = adotantes.filter(a => a.id !== adotante.id)
        setAdotantes(adotantesAtualizados)

        await MySwal.fire({
          icon: 'success',
          title: 'Adotante excluído!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })
      } else {
        await MySwal.fire({
          icon: 'error',
          title: 'Erro ao excluir',
          text: 'Adotante não foi excluído'
        })
      }
    } catch (err) {
      console.error(err)
      await MySwal.fire({
        icon: 'error',
        title: 'Erro de conexão',
        text: 'Não foi possível conectar ao servidor.'
      })
    }
  }

  function handleAtualizar(updated: AdotanteI) {
    const listaAtualizada = adotantes.map(a => a.id === updated.id ? updated : a)
    setAdotantes(listaAtualizada)
  }

  return (
    <>
      <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{adotante.nome}</td>
        <td className="px-6 py-4">{adotante.fone}</td>
        <td className="px-6 py-4">{adotante.endereco}</td>
        <td className="px-6 py-4">{adotante.email}</td>
        <td className="px-6 py-4 flex gap-2">
          <TiEdit
            className="text-3xl text-blue-600 cursor-pointer"
            title="Editar"
            onClick={() => setAbrirModal(true)}
          />
          <TiDeleteOutline
            className="text-3xl text-red-600 cursor-pointer"
            title="Excluir"
            onClick={excluirAdotante}
          />
        </td>
      </tr>

      {abrirModal && (
        <ModalAdotante
          adotante={adotante}
          fechar={() => setAbrirModal(false)}
          onAtualizar={handleAtualizar}
        />
      )}
    </>
  )
}

export default ItemAdotante
