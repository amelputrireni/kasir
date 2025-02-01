import { useState } from 'react';
import { Product } from '../types';
import { Calculator } from 'lucide-react';

interface EditProductFormProps {
  product: Product;
  onSubmit: (product: Product) => void;
}

export default function EditProductForm({ product, onSubmit }: EditProductFormProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [pricePerUnit, setPricePerUnit] = useState(product.pricePerUnit.toString());
  const [length, setLength] = useState(product.length.toString());
  const [width, setWidth] = useState(product.width.toString());
  const [stock, setStock] = useState(product.stock.toString());

  const calculateTotalPrice = () => {
    const calculatedPrice = Number(pricePerUnit) * Number(length) * Number(width);
    if (!isNaN(calculatedPrice)) {
      setPrice(calculatedPrice.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: product.id,
      name,
      price: Number(price),
      pricePerUnit: Number(pricePerUnit),
      length: Number(length),
      width: Number(width),
      stock: Number(stock),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nama Produk
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
          required
        />
      </div>

      <div>
        <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
          Harga Per Unit
        </label>
        <input
          type="number"
          id="pricePerUnit"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-gray-700">
            Panjang
          </label>
          <input
            type="number"
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>

        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Lebar
          </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Harga Total
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
          />
          <button
            type="button"
            onClick={calculateTotalPrice}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calculator size={16} className="mr-1" />
            Hitung
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stok
        </label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
