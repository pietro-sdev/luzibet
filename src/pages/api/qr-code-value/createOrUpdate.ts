// pages/api/qr-code-value/createOrUpdate.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { amount } = req.body;

  try {
    console.log('Iniciando upsert de QRCodeValue com valor:', amount);

    // Usa `upsert` para criar ou atualizar o valor do QR Code
    const qrCodeValue = await prisma.qRCodeValue.upsert({
      where: { id: 1 }, // Usa o ID 1 para garantir que só haja um registro
      update: { amount },
      create: { amount },
    });

    console.log('Upsert concluído com sucesso:', qrCodeValue);
    res.status(201).json(qrCodeValue);
  } catch (error) {
    console.error('Erro ao definir valor do QR Code:', error);
    res.status(500).json({ message: 'Erro ao definir valor do QR Code', error: (error as Error).message });
  }
}
