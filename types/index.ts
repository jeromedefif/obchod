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


// Typy pro košík_Nové
export interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: { [key: string]: number };
    products: Product[];
    onRemoveFromCart: (productId: number, volume: string | number) => void;
    onClearCart: () => void;
    onGoToOrder: () => void;
    totalVolume: number;
}

export interface CartItemDisplay {
    volumeText: string;
    totalText: string;
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
