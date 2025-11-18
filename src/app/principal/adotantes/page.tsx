'use client'

import { useEffect, useState } from "react"


import ItemAdotante from "@/components/itemAdotante"
import { AdotanteI } from "@/utils/types/adotantes"

function CadAdotantes() {
  const [adotantes, setAdotantes] = useState<AdotanteI[]>([])

  useEffect(() => {
    async function getAdotantes() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/adotantes`)
      const dados = await response.json()
      setAdotantes(dados)
    }
    getAdotantes()
  }, [])

  const listaAdotantes = adotantes.map(adotante => (
    <ItemAdotante key={String(adotante.id)} adotante={adotante} adotantes={adotantes} setAdotantes={setAdotantes} />
  ))

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Adotantes
        </h1>
        
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3">
                Endereço
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaAdotantes}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CadAdotantes
