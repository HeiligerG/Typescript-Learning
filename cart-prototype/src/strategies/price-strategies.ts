import { PriceModificationStrategy, PriceContext } from '../models/interfaces';

// Neukunden-Rabatt Strategy
export class NewCustomerDiscountStrategy implements PriceModificationStrategy {
  private readonly discountPercentage = 0.05; // 5%
  private readonly maxDiscount = 100; // 100 CHF

  apply(amount: number, context: PriceContext): number {
    if (!context.customer.isNewCustomer) {
      return amount;
    }

    // Prüfen ob Sale-Artikel im Warenkorb sind
    const hasSaleItems = context.cartItems.some(item => item.isSaleItem);
    if (hasSaleItems) {
      return amount; // Kein Rabatt bei Sale-Artikeln
    }

    const discount = Math.min(amount * this.discountPercentage, this.maxDiscount);
    return amount - discount;
  }

  getDescription(): string {
    return `Neukunden-Rabatt (${this.discountPercentage * 100}%, max ${this.maxDiscount} CHF)`;
  }
}

// Geburtstags-Rabatt Strategy
export class BirthdayDiscountStrategy implements PriceModificationStrategy {
  private readonly discountPercentage = 0.03; // 3%

  apply(amount: number, context: PriceContext): number {
    if (!context.customer.birthday || !this.isBirthday(context.customer.birthday)) {
      return amount;
    }

    if (context.customer.isNewCustomer) {
      return amount; // Gilt nicht für Neukunden bei erster Bestellung
    }

    // Prüfen ob Sale-Artikel im Warenkorb sind
    const hasSaleItems = context.cartItems.some(item => item.isSaleItem);
    if (hasSaleItems) {
      return amount; // Kein Rabatt bei Sale-Artikeln
    }

    const discount = amount * this.discountPercentage;
    return amount - discount;
  }

  private isBirthday(birthday: Date): boolean {
    const today = new Date();
    return birthday.getMonth() === today.getMonth() && 
           birthday.getDate() === today.getDate();
  }

  getDescription(): string {
    return `Geburtstags-Rabatt (${this.discountPercentage * 100}%)`;
  }
}

// Mehrwertsteuer Strategy
export class VATStrategy implements PriceModificationStrategy {
  private readonly vatRate = 0.077; // 7.7% MwSt in der Schweiz

  apply(amount: number, context: PriceContext): number {
    return amount * (1 + this.vatRate);
  }

  getDescription(): string {
    return `Mehrwertsteuer (${this.vatRate * 100}%)`;
  }
}

// Mengenrabatt Strategy
export class VolumeDiscountStrategy implements PriceModificationStrategy {
  private discountTiers: { minQuantity: number; discountPercentage: number }[] = [
    { minQuantity: 10, discountPercentage: 0.05 }, // 5% ab 10 Stück
    { minQuantity: 20, discountPercentage: 0.10 }, // 10% ab 20 Stück
    { minQuantity: 50, discountPercentage: 0.20 }  // 20% ab 50 Stück
  ];

  apply(amount: number, context: PriceContext): number {
    // Gruppiere Artikel nach ID und summiere Mengen
    const itemQuantities = new Map<string, number>();
    context.cartItems.forEach(item => {
      const currentQuantity = itemQuantities.get(item.id) || 0;
      itemQuantities.set(item.id, currentQuantity + item.quantity);
    });

    let totalDiscount = 0;
    itemQuantities.forEach((quantity, itemId) => {
      const item = context.cartItems.find(i => i.id === itemId);
      if (!item) return;

      const applicableDiscount = this.getDiscountForQuantity(quantity);
      if (applicableDiscount > 0) {
        const itemTotal = item.price * quantity;
        totalDiscount += itemTotal * applicableDiscount;
      }
    });

    return amount - totalDiscount;
  }

  private getDiscountForQuantity(quantity: number): number {
    // Finde höchsten anwendbaren Rabatt
    let applicableDiscount = 0;
    for (const tier of this.discountTiers) {
      if (quantity >= tier.minQuantity) {
        applicableDiscount = tier.discountPercentage;
      }
    }
    return applicableDiscount;
  }

  getDescription(): string {
    return `Mengenrabatt (bis zu ${Math.max(...this.discountTiers.map(t => t.discountPercentage)) * 100}%)`;
  }
}