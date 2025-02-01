import { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { Sale, Product, ShopInfo } from '../types';

interface ReceiptProps {
  sale: Sale;
  products: Product[];
  shopInfo: ShopInfo;
  onClose: () => void;
}

export default function Receipt({ sale, products, shopInfo, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const style = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .receipt { max-width: 300px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .shop-info { text-align: center; margin-bottom: 20px; font-size: 0.9em; }
        .item { margin-bottom: 10px; }
        .total { margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
        .payment-details { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; }
        .customer-details { margin-top: 10px; text-align: left; }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>${style}</head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Nota</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6" ref={receiptRef}>
          <div className="receipt">
            <div className="header">
              <h2 className="text-xl font-bold mb-2">{shopInfo.name}</h2>
              <div className="shop-info text-sm text-gray-600">
                <p>Telp: {shopInfo.phone}</p>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(sale.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-4">Nota #{sale.id.slice(0, 8)}</p>
            </div>

            {sale.customerName && (
              <div className="customer-details mb-4 text-sm">
                <div className="font-medium">Pelanggan:</div>
                <div>{sale.customerName}</div>
              </div>
            )}
            
            <div className="items space-y-4">
              {sale.items.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                
                return (
                  <div key={item.productId} className="item flex justify-between">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        Rp {product.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      Rp {(product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="total mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {sale.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-details mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Bayar</span>
                <span>Rp {sale.payment.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kembali</span>
                <span>Rp {sale.payment.change.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Status</span>
                <span className={sale.payment.amountPaid >= sale.total ? 'text-green-600' : 'text-yellow-600'}>
                  {sale.payment.amountPaid >= sale.total ? 'Lunas' : 'Dp'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Terima kasih atas pembelian Anda!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
