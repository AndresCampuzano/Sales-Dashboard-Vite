import { Sale } from '../types/types';

/**
 * Posts a Sale
 */
export async function postSale(data: Sale): Promise<void> {
   await fetch(`${import.meta.env.VITE_API_URL}/api/sales`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   });
}
