'use client';

import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2, X, Search, Grape, Wine, Martini, TestTube, Box, Package } from 'lucide-react';

// Definice typů zůstávají stejné
interface Product {
    id: number;
    name: string;
    category: string;
    in_stock: boolean;
}

interface AdminProductsProps {
    products: Product[];
    onProductsChange: () => Promise<void>;
    onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    onUpdateProduct: (product: Omit<Product, 'created_at'>) => Promise<void>;
    onDeleteProduct: (id: number) => Promise<void>;
}

// Přidáváme helper funkci pro ikony kategorií - stejnou jako v ProductList
const getProductIcon = (category: string) => {
    switch(category) {
        case 'Víno':
            return <Grape className="h-5 w-5 text-gray-700" />;
        case 'Ovocné víno':
            return <Wine className="h-5 w-5 text-gray-700" />;
        case 'Nápoje':
            return <Martini className="h-5 w-5 text-gray-700" />;
        case 'Dusík':
            return <TestTube className="h-5 w-5 text-gray-700" />;
        case 'PET':
            return <Box className="h-5 w-5 text-gray-700" />;
        default:
            return <Package className="h-5 w-5 text-gray-700" />;
    }
};

// Vylepšený editační formulář s kompaktnějším designem
const EditForm = ({
    product,
    onSave,
    onCancel,
    isLoading
}: {
    product: Product;
    onSave: (formData: any) => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    const [formData, setFormData] = useState({
        name: product.name,
        category: product.category,
        inStock: product.in_stock
    });

    const categories = ["Víno", "Nápoje", "Ovocné víno", "Dusík", "PET"];

    return (
        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                    {/* Název produktu */}
                    <div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Název produktu"
                            required
                        />
                    </div>
                    {/* Kategorie */}
                    <div>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={formData.inStock}
                            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Skladem</span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Zrušit
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Ukládám...' : 'Uložit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Kompaktnější formulář pro přidání nového produktu
const AddProductForm = ({
    onSave,
    onCancel,
    isLoading
}: {
    onSave: (formData: any) => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Víno',
        inStock: true
    });

    const categories = ["Víno", "Nápoje", "Ovocné víno", "Dusík", "PET"];

    return (
        <div className="bg-white p-4 rounded-lg border mb-4">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Název produktu"
                        required
                    />
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={formData.inStock}
                            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Skladem</span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Zrušit
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={isLoading || !formData.name.trim()}
                        >
                            Přidat produkt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hlavní komponenta AdminProducts s novým kompaktním designem
const AdminProducts = ({
    products,
    onProductsChange,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
}: AdminProductsProps) => {
    const [editingInline, setEditingInline] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filtrování produktů
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handler funkce zůstávají stejné...

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Hlavička s vyhledáváním a tlačítkem pro přidání */}
            <div className="sticky top-16 bg-white z-40 pb-3 pt-3 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-900">Správa produktů</h2>
                    {!isAddingNew && (
                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle className="w-4 h-4 mr-1.5" />
                            Přidat produkt
                        </button>
                    )}
                </div>

                {/* Formulář pro přidání nového produktu */}
                {isAddingNew && (
                    <AddProductForm
                        onSave={handleAddProduct}
                        onCancel={() => setIsAddingNew(false)}
                        isLoading={isLoading}
                    />
                )}

                {/* Vyhledávací pole */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Vyhledat produkt..."
                        className="block w-full pl-9 pr-4 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <div className="mt-1 text-xs text-gray-600">
                        Nalezeno {filteredProducts.length} produktů
                    </div>
                )}
            </div>

            {/* Seznam produktů */}
            <div className="mt-3">
                <div className="bg-white rounded-lg border">
                    {filteredProducts.map((product) => (
                        <React.Fragment key={product.id}>
                            {editingInline === product.id ? (
                                <div className="p-2">
                                    <EditForm
                                        product={product}
                                        onSave={(formData) => handleInlineUpdate(product.id, formData)}
                                        onCancel={() => setEditingInline(null)}
                                        isLoading={isLoading}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center py-1.5 px-3 hover:bg-blue-50/80 transition-all duration-150 border-b last:border-b-0">
                                    {/* Ikona kategorie */}
                                    <div className="w-8 flex-shrink-0">
                                        {getProductIcon(product.category)}
                                    </div>

                                    {/* Název a detaily */}
                                    <div className="flex-grow min-w-0 flex items-center gap-2">
                                        <div className="max-w-[300px] overflow-hidden truncate" title={product.name}>
                                            {product.name}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {product.category}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none font-medium shrink-0 ${
                                            product.in_stock
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-50 text-red-800'
                                        }`}>
                                            {product.in_stock ? 'Skladem' : 'Není skladem'}
                                        </span>
                                    </div>

                                    {/* Akční tlačítka */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => setEditingInline(product.id)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Upravit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Smazat"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-6">
                            <Search className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-base">
                                {searchQuery
                                    ? "Nenalezeny žádné produkty odpovídající vašemu hledání"
                                    : "Zatím nejsou přidány žádné produkty"}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Zobrazit všechny produkty
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
