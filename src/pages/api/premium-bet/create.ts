// pages/api/premium-bet/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { link } = req.body;

  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas a partir de agora
    const premiumBet = await prisma.premiumBet.create({
      data: { link, expiresAt, isActive: true },
    });

    res.status(201).json(premiumBet);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar aposta premiada', error });
  }
}
