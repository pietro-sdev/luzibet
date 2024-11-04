// app/admin/painel/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function PainelPage() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [link, setLink] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [savedQRCodeValue, setSavedQRCodeValue] = useState<number | null>(null);

  // Função para buscar a aposta premiada ativa
  const fetchPremiumBet = async () => {
    try {
      const res = await fetch('/api/premium-bet/get');
      const data = await res.json();
      setLink(data.link);
      setExpiresAt(new Date(data.expiresAt));
    } catch (error) {
      console.error('Erro ao buscar aposta premiada:', error);
    }
  };

  // Função para buscar o valor do QR Code salvo
  const fetchQRCodeValue = async () => {
    try {
      const res = await fetch('/api/qr-code-value/get');
      const data = await res.json();
      setSavedQRCodeValue(data.amount);
    } catch (error) {
      console.error('Erro ao buscar valor do QR Code:', error);
    }
  };

  // Função para calcular o tempo restante
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff = expiresAt.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Expirado');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${hours}h ${minutes}m restantes`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/premium-bet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      });
      if (res.ok) fetchPremiumBet();
    } catch (error) {
      console.error('Erro ao criar aposta:', error);
    }
  };

  const handleSaveQRCodeValue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/qr-code-value/createOrUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(String(qrCodeValue).replace(/\D/g, '')) / 100 }),
      });
      fetchQRCodeValue(); // Atualiza o valor salvo após o envio
    } catch (error) {
      console.error('Erro ao definir valor do QR Code:', error);
    }
  };

  useEffect(() => {
    fetchPremiumBet();
    fetchQRCodeValue();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-100">Painel Administrativo</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Box 1: Definir Aposta Premiada */}
        <div className="border border-borderLuizbet rounded-lg p-6 bg-transparent">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Definir Aposta Premiada</h2>
          <form className="space-y-4" onSubmit={handleCreateLink}>
            <div>
              <label className="block text-sm text-gray-100 mb-1">Link da Aposta</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Digite o link da aposta premiada"
                className="w-full p-2 text-sm text-gray-100 bg-[#202124] rounded focus:outline-none focus:ring-2 focus:ring-borderLuizbet"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-green-500 font-semibold text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2"
            >
              Salvar Aposta
            </button>
          </form>
          {link && (
            <div className="mt-4 p-2 border rounded text-gray-100">
              <p>Link ativo: {link}</p>
              <p className="text-orange-500">{timeLeft}</p>
            </div>
          )}
        </div>

        {/* Box 2: Definir Valor do QR Code */}
        <div className="border border-borderLuizbet rounded-lg p-6 bg-transparent">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Definir Valor do QR Code</h2>
          <form className="space-y-4" onSubmit={handleSaveQRCodeValue}>
            <div>
              <label className="block text-sm text-gray-100 mb-1">Valor (R$)</label>
              <input
                type="text"
                value={qrCodeValue}
                onChange={(e) =>
                  setQrCodeValue(
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(e.target.value.replace(/\D/g, '')) / 100)
                  )
                }
                placeholder="Digite o valor do QR Code"
                className="w-full p-2 text-sm text-gray-100 bg-[#202124] rounded focus:outline-none focus:ring-2 focus:ring-borderLuizbet"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-green-500 font-semibold text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2"
            >
              Salvar Valor
            </button>
          </form>
          {savedQRCodeValue !== null && (
            <div className="mt-4 p-2 border rounded text-gray-100">
              <p>Valor do QR Code salvo: R$ {savedQRCodeValue ? savedQRCodeValue.toFixed(2) : '0,00'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
