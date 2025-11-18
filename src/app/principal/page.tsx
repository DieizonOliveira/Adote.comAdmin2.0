'use client'
import { useEffect, useState } from "react";

export default function Principal() {
  // Informações do abrigo (somente leitura, editáveis pelo dev)
  const abrigo = {
    nome: "Abrigo Patinhas",
    endereco: "Rua das Flores, 123 - Bairro Jardim, Pelotas-RS",
    telefone: "(51) 99999-9999",
    foto: "/abrigo.jpg", // coloque a imagem na pasta public
  }

  return (
  <div className="container mt-24 flex flex-col items-center">
    {/* Foto do abrigo */}
    <img 
      src="https://cdn.folhape.com.br/upload/dn_arquivo/2021/07/abrigo1.jpeg"
      alt="Foto do abrigo" 
      className="w-[48rem] h-auto object-cover rounded-lg mb-4 shadow-lg max-w-[90vw]" 
    />
      
      {/* Endereço do abrigo */}
      <h1 className="text-3xl font-bold mb-1">{abrigo.nome}</h1>
      <p className="text-gray-700 dark:text-gray-300">{abrigo.endereco}</p>
    </div>
  )
}
