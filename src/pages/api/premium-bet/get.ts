// pages/api/premium-bet/get.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const activeBet = await prisma.premiumBet.findFirst({
      where: { isActive: true, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeBet) {
      return res.status(404).json({ message: 'Nenhuma aposta premiada ativa encontrada' });
    }

    res.status(200).json(activeBet);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aposta premiada', error });
  }
}
