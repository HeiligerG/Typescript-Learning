import { CartComponent, Customer, PriceModificationStrategy, PriceContext, CartItem } from './interfaces';
import { Bundle } from '../composite/cart-components';

export class Cart {
  private components: CartComponent[] = [];
  private priceStrategies: PriceModificationStrategy[] = [];

  constructor(private customer: Customer) {}

  // Cart Management
  addComponent(component: CartComponent): void {
    this.components.push(component);
  }

  removeComponent(component: CartComponent): void {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
    }
  }

  getComponents(): CartComponent[] {
    return [...this.components];
  }

  // Strategy Management
  addPriceStrategy(strategy: PriceModificationStrategy): void {
    this.priceStrategies.push(strategy);
  }

  clearStrategies(): void {
    this.priceStrategies = [];
  }

  // Price Calculation
  getSubtotal(): number {
    return this.components.reduce((total, component) => {
      return total + component.getPrice();
    }, 0);
  }

  calculateTotal(): number {
    let currentAmount = this.getSubtotal();
    const allItems = this.getAllCartItems();
    
    // Wende alle Strategien nacheinander an
    for (const strategy of this.priceStrategies) {
      const context: PriceContext = {
        customer: this.customer,
        cartItems: allItems,
        intermediateAmount: currentAmount
      };
      
      currentAmount = strategy.apply(currentAmount, context);
    }

    return Math.round(currentAmount * 100) / 100; // Runde auf 2 Dezimalstellen
  }

  // Hilfsmethode um alle Items aus allen Components zu extrahieren
  getAllCartItems(): CartItem[] {
    const items: CartItem[] = [];
    
    for (const component of this.components) {
      if (component instanceof Bundle) {
        items.push(...component.getAllItems());
      } else {
        // Für Product Components müssten wir das Item extrahieren
        // Da wir das Interface nicht ändern wollen, verwenden wir eine Workaround
        const productComponent = component as any;
        if (productComponent.getItem) {
          items.push(productComponent.getItem());
        }
      }
    }
    
    return items;
  }

  // Debug/Info Methoden
  getItemCount(): number {
    return this.components.reduce((count, component) => {
      return count + component.getQuantity();
    }, 0);
  }

  getAppliedStrategies(): string[] {
    return this.priceStrategies.map(strategy => strategy.getDescription());
  }

  // Bonus Points berechnen (falls implementiert)
  calculateBonusPoints(): number {
    const allItems = this.getAllCartItems();
    let bonusPoints = 0;
    
    allItems.forEach(item => {
      if (item.isEligibleForBonus) {
        bonusPoints += Math.floor(item.price * item.quantity); // 1 Punkt pro CHF
      }
    });

    // Geburtstags-Bonus: 10x Punkte
    if (this.customer.birthday && this.isBirthday(this.customer.birthday)) {
      bonusPoints *= 10;
    }

    return bonusPoints;
  }

  private isBirthday(birthday: Date): boolean {
    const today = new Date();
    return birthday.getMonth() === today.getMonth() && 
           birthday.getDate() === today.getDate();
  }
}