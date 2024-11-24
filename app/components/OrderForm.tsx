'use client';

import React, { useState, useEffect } from 'react';
import { Package, RotateCcw, Trash2, Wine, Grape, Martini, TestTube, Box } from 'lucide-react';
import OrderConfirmationDialog from './OrderConfirmationDialog';

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
const NON_VOLUME_CATEGORIES = ['PET', 'Dusík'];

const OrderForm = ({ cartItems, products, onRemoveFromCart, onClearCart, totalVolume }: OrderFormProps) => {
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

    const getItemIcon = (category: string) => {
        switch(category) {
            case 'Víno':
                return <Grape className="h-6 w-6 text-gray-800" />;
            case 'Ovocné víno':
                return <Wine className="h-6 w-6 text-gray-800" />;
            case 'Nápoje':
                return <Martini className="h-6 w-6 text-gray-800" />;
            case 'Dusík':
                return <TestTube className="h-6 w-6 text-gray-800" />;
            case 'PET':
                return <Box className="h-6 w-6 text-gray-800" />;
            default:
                return <Package className="h-6 w-6 text-gray-800" />;
        }
    };

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

    const getItemDisplay = (product: Product, volumeKey: string, count: number) => {
        switch(product.category) {
            case 'PET':
                return {
                    text: `${count}x balení`,
                    volumeDisplay: `${count}x balení`,
                    volumeForTotal: 0
                };
            case 'Dusík':
                const size = volumeKey === 'maly' ? 'malý' : 'velký';
                return {
                    text: `${count}x ${size}`,
                    volumeDisplay: `${count}x ${size}`,
                    volumeForTotal: 0
                };
            default:
                const volume = parseInt(volumeKey);
                return {
                    text: `${volume}L × ${count}`,
                    volumeDisplay: `${volume * count}L`,
                    volumeForTotal: volume * count
                };
        }
    };

    const calculateTotalVolume = () => {
        return Object.entries(cartItems).reduce((total, [key, count]) => {
            const [productId, volume] = key.split('-');
            const product = products.find(p => p.id === parseInt(productId));

            if (!product || NON_VOLUME_CATEGORIES.includes(product.category)) {
                return total;
            }

            return total + (parseInt(volume) * count);
        }, 0);
    };

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

            const display = getItemDisplay(product, volume, quantity);
            return {
                productName: product.name,
                volume: display.text,
                quantity,
                display: display.volumeDisplay
            };
        }).filter(Boolean);

        return {
            items,
            totalVolume: calculateTotalVolume(),
            customer: formData
        };
    };

    const actualTotalVolume = calculateTotalVolume();

    return (
        <div className="max-w-4xl mx-auto p-4">
            {hasDraft && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
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

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Přehled objednávky</h2>

                <div className="space-y-4 mb-6">
                    {Object.entries(cartItems).map(([key, count]) => {
                        const [productId, volumeKey] = key.split('-');
                        const product = products.find(p => p.id === parseInt(productId));
                        if (!product) return null;

                        const display = getItemDisplay(product, volumeKey, count);

                        return (
                            <div key={key} className="flex items-center border-b pb-4">
                                {getItemIcon(product.category)}
                                <div className="flex-grow ml-3">
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-gray-600">{display.text}</p>
                                </div>
                                <div className="text-right text-gray-900 font-medium mr-4">
                                    {display.volumeDisplay}
                                </div>
                                <button
                                    onClick={() => onRemoveFromCart(parseInt(productId), volumeKey)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Odebrat položku"
                                >
                                    <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {actualTotalVolume > 0 && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Celkový objem vín a nápojů</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {actualTotalVolume}L
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Kontaktní údaje</h2>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                            Jméno a příjmení *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="Jan Novák"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="jan.novak@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                            Telefon *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="+420 123 456 789"
                        />
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-1">
                            Název firmy
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="Název vaší firmy"
                        />
                    </div>

                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-900 mb-1">
                            Poznámka k objednávce
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            rows={3}
                            value={formData.note}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="Další informace k objednávce..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={Object.keys(cartItems).length === 0}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {Object.keys(cartItems).length === 0
                                ? 'Nejdříve přidejte položky do košíku'
                                : 'Odeslat objednávku'
                            }
                        </button>
                    </div>
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
