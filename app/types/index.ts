// Základní produktový typ, který reprezentuje položku v katalogu
export interface Product {
    id: number;
    name: string;
    category: string;
    in_stock: boolean;
    created_at?: string;
}

// Typy související s košíkem
export interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: { [key: string]: number };  // Formát: 'productId-volume': quantity
    products: Product[];
    onRemoveFromCart: (productId: number, volume: string | number) => void;
    onClearCart: () => void;
    onGoToOrder: () => void;
    totalVolume: number;
}

// Pomocný typ pro zobrazení položek v košíku
export interface CartItemDisplay {
    volumeText: string;    // Např. "5L" nebo "malý"
    totalText: string;     // Např. "10L" nebo "2x balení"
}

// Základní struktura položky v košíku
export interface CartItem {
    productId: number;
    volume: string | number;
    quantity: number;
}

// Typy pro správu zákazníků a jejich údajů
export interface CustomerData {
    name: string;
    email: string;
    phone: string;
    company?: string;
    note?: string;
}

// Typy pro správu objednávek
export interface OrderItem {
    productName: string;
    volume: string | number;
    quantity: number;
    display: string;       // Formátovaný text pro zobrazení
}

export interface OrderData {
    customer: CustomerData;
    items: OrderItem[];
    totalVolume: number;
}

// Definice možných stavů objednávky pro dialog potvrzení
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'error';

// Typy pro dialog potvrzení objednávky
export interface OrderConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderData: OrderData;
    orderStatus: OrderStatus;
}

export interface StepIndicatorProps {
    step: number;
    currentStatus: OrderStatus;
    label: string;
}

// Typy pro administrační rozhraní
export interface AdminProductsProps {
    products: Product[];
    onProductsChange: () => Promise<void>;
    onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    onUpdateProduct: (product: Omit<Product, 'created_at'>) => Promise<void>;
    onDeleteProduct: (id: number) => Promise<void>;
}

// Typ pro formulářová data při správě produktů
export interface FormData {
    name: string;
    category: string;
    in_stock: boolean;
}
