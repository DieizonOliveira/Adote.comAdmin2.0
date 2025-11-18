'use client'

import { useState } from 'react'
import { AnimalI, FotoI } from '@/utils/types/animais'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface ModalEditarAnimalProps {
  animal: AnimalI
  fechar: () => void
  atualizarAnimal?: () => void
}

export default function ModalEditarAnimal({
  animal,
  fechar,
  atualizarAnimal,
}: ModalEditarAnimalProps) {
  const [nome, setNome] = useState(animal.nome)
  const [idade, setIdade] = useState<number>(animal.idade)
  const [porte, setPorte] = useState<string>(animal.porte)
  const [sexo, setSexo] = useState<string>(animal.sexo)
  const [descricao, setDescricao] = useState(animal.descricao || '')
  const [castracao, setCastracao] = useState<boolean>(animal.castracao)
  const [disponivel, setDisponivel] = useState<boolean>(animal.disponivel)
  const [fotos, setFotos] = useState<FotoI[]>(animal.fotos || [])
  const [novasFotos, setNovasFotos] = useState<{ descricao: string; codigoFoto: string }[]>([])
  const [loading, setLoading] = useState(false)

  const token = Cookies.get('admin_logado_token')

  const toast = (icon: 'success' | 'error' | 'warning', title: string) => {
    MySwal.fire({
      icon,
      title,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      customClass: { popup: 'swal-front' },
    })
  }

  // Atualiza foto existente somente se houve alteração
  const atualizarFoto = async (foto: FotoI, idx: number) => {
    const original = animal.fotos[idx]
    if (foto.descricao === original.descricao && foto.codigoFoto === original.codigoFoto) return

    if (!foto.codigoFoto) {
      toast('warning', 'Informe código da foto')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/fotos/${foto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (token || ''),
        },
        body: JSON.stringify(foto),
      })
      if (!response.ok) {
        const erro = await response.text()
        toast('error', 'Erro ao atualizar foto: ' + erro)
      }
    } catch (error) {
      toast('error', 'Erro de conexão com o servidor.')
    }
  }

  // Salvar alterações do animal
  const salvarAlteracoes = async () => {
    setLoading(true)
    try {
      // Atualiza animal
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais/${animal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (token || ''),
        },
        body: JSON.stringify({
          nome,
          idade,
          porte,
          sexo,
          descricao,
          castracao,
          disponivel,
          especieId: animal.especie.id,
          fotos: novasFotos, // adiciona novas fotos
        }),
      })
      if (!response.ok) {
        const erro = await response.text()
        toast('error', 'Erro ao atualizar animal: ' + erro)
        return
      }

      // Atualiza fotos existentes somente se houver alterações
      for (let i = 0; i < fotos.length; i++) {
        await atualizarFoto(fotos[i], i)
      }

      toast('success', '✅ Animal atualizado com sucesso!')
      if (atualizarAnimal) atualizarAnimal()
      fechar()
    } catch (error) {
      console.error(error)
      toast('error', '⚠️ Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  // Toggle disponibilidade do animal
  const alternarDisponibilidade = () => {
    setDisponivel(!disponivel)
    toast('success', !disponivel ? 'Animal agora disponível!' : 'Animal agora indisponível!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Editar Animal</h2>

        {/* Nome */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Idade */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
            min={0}
          />
        </div>

        {/* Sexo */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="Macho">Macho</option>
            <option value="Femea">Fêmea</option>
          </select>
        </div>

        {/* Porte */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
          <select
            value={porte}
            onChange={(e) => setPorte(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="Pequeno">Pequeno</option>
            <option value="Medio">Médio</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        {/* Castração */}
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={castracao}
            onChange={(e) => setCastracao(e.target.checked)}
          />
          <span className="text-gray-700">Castrado</span>
        </div>

        {/* Disponibilidade */}
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={disponivel}
            onChange={alternarDisponibilidade}
          />
          <span className="text-gray-700">{disponivel ? 'Disponível' : 'Indisponível'}</span>
        </div>

        {/* Descrição */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border p-2 rounded-lg h-24 resize-none"
          />
        </div>

        {/* Fotos existentes */}
        <div className="mb-3">
          <h3 className="font-semibold mb-2">Fotos Existentes</h3>
          {fotos.map((foto, idx) => (
            <div key={foto.id} className="mb-2 flex items-center gap-2">
              <img src={foto.codigoFoto} alt={foto.descricao} className="w-16 h-16 object-cover rounded" />
              <input
                type="text"
                value={foto.descricao}
                onChange={(e) => {
                  const novas = [...fotos]
                  novas[idx].descricao = e.target.value
                  setFotos(novas)
                }}
                className="border p-1 rounded w-full"
                placeholder="Descrição"
              />
            </div>
          ))}
        </div>

        {/* Adicionar novas fotos */}
        <div className="mb-3">
          <h3 className="font-semibold mb-2">Adicionar Fotos</h3>
          {novasFotos.map((f, idx) => (
            <div key={idx} className="mb-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="URL da foto"
                value={f.codigoFoto}
                onChange={(e) => {
                  const copy = [...novasFotos]
                  copy[idx].codigoFoto = e.target.value
                  setNovasFotos(copy)
                }}
                className="border p-1 rounded w-full"
              />
              <input
                type="text"
                placeholder="Descrição"
                value={f.descricao}
                onChange={(e) => {
                  const copy = [...novasFotos]
                  copy[idx].descricao = e.target.value
                  setNovasFotos(copy)
                }}
                className="border p-1 rounded w-full"
              />
            </div>
          ))}
          <button
            onClick={() => setNovasFotos([...novasFotos, { codigoFoto: '', descricao: '' }])}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 mt-1"
          >
            Adicionar Foto
          </button>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={fechar}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Fechar
          </button>
          <button
            onClick={salvarAlteracoes}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
