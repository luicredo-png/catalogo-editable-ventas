import { initInventoryDB, inventorySnapshot } from '@/lib/inventory-db';

export async function GET(){
 await initInventoryDB();
 return Response.json(await inventorySnapshot());
}
