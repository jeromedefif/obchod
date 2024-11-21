'use client';

import React, { useState } from 'react';
import { ShoppingCart, List, Settings } from 'lucide-react';
import Cart from './Cart';

type HeaderProps = {
  cartItems: {[key: string]: number};
  products: Array<{
    id: number;
    name: string;
    category: string;
    inStock: boolean;
  }>;
  onViewChange: (view: 'catalog' | 'order' | 'admin') => void;
  currentView: 'catalog' | 'order' | 'admin';
  totalVolume: number;
  onRemoveFromCart: (productId: number, volume: number) => void;
  onClearCart: () => void;
};

const Header = ({
  cartItems,
  products,
  onViewChange,
  currentView,
  totalVolume,
  onRemoveFromCart,
  onClearCart
}: HeaderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-900">VINARIA s.r.o.</h1>
              <nav className="hidden md:ml-6 md:flex md:space-x-4">
                <button
                  onClick={() => onViewChange('catalog')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentView === 'catalog'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <List className="mr-1.5 h-5 w-5" />
                  Katalog produktů
                </button>
                <button
                  onClick={() => onViewChange('order')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentView === 'order'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Souhrn objednávky
                </button>
              </nav>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => onViewChange('admin')}
                className={`mr-4 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  currentView === 'admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="mr-1.5 h-5 w-5" />
                Správa
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
                <ShoppingCart className="h-6 w-6 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        products={products}
        onRemoveFromCart={onRemoveFromCart}
        onClearCart={onClearCart}
        onGoToOrder={() => {
          setIsCartOpen(false);
          onViewChange('order');
        }}
        totalVolume={totalVolume}
      />
    </>
  );
};

export default Header;
