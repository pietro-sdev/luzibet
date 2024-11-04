'use client';

import { useState, useEffect } from 'react';

// Define o tipo para cada item de pagamento na tabela
interface PaymentData {
  id: number;
  nome: string;
  phone: string;
  amount: number;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentDate: string | null;
  createdAt: string;
}

export default function TabelaPage() {
  const [data, setData] = useState<PaymentData[]>([]);
  const [premiumBetLink, setPremiumBetLink] = useState<string | null>(null);

  // Função para buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/payment/getPayments'); // Ajuste o endpoint conforme necessário
        if (!response.ok) throw new Error('Erro ao buscar dados');
        
        const paymentsData: PaymentData[] = await response.json();
        setData(paymentsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função para buscar o link da aposta premiada ativa
  useEffect(() => {
    const fetchPremiumBetLink = async () => {
      try {
        const response = await fetch('/api/premium-bet/get');
        if (!response.ok) throw new Error('Erro ao buscar aposta premiada');
        
        const betData = await response.json();
        setPremiumBetLink(betData.link);
      } catch (error) {
        console.error('Erro ao buscar aposta premiada:', error);
      }
    };

    fetchPremiumBetLink();
  }, []);

  // Função para enviar mensagem via WhatsApp
  const handleSend = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '').startsWith('55') ? phone.replace(/\D/g, '') : `55${phone.replace(/\D/g, '')}`;
    
    const message = encodeURIComponent(
      `Seu pagamento foi confirmado com sucesso! Obrigado por escolher nosso serviço.${
        premiumBetLink ? ` Acesse sua aposta premiada: ${premiumBetLink}` : ''
      }`
    );
    
    const whatsappLink = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-100">Tabela de Dados</h1>
      <div className="overflow-x-auto border border-borderLuizbet rounded-lg">
        <table className="min-w-full bg-bgLuizbet text-gray-100">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Nome</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Número</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Data</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-700 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="py-2 px-4">{item.nome}</td>
                <td className="py-2 px-4">{item.phone}</td>
                <td className="py-2 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className={`py-2 px-4 ${item.paymentStatus === 'COMPLETED' ? 'text-green-500' : item.paymentStatus === 'PENDING' ? 'text-orange-500' : 'text-red-500'}`}>
                  {item.paymentStatus === 'COMPLETED' ? 'Pago' : item.paymentStatus === 'PENDING' ? 'Pendente' : 'Incompleto'}
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  {item.paymentStatus === 'COMPLETED' && (
                    <button
                      onClick={() => handleSend(item.phone)}
                      className="bg-green-600 text-white py-1 px-2 rounded font-medium hover:bg-green-700 focus:outline-none focus:ring-2"
                    >
                      Enviar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
