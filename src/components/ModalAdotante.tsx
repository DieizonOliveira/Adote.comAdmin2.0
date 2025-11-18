'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Cookies from 'js-cookie'
import { AdotanteI } from '@/utils/types/adotantes'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface ModalAdotanteProps {
  adotante?: AdotanteI
  fechar: () => void
  onAtualizar?: (adotante: AdotanteI) => void
  onExcluir?: (id: number) => void
}

export default function ModalAdotante({ adotante, fechar, onAtualizar, onExcluir }: ModalAdotanteProps) {
  const [nome, setNome] = useState('')
  const [fone, setFone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (adotante) {
      setNome(adotante.nome || '')
      setFone(adotante.fone || '')
      setEndereco(adotante.endereco || '')
      setEmail(adotante.email || '')
    }
  }, [adotante])

  async function salvarAdotante() {
    if (!nome.trim() || !fone.trim() || !endereco.trim() || !email.trim()) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: { popup: 'swal-front' }
      })
      return
    }

    setLoading(true)
    try {
      const token = Cookies.get('admin_logado_token')
      const url = adotante
        ? `${process.env.NEXT_PUBLIC_URL_API}/adotantes/${adotante.id}`
        : `${process.env.NEXT_PUBLIC_URL_API}/adotantes`
      const method = adotante ? 'PATCH' : 'POST'
      const bodyData = { nome, fone, endereco, email }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (token || '')
        },
        body: JSON.stringify(bodyData)
      })

      if (response.ok) {
        const data: AdotanteI = await response.json()
        if (onAtualizar) onAtualizar(data)

        // Fecha o modal ANTES do toast
        fechar()

        // Toast de sucesso
        await MySwal.fire({
          icon: 'success',
          title: adotante ? 'Adotante atualizado!' : 'Adotante criado!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { popup: 'swal-front' }
        })
      } else {
        let erroMessage = 'Verifique os dados'
        try {
          const erro = await response.json()
          erroMessage = erro.erro || erroMessage
        } catch {
          erroMessage = await response.text()
        }

        await MySwal.fire({
          icon: 'error',
          title: 'Erro ao salvar adotante',
          text: erroMessage,
          customClass: { popup: 'swal-front' }
        })
      }
    } catch (error) {
      console.error(error)
      await MySwal.fire({
        icon: 'error',
        title: 'Erro de conexão',
        text: 'Não foi possível conectar ao servidor.',
        customClass: { popup: 'swal-front' }
      })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <>
      <style>{`
        .swal-front { z-index: 100000 !important; }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
        <div className="bg-white p-6 rounded-xl shadow-xl w-96">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {adotante ? 'Editar Adotante' : 'Novo Adotante'}
          </h2>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
            <input
              type="text"
              value={fone}
              onChange={(e) => setFone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={fechar}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
            >
              Cancelar
            </button>

            <button
              onClick={salvarAdotante}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Salvando...' : adotante ? 'Salvar Alterações' : 'Criar Adotante'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
