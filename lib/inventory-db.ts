import { env } from 'cloudflare:workers';

export async function initInventoryDB(){
 const db=env.DB;
 await db.batch([
  db.prepare("CREATE TABLE IF NOT EXISTS inventory_products (id INTEGER PRIMARY KEY AUTOINCREMENT, sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL, category TEXT NOT NULL, stock INTEGER NOT NULL DEFAULT 0, min_stock INTEGER NOT NULL DEFAULT 5, cost REAL NOT NULL DEFAULT 0, sale_price REAL NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL)"),
  db.prepare("CREATE TABLE IF NOT EXISTS inventory_movements (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, type TEXT NOT NULL, quantity INTEGER NOT NULL, unit_price REAL NOT NULL DEFAULT 0, total REAL NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)"),
  db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_products_sku ON inventory_products(sku)'),
  db.prepare('CREATE INDEX IF NOT EXISTS idx_inventory_products_active ON inventory_products(active)'),
  db.prepare('CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_date ON inventory_movements(product_id,created_at)'),
  db.prepare('CREATE INDEX IF NOT EXISTS idx_inventory_movements_type_date ON inventory_movements(type,created_at)'),
  db.prepare('PRAGMA optimize')
 ]);
 const count=await db.prepare('SELECT COUNT(*) AS total FROM inventory_products').first<{total:number}>();
 if(Number(count?.total||0)===0){
  const now=new Date().toISOString();
  await db.batch([
   db.prepare('INSERT OR IGNORE INTO inventory_products (sku,name,category,stock,min_stock,cost,sale_price,active,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind('ROP-001','Polo Urban Classic','Ropa',42,10,28,59,1,now),
   db.prepare('INSERT OR IGNORE INTO inventory_products (sku,name,category,stock,min_stock,cost,sale_price,active,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind('ROP-002','Jean Denim Relaxed','Ropa',18,8,54,109,1,now),
   db.prepare('INSERT OR IGNORE INTO inventory_products (sku,name,category,stock,min_stock,cost,sale_price,active,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind('ACC-001','Mochila Motion','Accesorios',7,8,46,89,1,now),
   db.prepare('INSERT OR IGNORE INTO inventory_products (sku,name,category,stock,min_stock,cost,sale_price,active,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind('CAL-001','Zapatilla Street One','Calzado',25,6,72,149,1,now)
  ]);
 }
}

export async function inventorySnapshot(){
 const db=env.DB;
 const products=await db.prepare('SELECT id,sku,name,category,stock,min_stock AS minStock,cost,sale_price AS salePrice,active,created_at AS createdAt FROM inventory_products WHERE active=1 ORDER BY name').all();
 const movements=await db.prepare("SELECT m.id,m.product_id AS productId,p.name AS productName,p.sku,m.type,m.quantity,m.unit_price AS unitPrice,m.total,m.note,m.created_at AS createdAt FROM inventory_movements m JOIN inventory_products p ON p.id=m.product_id ORDER BY m.id DESC LIMIT 16").all();
 const metrics=await db.prepare("SELECT COALESCE(SUM(stock),0) AS totalUnits,COALESCE(SUM(stock*cost),0) AS inventoryValue,COALESCE(SUM(CASE WHEN stock<=min_stock THEN 1 ELSE 0 END),0) AS lowStockCount FROM inventory_products WHERE active=1").first<Record<string,unknown>>();
 const sales=await db.prepare("SELECT COALESCE(SUM(total),0) AS salesToday,COALESCE(SUM(quantity),0) AS unitsSoldToday FROM inventory_movements WHERE type='venta' AND date(created_at)=date('now')").first<Record<string,unknown>>();
 return{products:products.results.map(p=>({...p,active:Boolean((p as Record<string,unknown>).active)})),movements:movements.results,metrics:{totalUnits:Number(metrics?.totalUnits||0),inventoryValue:Number(metrics?.inventoryValue||0),lowStockCount:Number(metrics?.lowStockCount||0),salesToday:Number(sales?.salesToday||0),unitsSoldToday:Number(sales?.unitsSoldToday||0)}};
}
