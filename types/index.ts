// Základní typy pro produkty
export interface Product {
    id: number;
    name: string;
    category: string;
    in_stock: boolean;
    created_at?: string;
}

// Typy pro košík
export interface CartItem {
    productId: number;
    volume: string | number;
    quantity: number;
}

// Typy pro objednávky
export interface OrderData {
    customer: {
        name: string;
        email: string;
        phone: string;
        company?: string;
        note?: string;
    };
    items: CartItem[];
    totalVolume: number;
}
