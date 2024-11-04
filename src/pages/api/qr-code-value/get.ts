// pages/api/qr-code-value/get.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Busca o valor do QR Code. Se não existir, retorna `null`
    const qrCodeValue = await prisma.qRCodeValue.findUnique({
      where: { id: 1 },
    });

    if (!qrCodeValue) {
      return res.status(404).json({ message: 'Valor do QR Code não encontrado' });
    }

    res.status(200).json({ amount: qrCodeValue.amount });
  } catch (error) {
    console.error('Erro ao buscar valor do QR Code:', error);
    res.status(500).json({ message: 'Erro ao buscar valor do QR Code' });
  }
}
