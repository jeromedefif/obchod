'use client';

import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2, X, Search } from 'lucide-react';

// Základní rozhraní pro produkt
interface Product {
    id: number;
    name: string;
    category: string;
    in_stock: boolean;
    created_at?: string;
}

// Rozhraní pro data formuláře
interface FormData {
    name: string;
    category: string;
    inStock: boolean;
}

// Props pro EditForm komponentu
interface EditFormProps {
    product: Product;
    onSave: (formData: FormData) => void;
    onCancel: () => void;
    isLoading: boolean;
}

// Props pro AddProductForm komponentu
interface AddProductFormProps {
    onSave: (formData: FormData) => void;
    onCancel: () => void;
    isLoading: boolean;
}

// Props pro hlavní AdminProducts komponentu
interface AdminProductsProps {
    products: Product[];
    onProductsChange: () => Promise<void>;
    onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    onUpdateProduct: (product: Omit<Product, 'created_at'>) => Promise<void>;
    onDeleteProduct: (id: number) => Promise<void>;
}

// Event handlery pro formuláře
interface EditFormHandlers {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

// Komponenta pro editační formulář
const EditForm: React.FC<EditFormProps> = ({
    product,
    onSave,
    onCancel,
    isLoading
}) => {
    // State pro formulářová data
    const [formData, setFormData] = useState<FormData>({
        name: product.name,
        category: product.category,
        inStock: product.in_stock
    });

    // Dostupné kategorie produktů
    const categories: string[] = ["Víno", "Nápoje", "Ovocné víno", "Dusík", "PET"];

    // Handler pro změnu inputů
    const handleInputChange: EditFormHandlers['handleInputChange'] = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-inner border border-blue-100">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Název produktu
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Kategorie
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                        disabled={isLoading}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id={`inStock-${product.id}`}
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isLoading}
                    />
                    <label htmlFor={`inStock-${product.id}`} className="ml-2 block text-sm font-medium text-gray-900">
                        Skladem
                    </label>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-1" />
                        Zrušit
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Ukládám...' : 'Uložit změny'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponenta pro přidání nového produktu
const AddProductForm: React.FC<AddProductFormProps> = ({
    onSave,
    onCancel,
    isLoading
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        category: 'Víno',
        inStock: true
    });

    const categories: string[] = ["Víno", "Nápoje", "Ovocné víno", "Dusík", "PET"];

    const handleInputChange: EditFormHandlers['handleInputChange'] = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nový produkt</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Název produktu
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                        required
                        disabled={isLoading}
                        placeholder="Zadejte název produktu"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                        Kategorie
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900"
                        disabled={isLoading}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="newProductInStock"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isLoading}
                    />
                    <label htmlFor="newProductInStock" className="ml-2 block text-sm font-medium text-gray-900">
                        Skladem
                    </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Zrušit
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                        disabled={isLoading || !formData.name.trim()}
                    >
                        {isLoading ? 'Ukládám...' : 'Přidat produkt'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Hlavní komponenta AdminProducts
const AdminProducts: React.FC<AdminProductsProps> = ({
    products,
    onProductsChange,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct
}) => {
    // State management
    const [editingInline, setEditingInline] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Handler pro mazání produktu
    const handleDelete = async (id: number): Promise<void> => {
        if (window.confirm('Opravdu chcete smazat tento produkt?')) {
            setIsLoading(true);
            try {
                await onDeleteProduct(id);
                await onProductsChange();
            } catch (error) {
                console.error('Error deleting product:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handler pro inline aktualizaci produktu
    const handleInlineUpdate = async (productId: number, formData: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            await onUpdateProduct({
                id: productId,
                name: formData.name,
                category: formData.category,
                in_stock: formData.inStock
            });
            await onProductsChange();
            setEditingInline(null);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler pro přidání nového produktu
    const handleAddProduct = async (formData: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            await onAddProduct(formData);
            await onProductsChange();
            setIsAddingNew(false);
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrování produktů podle vyhledávání
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Správa produktů</h2>
                {!isAddingNew && (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        disabled={isLoading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Přidat produkt
                    </button>
                )}
            </div>

            {isAddingNew && (
                <AddProductForm
                    onSave={handleAddProduct}
                    onCancel={() => setIsAddingNew(false)}
                    isLoading={isLoading}
                />
            )}

            {/* Vyhledávací pole */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Vyhledat produkt..."
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Seznam produktů v tabulce */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Hlavička tabulky */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Název</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategorie</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stav</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akce</th>
                        </tr>
                    </thead>

                    {/* Tělo tabulky */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length === 0 ? (
                            // Zobrazení prázdného stavu, když nejsou nalezeny žádné produkty
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    {searchQuery ? (
                                        <div className="flex flex-col items-center">
                                            <Search className="h-8 w-8 text-gray-400 mb-2" />
                                            <p>Nenalezeny žádné produkty odpovídající vašemu hledání</p>
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="mt-2 text-blue-600 hover:text-blue-800"
                                            >
                                                Zobrazit všechny produkty
                                            </button>
                                        </div>
                                    ) : (
                                        <p>Zatím nejsou přidány žádné produkty</p>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            // Mapování přes filtrované produkty a zobrazení každého řádku
                            filteredProducts.map((product) => (
                                <React.Fragment key={product.id}>
                                    {/* Řádek s informacemi o produktu */}
                                    <tr className={editingInline === product.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.in_stock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.in_stock ? "Skladem" : "Není skladem"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* Tlačítka pro akce s produktem */}
                                            <button
                                                onClick={() => setEditingInline(product.id)}
                                                disabled={isLoading}
                                                className="text-blue-600 hover:text-blue-900 mr-3 disabled:text-blue-300"
                                                title="Upravit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-900 disabled:text-red-300"
                                                title="Smazat"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Řádek s editačním formulářem, zobrazí se při editaci */}
                                    {editingInline === product.id && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 bg-blue-50">
                                                <EditForm
                                                    product={product}
                                                    onSave={(formData) => handleInlineUpdate(product.id, formData)}
                                                    onCancel={() => setEditingInline(null)}
                                                    isLoading={isLoading}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminProducts;
