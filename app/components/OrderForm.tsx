'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import OrderConfirmationDialog from './OrderConfirmationDialog';
import OrderSummary from './OrderSummary';

type Product = {
    id: number;
    name: string;
    category: string;
    in_stock: boolean;
    created_at?: string;
};

type OrderFormProps = {
    cartItems: {[key: string]: number};
    products: Array<Product>;
    onRemoveFromCart: (productId: number, volume: string | number) => void;
    onAddToCart: (productId: number, volume: string | number) => void; // Přidána nová prop
    onClearCart: () => void;
    totalVolume: number;
};

type FormData = {
    name: string;
    email: string;
    phone: string;
    company: string;
    note: string;
};

const DRAFT_KEY = 'orderFormDraft';

const OrderForm = ({ 
    cartItems, 
    products, 
    onRemoveFromCart, 
    onAddToCart, // Přidána nová prop
    onClearCart, 
    totalVolume 
}: OrderFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        note: ''
    });
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState<'pending' | 'processing' | 'completed' | 'error'>('pending');
    const [hasDraft, setHasDraft] = useState(false);

    // Načtení draftu při prvním renderu
    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                setHasDraft(true);
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

    // Ukládání draftu při změnách
    useEffect(() => {
        if (Object.values(formData).some(value => value !== '')) {
            try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
                setHasDraft(true);
            } catch (error) {
                console.error('Error saving draft:', error);
            }
        }
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const loadDraft = () => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                setFormData(JSON.parse(savedDraft));
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    };

    const clearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            note: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmationOpen(true);
    };

    const handleConfirmOrder = async () => {
        setOrderStatus('processing');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setOrderStatus('completed');
            clearDraft();
            setTimeout(() => {
                setIsConfirmationOpen(false);
                onClearCart();
            }, 2000);
        } catch (error) {
            setOrderStatus('error');
        }
    };

    const getOrderSummary = () => {
        const items = Object.entries(cartItems).map(([key, quantity]) => {
            const [productId, volume] = key.split('-');
            const product = products.find(p => p.id === parseInt(productId));
            if (!product) return null;

            return {
                productName: product.name,
                volume: volume,
                quantity,
                display: product.category === 'PET' 
                    ? `${quantity}× balení`
                    : product.category === 'Dusík'
                        ? `${quantity}× ${volume === 'maly' ? 'malý' : 'velký'}`
                        : `${volume}L × ${quantity}`
            };
        }).filter(Boolean);

        return {
            items,
            totalVolume,
            customer: formData
        };
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {hasDraft && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <RotateCcw className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-blue-700">Máte rozepsanou objednávku</span>
                    </div>
                    <div className="space-x-3">
                        <button
                            onClick={loadDraft}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Načíst
                        </button>
                        <button
                            onClick={clearDraft}
                            className="text-gray-600 hover:text-gray-700"
                        >
                            Zahodit
                        </button>
                    </div>
                </div>
            )}

            {/* Order Summary */}
            <OrderSummary
                cartItems={cartItems}
                products={products}
                onRemoveFromCart={onRemoveFromCart}
                onAddToCart={onAddToCart} // Přidána nová prop
                totalVolume={totalVolume}
            />

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-lg shadow divide-y divide-gray-100">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Kontaktní údaje</h2>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Jméno a příjmení *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Jan Novák"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="jan.novak@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Telefon *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+420 123 456 789"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                Název firmy
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Název vaší firmy"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                            Poznámka k objednávce
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            rows={3}
                            value={formData.note}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Další informace k objednávce..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                    <button
                        type="submit"
                        disabled={Object.keys(cartItems).length === 0}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                                 hover:bg-blue-700 transition-colors disabled:bg-gray-400 
                                 disabled:cursor-not-allowed"
                    >
                        {Object.keys(cartItems).length === 0
                            ? 'Nejdříve přidejte položky do košíku'
                            : 'Odeslat objednávku'
                        }
                    </button>
                </div>
            </form>

            <OrderConfirmationDialog
                isOpen={isConfirmationOpen}
                onClose={() => {
                    if (orderStatus !== 'processing') {
                        setIsConfirmationOpen(false);
                        setOrderStatus('pending');
                    }
                }}
                onConfirm={handleConfirmOrder}
                orderData={getOrderSummary()}
                orderStatus={orderStatus}
            />
        </div>
    );
};

export default OrderForm;