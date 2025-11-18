'use client'

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AcompanhamentoI } from "@/utils/types/acompanhamento";
import { VacinaI } from "@/utils/types/vacinas";
import ModalRegistrarVisita from "./modalVisita";
import ModalVacina from "./modalVacina";
import ItemAcompanhamento from "./ItemAcompanhamento";
import ItemVacina from "./ItemVacina";
import { createPortal } from "react-dom";

interface Props {
  adocaoId: number;
  fechar: () => void;
}

export default function ModalAcompanhamentos({ adocaoId, fechar }: Props) {
  const [acompanhamentos, setAcompanhamentos] = useState<AcompanhamentoI[]>([]);
  const [vacinas, setVacinas] = useState<VacinaI[]>([]);
  const [abrirRegistrar, setAbrirRegistrar] = useState(false);
  const [abrirVacina, setAbrirVacina] = useState(false);
  const [acompanhamentoSelecionado, setAcompanhamentoSelecionado] = useState<AcompanhamentoI | null>(null);

  // =======================
  // FETCH ACOMPANHAMENTOS
  // =======================
  const fetchAcompanhamentos = async () => {
    try {
      const token = Cookies.get("admin_logado_token");
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/acompanhamento?adocaoId=${adocaoId}`, {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error("Erro ao buscar acompanhamentos");
      const data: AcompanhamentoI[] = await res.json();
      setAcompanhamentos(data);
    } catch (err) {
      console.error("Erro ao buscar acompanhamentos:", err);
      setAcompanhamentos([]);
    }
  };

  // =======================
  // FETCH VACINAS
  // =======================
  const fetchVacinas = async () => {
    try {
      const token = Cookies.get("admin_logado_token");
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/vacinas-aplicadas?adocaoId=${adocaoId}`, {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error("Erro ao buscar vacinas");
      const data: VacinaI[] = await res.json();
      setVacinas(data);
    } catch (err) {
      console.error("Erro ao buscar vacinas:", err);
      setVacinas([]);
    }
  };

  useEffect(() => {
    fetchAcompanhamentos();
    fetchVacinas();
  }, [adocaoId]);

  // =======================
  // MODAIS
  // =======================
  function abrirModalVacinaItem(acompanhamento: AcompanhamentoI) {
    setAcompanhamentoSelecionado(acompanhamento);
    setAbrirVacina(true);
  }

  function abrirModalEditar(acompanhamento: AcompanhamentoI) {
    setAcompanhamentoSelecionado(acompanhamento);
    setAbrirRegistrar(true);
  }

  function abrirModalNovo() {
    setAcompanhamentoSelecionado(null);
    setAbrirRegistrar(true);
  }

  return (
    <>
      {/* Modal Pai */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-3/4 max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={fechar}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center">Acompanhamentos</h2>

          <div className="flex justify-end mb-4 gap-2">
            <button
              onClick={abrirModalNovo}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
            >
              ➕ Registrar Visita
            </button>
          </div>

          {/* TABELA DE ACOMPANHAMENTOS */}
          {acompanhamentos.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum acompanhamento registrado.</p>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3">Observações</th>
                    <th className="px-6 py-3">Próxima Visita</th>
                    <th className="px-6 py-3">Vacinas Aplicadas</th>
                    <th className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {acompanhamentos.map(a => (
                    <ItemAcompanhamento
                      key={a.id}
                      acompanhamento={a}
                      acompanhamentos={acompanhamentos}
                      setAcompanhamentos={setAcompanhamentos}
                      abrirModalVisita={() => abrirModalEditar(a)}
                      abrirModalVacina={abrirModalVacinaItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TABELA DE VACINAS APLICADAS */}
          <h3 className="text-xl font-semibold mb-2">Vacinas Aplicadas</h3>
          {vacinas.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">Nenhuma vacina aplicada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Data Aplicação</th>
                    <th className="px-6 py-3">Aplicado Por</th>
                    <th className="px-6 py-3">Observações</th>
                    <th className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vacinas.map(v => (
                    <ItemVacina
                      key={v.id}
                      vacina={v}
                      vacinas={vacinas}
                      setVacinas={setVacinas}
                      animalId={acompanhamentoSelecionado?.adocao?.animalId || 0}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Registrar Visita */}
      {abrirRegistrar &&
        createPortal(
          <ModalRegistrarVisita
            adocaoId={adocaoId}
            acompanhamento={acompanhamentoSelecionado || undefined}
            fechar={() => {
              setAbrirRegistrar(false);
              setAcompanhamentoSelecionado(null);
              fetchAcompanhamentos();
              fetchVacinas();
            }}
          />,
          document.body
        )}

      {/* Modal Vacina */}
      {abrirVacina && acompanhamentoSelecionado &&
        createPortal(
          <ModalVacina
            animalId={acompanhamentoSelecionado.adocao?.animalId || 0}
            acompanhamentoId={acompanhamentoSelecionado.id}
            fechar={() => {
              setAbrirVacina(false);
              setAcompanhamentoSelecionado(null);
              fetchAcompanhamentos();
              fetchVacinas();
            }}
            onAtualizar={(novaVacina) => setVacinas([...vacinas, novaVacina])}
          />,
          document.body
        )}
    </>
  );
}
