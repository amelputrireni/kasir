import { useState } from 'react';
import { Sale, Product } from '../types';
import { Printer, Edit } from 'lucide-react';
import Receipt from './Receipt';
import EditSaleForm from './EditSaleForm';

interface SalesJournalProps {
  sales: Sale[];
  products: Product[];
  onUpdateSale: (updatedSale: Sale) => void;
  shopInfo: { name: string; address: string; phone: string; email: string; };
}

export default function SalesJournal({ sales, products, onUpdateSale, shopInfo }: SalesJournalProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Data Penjualan</h3>
        <p className="mt-1 text-sm text-gray-500">Riwayat semua transaksi</p>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Nota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{sale.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.customerName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {sale.items.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? (
                          <div key={item.productId}>
                            {product.name} × {item.quantity}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rp {sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Print Nota"
                      >
                        <Printer size={18} />
                      </button>
                      <button
                        onClick={() => setEditingSale(sale)}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale && (
        <Receipt
          sale={selectedSale}
          products={products}
          shopInfo={shopInfo}
          onClose={() => setSelectedSale(null)}
        />
      )}

      {editingSale && (
        <EditSaleForm
          sale={editingSale}
          products={products}
          onSave={(updatedSale) => {
            onUpdateSale(updatedSale);
            setEditingSale(null);
          }}
          onClose={() => setEditingSale(null)}
        />
      )}
    </div>
  );
}
