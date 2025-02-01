import { useState } from 'react';
import { ShopInfo } from '../types';
import { X } from 'lucide-react';

interface ShopSettingsProps {
  shopInfo: ShopInfo;
  onSave: (info: ShopInfo) => void;
  onClose: () => void;
}

export default function ShopSettings({ shopInfo, onSave, onClose }: ShopSettingsProps) {
  const [info, setInfo] = useState<ShopInfo>(shopInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(info);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Data Toko</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama Toko
            </label>
            <input
              type="text"
              id="name"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Alamat
            </label>
            <textarea
              id="address"
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="phone"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
