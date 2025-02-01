import { Trash2 } from 'lucide-react';
import { Product, CartItem } from '../types';
import { useState, useMemo } from 'react';

interface CartProps {
  items: CartItem[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onCheckout: (amountPaid: number, change: number, customerName: string) => void;
}

export default function Cart({ items, products, onRemoveItem, onCheckout }: CartProps) {
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const change = useMemo(() => {
    const amountPaidNum = Number(amountPaid) || 0;
    return Math.max(0, amountPaidNum - total);
  }, [amountPaid, total]);

  const notes = useMemo(() => {
    if (!amountPaid) return '';
    const amountPaidNum = Number(amountPaid);
    if (amountPaidNum === total) return 'Lunas';
    if (amountPaidNum < total) return 'Dp';
    return 'Lunas';
  }, [amountPaid, total]);

  const handleCheckout = () => {
    if (Number(amountPaid) > 0) {
      onCheckout(Number(amountPaid), change, customerName);
      setAmountPaid('');
      setCustomerName('');
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-3 flex flex-col h-screen w-80">
      <h2 className="text-lg font-semibold mb-3">Daftar Pembelian</h2>
      <div className="flex-1 overflow-auto">
        {items.map((item) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          
          return (
            <div key={item.productId} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-gray-500">
                  Rp {product.price.toFixed(2)} × {item.quantity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
        <div className="flex justify-between mb-3">
          <span className="font-medium text-sm">Total:</span>
          <span className="font-semibold text-sm">Rp {total.toFixed(2)}</span>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">
              Bayar
            </label>
            <input
              type="number"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              min={0}
              step="0.01"
              placeholder="Masukkan jumlah"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kembali
            </label>
            <div className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-700">
              Rp {change.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <div className={`w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md ${
              notes === 'Lunas' ? 'bg-green-50 text-green-700' : 
              notes === 'Dp' ? 'bg-yellow-50 text-yellow-700' : 
              'bg-gray-50 text-gray-700'
            }`}>
              {notes}
            </div>
          </div>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pelanggan
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama pelanggan"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || Number(amountPaid) <= 0}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Simpan & Cetak Nota
        </button>
      </div>
    </div>
  );
}
