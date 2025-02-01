import { useEffect, useState } from 'react';
import { Product, CartItem, Sale, ShopInfo } from './types';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductForm from './components/ProductForm';
import EditProductForm from './components/EditProductForm';
import Receipt from './components/Receipt';
import SalesJournal from './components/SalesJournal';
import ShopSettings from './components/ShopSettings';
import Login from './components/Login';
import { History, Plus, Home, Store, LogOut, Building2 } from 'lucide-react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    const saved = localStorage.getItem('shopInfo');
    return saved ? JSON.parse(saved) : {
      name: 'SimplePay',
      address: '',
      phone: '',
      email: ''
    };
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);
  const [showSalesJournal, setShowSalesJournal] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showShopSettings, setShowShopSettings] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('shopInfo', JSON.stringify(shopInfo));
  }, [shopInfo]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
    };
    setProducts([...products, newProduct]);
    setShowProductForm(false);
  };

  const handleEditProduct = (productData: Product) => {
    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.id === productData.id ? productData : p
      )
    );
    setEditingProduct(null);
  };

  const handleAddToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.productId === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { productId: product.id, quantity: 1 }];
    });
    
    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find(item => item.productId === productId);
    if (item) {
      setProducts(currentProducts =>
        currentProducts.map(p =>
          p.id === productId ? { ...p, stock: p.stock + item.quantity } : p
        )
      );
    }
    setCart(currentCart => currentCart.filter(item => item.productId !== productId));
  };

  const handleCheckout = (amountPaid: number, change: number, customerName: string) => {
    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const sale: Sale = {
      id: crypto.randomUUID(),
      items: [...cart],
      total,
      timestamp: Date.now(),
      payment: {
        amountPaid,
        change
      },
      notes: amountPaid >= total ? 'Lunas' : 'Dp',
      customerName
    };

    setSales([...sales, sale]);
    setCart([]);
    setShowReceipt(sale);
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    setSales(currentSales =>
      currentSales.map(sale =>
        sale.id === updatedSale.id ? updatedSale : sale
      )
    );
  };

  const handleGoHome = () => {
    setShowSalesJournal(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <div className="flex-1 flex flex-col items-center space-y-4">
          <button
            onClick={handleGoHome}
            className={`p-3 rounded-xl transition-colors hover:bg-gray-100 ${!showSalesJournal ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            title="Home"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => setShowProductForm(true)}
            className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            title="Input Produk"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={() => setShowSalesJournal(!showSalesJournal)}
            className={`p-3 rounded-xl transition-colors hover:bg-gray-100 ${showSalesJournal ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            title="Data Penjualan"
          >
            <History size={24} />
          </button>
          <button
            onClick={() => setShowShopSettings(true)}
            className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            title="Data Toko"
          >
            <Store size={24} />
          </button>
        </div>
        <div className="pt-4 border-t border-gray-200 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center">
            <Building2 size={24} className="text-gray-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-800">{shopInfo.name}</h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4">
            {showSalesJournal ? (
              <SalesJournal 
                sales={sales} 
                products={products}
                onUpdateSale={handleUpdateSale}
                shopInfo={shopInfo}
              />
            ) : (
              <ProductList
                products={products}
                onAddToCart={handleAddToCart}
                onEditProduct={setEditingProduct}
              />
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-80">
        <Cart
          items={cart}
          products={products}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      </div>

      {showReceipt && (
        <Receipt
          sale={showReceipt}
          products={products}
          shopInfo={shopInfo}
          onClose={() => setShowReceipt(null)}
        />
      )}

      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Input Produk</h2>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4">
              <ProductForm onSubmit={handleAddProduct} />
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Produk</h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4">
              <EditProductForm
                product={editingProduct}
                onSubmit={handleEditProduct}
              />
            </div>
          </div>
        </div>
      )}

      {showShopSettings && (
        <ShopSettings
          shopInfo={shopInfo}
          onSave={setShopInfo}
          onClose={() => setShowShopSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
