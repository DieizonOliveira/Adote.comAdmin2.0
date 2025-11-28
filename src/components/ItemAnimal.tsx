'use client'
import { Dispatch, SetStateAction } from "react"
import { AnimalI } from "@/utils/types/animais"
import Image from "next/image"
import { FaEdit } from "react-icons/fa"

interface ListaAnimalProps {
  animal: AnimalI
  animais: AnimalI[]
  setAnimais: Dispatch<SetStateAction<AnimalI[]>>
  setAnimalSelecionado: Dispatch<SetStateAction<AnimalI | null>>
}

export default function ItemAnimal({
  animal,
  setAnimalSelecionado,
}: ListaAnimalProps) {
  return (
    <tr
      key={animal.id}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 
                 border-b dark:border-gray-700 hover:bg-gray-100 transition-colors duration-150"
    >
      {/* FOTO */}
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <Image
          src={animal.fotos?.[0]?.codigoFoto || "/sem-foto.jpg"}
          alt={`Foto de ${animal.nome}`}
          width={100}
          height={100}
          className="rounded-lg object-cover"
        />
      </th>

      {/* CAMPOS */}
      <td className="px-6 py-4">{animal.nome}</td>
      <td className="px-6 py-4">{animal.especie.nome}</td>
      <td className="px-6 py-4">{animal.idade}</td>
      <td className="px-6 py-4">{animal.porte}</td>
      <td className="px-6 py-4">{animal.sexo}</td>

      {/* CASTRADO */}
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            animal.castracao
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {animal.castracao ? "Sim" : "Não"}
        </span>
      </td>

      {/* DISPONÍVEL */}
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            animal.disponivel
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {animal.disponivel ? "Sim" : "Não"}
        </span>
      </td>

      {/* AÇÕES */}
      <td className="px-6 py-4 text-center">
        <FaEdit
          className="text-2xl text-blue-600 hover:text-blue-800 cursor-pointer 
                     transition-transform transform hover:scale-110"
          title="Gerenciar animal"
          onClick={() => setAnimalSelecionado(animal)}
        />
      </td>
    </tr>
  )
}
