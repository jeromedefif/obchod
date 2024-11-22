'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import AdminProducts from './components/AdminProducts';
import LoginDialog from './components/LoginDialog';

const initialProducts = [
    { id: 1, name: "Rot wein", category: "Víno", inStock: true },
    { id: 2, name: "Grüner veltliner EX, suché, jakostní, WALEK, Rakousko", category: "Víno", inStock: true },
    { id: 3, name: "Tračer Exclusive, sl", category: "Nápoje", inStock: true },
    { id: 4, name: "Muscat, psl, EX", category: "Víno", inStock: true },
    { id: 5, name: "Dusíková láhev", category: "Dusík", inStock: true },
    { id: 6, name: "PET láhev 1L - čirá", category: "PET", inStock: true },
    { id: 7, name: "PET láhev 1,5L - čirá", category: "PET", inStock: true },
    { id: 8, name: "PET láhev 2L - čirá", category: "PET", inStock: true },
    { id: 9, name: "PET láhev 1,5L - zelená", category: "PET", inStock: true },
    { id: 10, name: "PET láhev 2L - zelená", category: "PET", inStock: true },
    { id: 11, name: "Vezel, s", category: "Nápoje", inStock: true },
    { id: 12, name: "Moport, s", category: "Nápoje", inStock: true },
    { id: 13, name: "Charnay, s", category: "Nápoje", inStock: true },
    { id: 14, name: "Charnay, p", category: "Nápoje", inStock: true },
    { id: 15, name: "Charnay, psl, Exclusive", category: "Nápoje", inStock: true },
    { id: 16, name: "Tračer, sl, Exclusive", category: "Nápoje", inStock: true },
    { id: 17, name: "Obstglühwein (Svařák)", category: "Ovocné víno", inStock: true },
    { id: 18, name: "Rybízové víno", category: "Ovocné víno", inStock: true },
    { id: 19, name: "Borůvkové víno", category: "Ovocné víno", inStock: true },
    { id: 20, name: "Višňové víno", category: "Ovocné víno", inStock: true },
    { id: 21, name: "Ostružinové víno", category: "Ovocné víno", inStock: true },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<'catalog' | 'order' | 'admin'>('catalog');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [products, setProducts] = useState(initialProducts);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Načtení košíku z localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Ukládání košíku do localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const getCartItemsCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const handleViewChange = (view: 'catalog' | 'order' | 'admin') => {
    if (view === 'admin' && !isAuthenticated) {
      setIsLoginDialogOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleLogin = (password: string) => {
    if (password === 'jeromedefif') {
      setIsAuthenticated(true);
      setIsLoginDialogOpen(false);
      setCurrentView('admin');
    }
  };

  const handleAddToCart = (productId: number, volume: number) => {
    setCartItems(prev => {
      const key = `${productId}-${volume}`;
      return {
        ...prev,
        [key]: (prev[key] || 0) + 1
      };
    });
  };

  const handleRemoveFromCart = (productId: number, volume: number) => {
    setCartItems(prev => {
      const key = `${productId}-${volume}`;
      const newItems = { ...prev };
      delete newItems[key];
      return newItems;
    });
  };

  const handleClearCart = () => {
    setCartItems({});
  };

  const getTotalVolume = () => {
    return Object.entries(cartItems).reduce((total, [key, count]) => {
        const [productId, volumeStr] = key.split('-');
        const product = products.find(p => p.id === parseInt(productId));

        // Pokud je produkt v kategorii PET nebo Dusík, nepřičítáme k objemu
        if (product && (product.category === 'PET' || product.category === 'Dusík')) {
            return total;
        }

        // Pro ostatní kategorie přičítáme objem
        const volume = parseInt(volumeStr);
        return total + (volume * count);
    }, 0);
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header
          cartItems={cartItems}
          products={products}
          onViewChange={handleViewChange}
          currentView={currentView}
          totalVolume={getTotalVolume()}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
      </div>

      <main className="container mx-auto px-4 py-6">
        {currentView === 'catalog' && (
          <ProductList
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            products={products}
          />
        )}
        {currentView === 'order' && (
          <OrderForm
            cartItems={cartItems}
            products={products}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            totalVolume={getTotalVolume()}
          />
        )}
        {currentView === 'admin' && isAuthenticated && (
          <AdminProducts
            products={products}
            onAddProduct={(product) => {
              const newId = Math.max(...products.map(p => p.id), 0) + 1;
              setProducts([...products, { ...product, id: newId }]);
            }}
            onUpdateProduct={(product) => {
              setProducts(products.map(p => p.id === product.id ? product : p));
            }}
            onDeleteProduct={(id) => {
              setProducts(products.filter(p => p.id !== id));
            }}
          />
        )}
      </main>

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
