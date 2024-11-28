'use client';

import React from 'react';
import { Package, Wine, Grape, Martini, TestTube, Box, Trash2, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface OrderSummaryProps {
    cartItems: { [key: string]: number };
    products: Product[];
    onRemoveFromCart: (productId: number, volume: string | number) => void;
    onAddToCart: (productId: number, volume: string | number) => void;
    totalVolume: number;
}

interface CategoryIcon {
    category: string;
    icon: JSX.Element;
}

const CATEGORY_ORDER: string[] = ['Víno', 'Ovocné víno', 'Nápoje', 'Dusík', 'PET'];

const OrderSummary: React.FC<OrderSummaryProps> = ({
    cartItems,
    products,
    onRemoveFromCart,
    onAddToCart,
    totalVolume
}) => {
    const getCategoryIcon = (category: string): JSX.Element => {
        switch(category) {
            case 'Víno':
                return <Grape className="h-5 w-5 text-gray-600" />;
            case 'Ovocné víno':
                return <Wine className="h-5 w-5 text-gray-600" />;
            case 'Nápoje':
                return <Martini className="h-5 w-5 text-gray-600" />;
            case 'Dusík':
                return <TestTube className="h-5 w-5 text-gray-600" />;
            case 'PET':
                return <Box className="h-5 w-5 text-gray-600" />;
            default:
                return <Package className="h-5 w-5 text-gray-600" />;
        }
    };

    const getItemText = (product: Product, volume: string): string => {
        if (product.category === 'PET') {
            return 'balení';
        }
        if (product.category === 'Dusík') {
            return volume === 'maly' ? 'malý' : 'velký';
        }
        return `${volume}L`;
    };

    const getItemsCount = (count: number): string => {
        if (count === 1) return 'položka';
        if (count >= 2 && count <= 4) return 'položky';
        return 'položek';
    };

    interface GroupedItems {
        [category: string]: Array<{
            product: Product;
            volume: string;
            count: number;
        }>;
    }

    const groupedItems = Object.entries(cartItems).reduce<GroupedItems>((acc, [key, count]) => {
        const [productId, volume] = key.split('-');
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) return acc;

        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push({ product, volume, count });
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedItems).sort(
        (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
    );

    const handleIncrement = (productId: number, volume: string): void => {
        onAddToCart(productId, volume);
    };

    const handleDecrement = (productId: number, volume: string): void => {
        onRemoveFromCart(productId, volume);
    };

    if (Object.keys(cartItems).length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">Košík je prázdný</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Přehled objednávky</h2>
                    <span className="text-sm text-gray-500">
                        {Object.keys(cartItems).length} {getItemsCount(Object.keys(cartItems).length)}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="divide-y divide-gray-100">
                    {sortedCategories.map((category) => (
                        <div key={category} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center text-gray-700 mb-2">
                                {getCategoryIcon(category)}
                                <span className="ml-2 font-medium">{category}</span>
                            </div>
                            <div className="space-y-1 ml-7">
                                {groupedItems[category].map(({ product, volume, count }) => (
                                    <div
                                        key={`${product.id}-${volume}`}
                                        className="flex items-center justify-between text-sm hover:bg-blue-50
                                                 p-2 rounded-lg transition-colors group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-gray-900">
                                                {product.name}
                                            </span>
                                            <span className="ml-2 text-gray-500">
                                                {getItemText(product, volume)}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center bg-white border rounded-lg">
                                                <button
                                                    onClick={() => handleDecrement(product.id, volume)}
                                                    className="p-1 hover:bg-gray-100 rounded-l-lg border-r"
                                                    title="Snížit množství"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="px-3 py-1 font-medium text-gray-700">
                                                    {count}
                                                </span>
                                                <button
                                                    onClick={() => handleIncrement(product.id, volume)}
                                                    className="p-1 hover:bg-gray-100 rounded-r-lg border-l"
                                                    title="Zvýšit množství"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => onRemoveFromCart(product.id, volume)}
                                                className="p-1 hover:bg-red-100 rounded-lg
                                                         opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Odebrat položku"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {totalVolume > 0 && (
                <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Celkový objem:</span>
                        <span className="text-xl font-bold text-blue-600">
                            {totalVolume}L
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderSummary;
