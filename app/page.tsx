'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from './components/Header';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import AdminProducts from './components/AdminProducts';
import LoginDialog from './components/LoginDialog';
import { Product } from './types';

type View = 'catalog' | 'order' | 'admin';
type CartItems = { [key: string]: number };

const defaultCartItems: CartItems = {};

export default function Home() {
    const [currentView, setCurrentView] = useState<View>('catalog');
    const [cartItems, setCartItems] = useState<CartItems>(defaultCartItems);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadProducts = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name');

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCartItems(JSON.parse(savedCart));
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCartItems(defaultCartItems);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    const handleViewChange = (view: View): void => {
        if (view === 'admin' && !isAuthenticated) {
            setIsLoginDialogOpen(true);
        } else {
            setCurrentView(view);
        }
    };

    const handleLogin = (password: string): void => {
        if (password === 'jeromedefif') {
            setIsAuthenticated(true);
            setIsLoginDialogOpen(false);
            setCurrentView('admin');
        }
    };

    const handleAddToCart = (productId: number, volume: number | string): void => {
        setCartItems(prev => ({
            ...prev,
            [`${productId}-${volume}`]: (prev[`${productId}-${volume}`] || 0) + 1
        }));
    };

    const handleRemoveFromCart = (productId: number, volume: number | string): void => {
        setCartItems(prev => {
            const key = `${productId}-${volume}`;
            const currentCount = prev[key] || 0;

            if (currentCount <= 1) {
                const { [key]: _, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [key]: currentCount - 1
            };
        });
    };

    const handleClearCart = (): void => {
        setCartItems(defaultCartItems);
    };

    const getTotalVolume = (): number => {
        return Object.entries(cartItems).reduce((total, [key, count]) => {
            const [_, volume] = key.split('-');
            if (volume === 'maly' || volume === 'velky' || volume === 'baleni') {
                return total;
            }
            return total + (parseInt(volume as string) * count);
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
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    </div>
                ) : (
                    <>
                        {currentView === 'catalog' && (
                            <ProductList
                                onAddToCart={handleAddToCart}
                                onRemoveFromCart={handleRemoveFromCart}
                                cartItems={cartItems}
                                products={products}
                            />
                        )}
                        {currentView === 'order' && (
                            <OrderForm
                                cartItems={cartItems}
                                products={products}
                                onRemoveFromCart={handleRemoveFromCart}
                                onAddToCart={handleAddToCart}
                                onClearCart={handleClearCart}
                                totalVolume={getTotalVolume()}
                            />
                        )}
                        {currentView === 'admin' && isAuthenticated && (
                            <AdminProducts
                                products={products}
                                onProductsChange={loadProducts}
                                onAddProduct={async (product) => {
                                    const { error } = await supabase
                                        .from('products')
                                        .insert([{
                                            name: product.name,
                                            category: product.category,
                                            in_stock: product.inStock
                                        }]);

                                    if (error) {
                                        console.error('Error adding product:', error);
                                        return;
                                    }

                                    await loadProducts();
                                }}
                                onUpdateProduct={async (product) => {
                                    const { error } = await supabase
                                        .from('products')
                                        .update({
                                            name: product.name,
                                            category: product.category,
                                            in_stock: product.inStock
                                        })
                                        .eq('id', product.id);

                                    if (error) {
                                        console.error('Error updating product:', error);
                                        return;
                                    }

                                    await loadProducts();
                                }}
                                onDeleteProduct={async (id) => {
                                    const { error } = await supabase
                                        .from('products')
                                        .delete()
                                        .eq('id', id);

                                    if (error) {
                                        console.error('Error deleting product:', error);
                                        return;
                                    }

                                    await loadProducts();
                                }}
                            />
                        )}
                    </>
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
