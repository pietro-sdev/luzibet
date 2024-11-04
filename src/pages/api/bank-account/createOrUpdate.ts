import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { bankName, agencyNumber, accountNumber, accountHolder } = req.body;

  try {
    const bankAccount = await prisma.bankAccount.upsert({
      where: { id: 1 }, // Garante que apenas uma conta bancária será mantida
      update: {
        bankName,
        agencyNumber,
        accountNumber,
        accountHolder,
      },
      create: {
        bankName,
        agencyNumber,
        accountNumber,
        accountHolder,
      },
    });

    res.status(201).json(bankAccount);
  } catch (error) {
    console.error('Erro ao salvar conta bancária:', error);
    res.status(500).json({ message: 'Erro ao salvar conta bancária' });
  }
}
