'use client'

import { useState } from "react"
import { createPortal } from "react-dom"
import { AnimalI } from "@/utils/types/animais"
import Image from "next/image"
import Cookies from "js-cookie"
import ModalEditarAnimal from "./modalEditarAnimal"

interface Props {
  animal: AnimalI
  fechar: () => void
}

export default function ModalAnimal({ animal, fechar }: Props) {
  const [loading, setLoading] = useState(false)
  const [disponivel, setDisponivel] = useState(animal.disponivel)
  const [abrirEdicao, setAbrirEdicao] = useState(false)

  async function alternarDisponibilidade() {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais/${animal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (Cookies.get("admin_logado_token") as string),
        },
        body: JSON.stringify({ disponivel: !disponivel }),
      })
      if (response.ok) {
        setDisponivel(!disponivel)
        alert(`Animal agora está ${!disponivel ? "disponível" : "indisponível"} para adoção.`)
      } else {
        alert("Erro ao alterar disponibilidade.")
      }
    } finally {
      setLoading(false)
    }
  }

  async function excluirAnimal() {
    if (!confirm(`Tem certeza que deseja excluir ${animal.nome}?`)) return
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais/${animal.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + (Cookies.get("admin_logado_token") as string),
        },
      })
      if (response.ok) {
        alert("Animal excluído com sucesso.")
        fechar()
      } else {
        alert("Erro ao excluir o animal.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para renderizar modal via Portal
  const renderPortal = (modal: JSX.Element) => createPortal(modal, document.body)

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[420px] relative">
          <button
            onClick={fechar}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center">{animal.nome}</h2>

          <Image
            src={animal.fotos?.[0]?.codigoFoto || "/sem-foto.jpg"}
            alt={animal.nome}
            width={400}
            height={250}
            className="rounded-lg object-cover mb-4 w-full h-56"
          />

          <div className="space-y-1 text-gray-700 text-sm">
            <p><strong>Espécie:</strong> {animal.especie.nome}</p>
            <p><strong>Idade:</strong> {animal.idade}</p>
            <p><strong>Porte:</strong> {animal.porte}</p>
            <p><strong>Sexo:</strong> {animal.sexo}</p>
            <p><strong>Disponível:</strong> {disponivel ? "Sim" : "Não"}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <button
              onClick={() => setAbrirEdicao(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm"
            >
              ✏️ Editar
            </button>
            <button
              onClick={alternarDisponibilidade}
              disabled={loading}
              className={`px-3 py-2 rounded-lg text-sm ${
                disponivel
                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {disponivel ? "❌ Indisponibilizar" : "✅ Disponibilizar"}
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={excluirAnimal}
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm"
            >
              🗑️ Excluir Animal
            </button>
          </div>
        </div>
      </div>

      {abrirEdicao &&
        renderPortal(
          <ModalEditarAnimal
            animal={animal}
            fechar={() => setAbrirEdicao(false)}
          />
        )}
    </>
  )
}
