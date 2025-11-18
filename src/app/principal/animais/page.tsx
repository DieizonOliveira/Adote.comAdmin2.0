'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimalI } from "@/utils/types/animais"
import ItemAnimal from "@/components/ItemAnimal"
import ModalAnimal from "@/components/modalAnimal"

export default function CadAnimais() {
  const router = useRouter()
  const [animais, setAnimais] = useState<AnimalI[]>([])
  const [animalSelecionado, setAnimalSelecionado] = useState<AnimalI | null>(null)

  useEffect(() => {
    async function getAnimais() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais`)
      setAnimais(await res.json())
    }
    getAnimais()
  }, [])

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        Cadastro de Animais
      </h1>

      {/* Botão Adicionar Animal */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/principal/animais/novo")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          ➕ Adicionar Animal
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Foto</th>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Espécie</th>
              <th scope="col" className="px-6 py-3">Idade</th>
              <th scope="col" className="px-6 py-3">Porte</th>
              <th scope="col" className="px-6 py-3">Sexo</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {animais.map(animal => (
              <ItemAnimal
                key={animal.id}
                animal={animal}
                animais={animais}
                setAnimais={setAnimais}
                setAnimalSelecionado={setAnimalSelecionado}
              />
            ))}
          </tbody>
        </table>
      </div>

      {animalSelecionado && (
        <ModalAnimal
          animal={animalSelecionado}
          fechar={() => setAnimalSelecionado(null)}
        />
      )}
    </div>
  )
}
