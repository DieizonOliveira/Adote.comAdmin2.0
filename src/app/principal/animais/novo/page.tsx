'use client'
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { EspecieI } from "@/utils/types/especies"

type Inputs = {
  nome: string
  idade: string
  sexo: string
  foto: string
  descricao: string
  porte: string
  especieId: string
}

function NovoAnimal() {
  const [especies, setEspecies] = useState<EspecieI[]>([])
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

  useEffect(() => {
    async function getEspecies() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/especies`)
        if (!response.ok) throw new Error('Erro ao buscar espécies.')
        const dados = await response.json()
        setEspecies(dados)
      } catch {
        toast.error('Erro ao carregar espécies.')
      }
    }
    getEspecies()
    setFocus("nome")
  }, [setFocus])

  const optionsEspecie = especies.map(especie => (
    <option key={especie.id} value={especie.id}>
      {especie.nome}
    </option>
  ))

  async function incluirAnimal(data: Inputs) {
    try {
      const responseAnimal = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("admin_logado_token")}`,
        },
        body: JSON.stringify({
          nome: data.nome,
          idade: Number(data.idade),
          sexo: data.sexo,
          descricao: data.descricao,
          porte: data.porte,
          especieId: Number(data.especieId),
        }),
      })

      const animalCriado = await responseAnimal.json()
      console.log("Animal criado:", animalCriado)

      if (!responseAnimal.ok) {
        toast.error("Erro ao criar o animal.")
        return
      }

      const responseFoto = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/fotos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("admin_logado_token")}`,
        },
        body: JSON.stringify({
          descricao: `Foto principal de ${data.nome}`,
          codigoFoto: data.foto,
          animalId: animalCriado.id,
        }),
      })

      const fotoCriada = await responseFoto.json()
      console.log("Foto criada:", fotoCriada)

      if (responseAnimal.ok && responseFoto.ok) {
        toast.success("Animal e foto cadastrados com sucesso!")
        reset()
      } else {
        toast.error("Erro ao cadastrar a foto do animal.")
      }
    } catch (error) {
      console.error("Erro ao incluir animal:", error)
      toast.error("Erro na comunicação com o servidor.")
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-black md:text-3xl lg:text-4xl">
        Inclusão de Animais
      </h1>

      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirAnimal)}>
        <div className="mb-3">
          <label htmlFor="nome" className="block mb-2 text-sm font-medium text-black">
            Nome do Animal
          </label>
          <input
            type="text"
            id="nome"
            className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
            {...register("nome", { required: true })}
          />
        </div>

        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div>
            <label htmlFor="especieId" className="block mb-2 text-sm font-medium text-black">
              Espécie
            </label>
            <select
              id="especieId"
              className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
              {...register("especieId", { required: true })}
            >
              <option value="">Selecione</option>
              {optionsEspecie}
            </select>
          </div>

          <div>
            <label htmlFor="idade" className="block mb-2 text-sm font-medium text-black">
              Idade
            </label>
            <input
              type="number"
              id="idade"
              className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
              {...register("idade", { required: true })}
            />
          </div>
        </div>

        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div>
            <label htmlFor="porte" className="block mb-2 text-sm font-medium text-black">
              Porte
            </label>
            <select
              id="porte"
              className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
              {...register("porte", { required: true })}
            >
              <option value="">Selecione</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Medio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          <div>
            <label htmlFor="sexo" className="block mb-2 text-sm font-medium text-black">
              Sexo
            </label>
            <select
              id="sexo"
              className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
              {...register("sexo", { required: true })}
            >
              <option value="">Selecione</option>
              <option value="Macho">Macho</option>
              <option value="Femea">Fêmea</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="foto" className="block mb-2 text-sm font-medium text-black">
            URL da Foto
          </label>
          <input
            type="url"
            id="foto"
            placeholder="https://..."
            className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
            {...register("foto", { required: true })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-black">
            Descrição
          </label>
          <textarea
            id="descricao"
            rows={4}
            className="bg-gray-50 border text-black rounded-lg focus:ring-blue-500 block w-full p-2.5"
            {...register("descricao", { required: true })}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Incluir
        </button>
      </form>
    </>
  )
}

export default NovoAnimal
