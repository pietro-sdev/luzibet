'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CapturaPage() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const router = useRouter();

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length <= 10) {
      input = input.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      input = input.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    setTelefone(input);
  };

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/users/createPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/pagamento?paymentId=${data.paymentId}`); // Use `paymentId` aqui
      } else {
        console.error('Erro ao capturar dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao enviar dados de captura:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-bgLuizbet border-2 border-[#202020] rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-center">Informações usuário</h1>

        <form className="space-y-4" onSubmit={handleConfirmar}>
          <div>
            <label className="block mb-1 text-sm text-gray-100">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full p-2 text-sm text-gray-200 bg-[#202124] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-100">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(00) 00000-0000"
              className="w-full p-2 text-sm text-gray-200 bg-[#202124] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-center bg-green-500 font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
