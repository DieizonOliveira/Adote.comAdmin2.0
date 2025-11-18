'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { VacinaI } from '@/utils/types/vacinas'

interface ModalVacinaProps {
  animalId: number
  acompanhamentoId?: number
  vacina?: VacinaI
  fechar: () => void
  atualizarAnimal?: () => void
  onAtualizar?: (vacina: VacinaI) => void
}

export default function ModalVacina({ animalId, acompanhamentoId, vacina, fechar, atualizarAnimal, onAtualizar }: ModalVacinaProps) {
  const [nome, setNome] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [aplicadoPor, setAplicadoPor] = useState('')
  const [loading, setLoading] = useState(false)

  // Preencher campos se for edição
  useEffect(() => {
    if (vacina) {
      setNome(vacina.nome || '')
      setObservacoes(vacina.observacoes || '')
      setAplicadoPor(vacina.aplicadoPor || '')
    }
  }, [vacina])

  async function salvarVacina() {
    if (!nome.trim()) {
      alert('Informe o nome da vacina.')
      return
    }

    setLoading(true)

    try {
      const token = Cookies.get('admin_logado_token')
      const url = vacina
        ? `${process.env.NEXT_PUBLIC_URL_API}/vacinas-aplicadas/${vacina.id}`
        : `${process.env.NEXT_PUBLIC_URL_API}/vacinas-aplicadas`

      // ✅ Alterado PUT -> PATCH para edição
      const method = vacina ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (token || ''),
        },
        body: JSON.stringify({
          nome,
          observacoes,
          aplicadoPor,
          animalId,
          acompanhamentoId: acompanhamentoId || null
        }),
      })

      if (response.ok) {
        const data: VacinaI = await response.json()
        if (onAtualizar) onAtualizar(data)
        if (atualizarAnimal) atualizarAnimal()
        fechar()
      } else {
        // A API pode retornar HTML em caso de erro, então tenta JSON, senão fallback
        let erroMessage = 'Verifique os dados'
        try {
          const erro = await response.json()
          erroMessage = erro.message || erroMessage
        } catch {
          erroMessage = await response.text()
        }
        alert('Erro ao salvar vacina: ' + erroMessage)
      }
    } catch (error) {
      console.error(error)
      alert('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{vacina ? 'Editar Vacina' : 'Aplicar Vacina'}</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Vacina *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Aplicado por</label>
          <input
            type="text"
            value={aplicadoPor}
            onChange={(e) => setAplicadoPor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 h-20"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={fechar} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={salvarVacina}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Salvando...' : vacina ? 'Salvar Alterações' : 'Aplicar Vacina'}
          </button>
        </div>
      </div>
    </div>
  )
}
