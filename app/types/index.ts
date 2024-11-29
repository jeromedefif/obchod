```typescript
// Product types
export interface Product {
    id: number;
    name: string;
    category: string;
    in_stock: boolean;
    created_at?: string;
}

// Cart types
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

export interface CartItem {
    productId: number;
    volume: string | number;
    quantity: number;
}

// Customer types
export interface CustomerData {
    name: string;
    email: string;
    phone: string;
    company?: string;
    note?: string;
}

// Order types
export interface OrderItem {
    productName: string;
    volume: string | number;
    quantity: number;
    display: string;
}

export interface OrderData {
    customer: CustomerData;
    items: OrderItem[];
    totalVolume: number;
}

// Admin types
export interface AdminProductsProps {
    products: Product[];
    onProductsChange: () => Promise<void>;
    onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    onUpdateProduct: (product: Omit<Product, 'created_at'>) => Promise<void>;
    onDeleteProduct: (id: number) => Promise<void>;
}

export interface FormData {
    name: string;
    category: string;
    in_stock: boolean;
}
