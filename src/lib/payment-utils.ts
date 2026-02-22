export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export function calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function formatAmountForGateway(amount: number, gateway: 'STRIPE' | 'PAYPAL' | 'RAZORPAY'): number {
    switch (gateway) {
        case 'STRIPE':
        case 'RAZORPAY':
            return Math.round(amount * 100); // Cents
        case 'PAYPAL':
            return Number(amount.toFixed(2)); // Standard float with 2 decimals
        default:
            return amount;
    }
}
