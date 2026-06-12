import { z } from 'zod';
import { isAddress } from 'viem';

export const addressSchema = z.string().refine((addr) => isAddress(addr), {
  message: 'Invalid Ethereum address',
});

export const amountSchema = z.string().refine((amt) => !isNaN(Number(amt)) && Number(amt) > 0, {
  message: 'Amount must be a positive number',
});
