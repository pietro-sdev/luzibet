'use client';

import { useState, useEffect } from 'react';

export default function BancoPage() {
  const [agencyNumber, setAgencyNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Carrega os dados da conta bancária ao montar o componente
  useEffect(() => {
    const fetchBankAccount = async () => {
      try {
        const res = await fetch('/api/bank-account/get');
        if (res.ok) {
          const data = await res.json();
          setAgencyNumber(data.agencyNumber);
          setAccountNumber(data.accountNumber);
          setAccountHolder(data.accountHolder);
        }
      } catch (error) {
        console.error('Erro ao carregar conta bancária:', error);
      }
    };

    fetchBankAccount();
  }, []);

  // Função para salvar os dados da conta bancária
  const handleSaveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/bank-account/createOrUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: 'Mercado Pago',
          agencyNumber,
          accountNumber,
          accountHolder,
        }),
      });

      if (res.ok) {
        alert('Conta bancária salva com sucesso!');
      } else {
        console.error('Erro ao salvar conta bancária');
      }
    } catch (error) {
      console.error('Erro ao salvar conta bancária:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-100 flex items-center gap-2">
        Configurações de Conta Bancária
      </h1>

      <div className="border border-borderLuizbet rounded-lg p-6 bg-transparent">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Definir Conta para Recebimento</h2>
        <form className="space-y-4" onSubmit={handleSaveBankAccount}>
          <div>
            <label className="block text-sm text-gray-100 mb-1">Banco</label>
            <input
              type="text"
              value="Mercado Pago"
              disabled
              className="w-full p-2 text-sm text-gray-100 bg-[#202124] rounded focus:outline-none focus:ring-2 focus:ring-borderLuizbet"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-100 mb-1">Agência</label>
            <input
              type="text"
              value={agencyNumber}
              onChange={(e) => setAgencyNumber(e.target.value)}
              placeholder="Número da Agência"
              className="w-full p-2 text-sm text-gray-100 bg-[#202124] rounded focus:outline-none focus:ring-2 focus:ring-borderLuizbet"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-100 mb-1">Número da Conta</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Número da Conta"
              className="w-full p-2 text-sm text-gray-100 bg-[#202124] rounded focus:outline-none focus:ring-2 focus:ring-borderLuizbet"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-100 mb-1">Nome do Titular</label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="Nome completo do titular"
              className="w-full p-2 text-sm text-gray-100 bg-[#202124] rounded focus:outline-none focus:ring-2 focus:ring-borderLuizbet"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 font-semibold text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
