'use client';

import React, { useState } from 'react';
import { Wine, Package, Grape, TestTube, Box, Martini, ListFilter } from 'lucide-react';

type Product = {
    id: number;
    name: string;
    category: string;
    inStock: boolean;
};

type ProductListProps = {
    onAddToCart: (productId: number, volume: number | string) => void;
    cartItems: {[key: string]: number};
    products: Product[];
};

const VolumeOption = {
    LITERS: [5, 10, 20, 30, 50],
    PET: [{ label: '1x balení', value: 'baleni' }],
    DUSIK: [
        { label: 'malý', value: 'maly' },
        { label: 'velký', value: 'velky' }
    ]
};

const categoryButtons = [
    { id: 'Všechny', icon: <ListFilter className="h-6 w-6" />, label: 'Vše' },
    { id: 'Víno', icon: <Grape className="h-6 w-6" />, label: 'Víno' },
    { id: 'Nápoje', icon: <Martini className="h-6 w-6" />, label: 'Nápoje' },
    { id: 'Ovocné víno', icon: <Wine className="h-6 w-6" />, label: 'Ovocné' },
    { id: 'Dusík', icon: <TestTube className="h-6 w-6" />, label: 'Dusík' },
    { id: 'PET', icon: <Box className="h-6 w-6" />, label: 'PET' }
];

const ProductList = ({ onAddToCart, cartItems, products }: ProductListProps) => {
    const [selectedCategory, setSelectedCategory] = useState("Všechny");
    const [showCartItems, setShowCartItems] = useState(false);

    const getProductIcon = (category: string) => {
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

    const getVolumeButtons = (product: Product) => {
        switch(product.category) {
            case 'PET':
                return VolumeOption.PET;
            case 'Dusík':
                return VolumeOption.DUSIK;
            default:
                return VolumeOption.LITERS.map(vol => ({ label: `${vol}L`, value: vol }));
        }
    };

    const isInCart = (productId: number) => {
        return Object.keys(cartItems).some(key => key.startsWith(`${productId}-`));
    };

    const getCartCount = (productId: number, volume: number | string) => {
        const key = `${productId}-${volume}`;
        return cartItems[key] || 0;
    };

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === "Všechny" ? true : product.category === selectedCategory;
        const cartMatch = showCartItems ? isInCart(product.id) : true;
        return categoryMatch && cartMatch;
    });

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-6 space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">Katalog produktů</h1>

                <div className="flex justify-between items-center">
                    {/* Nové tlačítka kategorií */}
                    <div className="flex space-x-2">
                        {categoryButtons.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                                    selectedCategory === cat.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                title={cat.id}
                            >
                                {cat.icon}
                                <span className="text-xs mt-1">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="cart-filter"
                            checked={showCartItems}
                            onChange={(e) => setShowCartItems(e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="cart-filter" className="text-gray-900 font-medium">
                            Pouze vybrané položky
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="mr-4">
                            {getProductIcon(product.category)}
                        </div>

                        <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{product.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    product.inStock
                                        ? 'bg-green-100 text-green-900'
                                        : 'bg-red-100 text-red-900'
                                }`}>
                                    {product.inStock ? "Skladem" : "Není skladem"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">
                                Kategorie: {product.category}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            {getVolumeButtons(product).map(({ label, value }) => (
                                <div key={`${product.id}-${value}`} className="relative">
                                    <button
                                        onClick={() => product.inStock && onAddToCart(product.id, value)}
                                        disabled={!product.inStock}
                                        className={`w-16 px-2 py-1 text-sm border rounded-lg ${
                                            product.inStock
                                                ? 'bg-white text-gray-900 border-gray-300 hover:bg-blue-50 active:bg-blue-100'
                                                : 'opacity-50 cursor-not-allowed text-gray-500'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                    {getCartCount(product.id, value) > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {getCartCount(product.id, value)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-900 mt-8 font-medium">
                    {showCartItems
                        ? "V košíku nejsou žádné položky"
                        : "V této kategorii nejsou žádné produkty"}
                </p>
            )}
        </div>
    );
};

export default ProductList;
