import { CartComponent, CartItem } from '../models/interfaces';

// Leaf: Einzelner Artikel
export class Product implements CartComponent {
  constructor(
    private item: CartItem
  ) {}

  getName(): string {
    return this.item.name;
  }

  getPrice(): number {
    return this.item.price * this.item.quantity;
  }

  getQuantity(): number {
    return this.item.quantity;
  }

  isComposite(): boolean {
    return false;
  }

  getItem(): CartItem {
    return this.item;
  }
}

// Composite: Bundle das andere Components enthalten kann
export class Bundle implements CartComponent {
  private components: CartComponent[] = [];
  private bundleDiscount: number = 0; // Prozentsatz

  constructor(
    private name: string,
    private quantity: number = 1,
    bundleDiscount: number = 0
  ) {
    this.bundleDiscount = bundleDiscount;
  }

  add(component: CartComponent): void {
    this.components.push(component);
  }

  remove(component: CartComponent): void {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    let totalPrice = 0;
    
    // Summiere Preise aller enthaltenen Components
    for (const component of this.components) {
      totalPrice += component.getPrice();
    }

    // Wende Bundle-Rabatt an
    if (this.bundleDiscount > 0) {
      totalPrice *= (1 - this.bundleDiscount);
    }

    // Multipliziere mit Bundle-Quantität
    return totalPrice * this.quantity;
  }

  getQuantity(): number {
    return this.quantity;
  }

  isComposite(): boolean {
    return true;
  }

  getComponents(): CartComponent[] {
    return [...this.components];
  }

  getBundleDiscount(): number {
    return this.bundleDiscount;
  }

  // Hilfsmethode um alle einzelnen Items zu extrahieren (für Strategien)
  getAllItems(): CartItem[] {
    const items: CartItem[] = [];
    
    for (const component of this.components) {
      if (component instanceof Product) {
        items.push(component.getItem());
      } else if (component instanceof Bundle) {
        items.push(...component.getAllItems());
      }
    }
    
    return items;
  }
}