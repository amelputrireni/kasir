import { useState } from 'react';
import { X } from 'lucide-react';
import { Sale, Product, CartItem } from '../types';

interface EditSaleFormProps {
  sale: Sale;
  products: Product[];
  onSave: (updatedSale: Sale) => void;
  onClose: () => void;
}

export default function EditSaleForm({ sale, products, onSave, onClose }: EditSaleFormProps) {
  const [customerName, setCustomerName] = useState(sale.customerName);
  const [amountPaid, setAmountPaid] = useState(sale.payment.amountPaid.toString());
  const [items, setItems] = useState<CartItem[]>(sale.items);

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateChange = () => {
    const total = calculateTotal();
    return Math.max(0, Number(amountPaid) - total);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.productId !== productId)
    );
  };

  const handleSave = () => {
    const total = calculateTotal();
    const change = calculateChange();
    
    const updatedSale: Sale = {
      ...sale,
      items: [...items],
      total,
      customerName,
      payment: {
        amountPaid: Number(amountPaid),
        change
      },
      notes: Number(amountPaid) >= total ? 'Lunas' : 'Dp'
    };

    onSave(updatedSale);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Data Penjualan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Daftar Barang</h3>
              <div className="space-y-3">
                {items.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          Rp {product.price.toFixed(2)} per unit
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.productId, Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Bayar
              </label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total:</span>
                <span>Rp {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Kembali:</span>
                <span>Rp {calculateChange().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Status:</span>
                <span className={Number(amountPaid) >= calculateTotal() ? 'text-green-600' : 'text-yellow-600'}>
                  {Number(amountPaid) >= calculateTotal() ? 'Lunas' : 'Dp'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
