// Base interfaces for our cart system
// 1. CartItem
// 2. Customer
// 3. PriceModificationStrategy
// 4. PriceContext

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isSaleItem?: boolean;
  isEligibleForBonus?: boolean;
}

export interface Customer {
  id: string;
  email: string;
  isNewCustomer: boolean;
  birthday?: Date;
  bonusPoints: number;
}

// Strategy Pattern Interface for price modifications
export interface PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number;
  getDescription(): string;
}

export interface PriceContext {
  customer: Customer;
  cartItems: CartItem[];
  intermediateAmount: number;
}

// Composite Pattern Interface for cart items
export interface CartComponent {
  getName(): string;
  getPrice(): number;
  getQuantity(): number;
  isComposite(): boolean;
}