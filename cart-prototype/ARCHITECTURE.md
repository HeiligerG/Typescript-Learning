# 🏗️ Architecture Documentation

## Cart Prototype Design Patterns & Architecture

### 📋 Table of Contents

1. [Design Patterns Overview](#-design-patterns-overview)
2. [Strategy Pattern Deep Dive](#-strategy-pattern-deep-dive)
3. [Composite Pattern Deep Dive](#-composite-pattern-deep-dive)
4. [Models & Interfaces Architecture](#-models--interfaces-architecture)
5. [Pattern Comparison](#-pattern-comparison)
6. [Implementation Details](#-implementation-details)
7. [Best Practices](#-best-practices)

---

## 🎯 Design Patterns Overview

This project implements **two fundamental design patterns** to solve different architectural challenges:

| Pattern | Purpose | Problem Solved | Implementation |
|---------|---------|----------------|----------------|
| **Strategy** | Behavioral | Multiple algorithms for pricing | `PriceModificationStrategy` |
| **Composite** | Structural | Hierarchical product structures | `CartComponent` hierarchy |

### 🎪 Why These Patterns?

```
Business Requirements → Design Challenges → Pattern Solutions
      ↓                       ↓                    ↓
• Flexible pricing      • Multiple discount      Strategy Pattern
• Bundle structures     • Tree-like hierarchy    Composite Pattern
• Easy extension       • Polymorphic behavior    Interface Design
```

---

## 🎯 Strategy Pattern Deep Dive

### 📝 Definition
> **Strategy Pattern** allows you to define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.

### 🔍 Problem Statement
```typescript
// ❌ Without Strategy Pattern (Bad!)
class Cart {
  calculateTotal() {
    let total = this.subtotal;
    
    // Rigid, hard to extend
    if (this.customer.isNewCustomer) {
      total *= 0.95; // 5% discount
    }
    if (this.customer.hasBirthday) {
      total *= 0.97; // 3% discount  
    }
    if (this.quantity > 10) {
      total *= 0.90; // Volume discount
    }
    
    total *= 1.077; // VAT
    return total;
  }
}
```

**Problems:**
- ❌ Hard to add new discount types
- ❌ Difficult to test individual strategies  
- ❌ Violates Open/Closed Principle
- ❌ Cannot combine strategies flexibly

### ✅ Solution with Strategy Pattern

```typescript
// ✅ With Strategy Pattern (Good!)
interface PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number;
  getDescription(): string;
}

class Cart {
  private strategies: PriceModificationStrategy[] = [];
  
  addPriceStrategy(strategy: PriceModificationStrategy) {
    this.strategies.push(strategy);
  }
  
  calculateTotal(): number {
    return this.strategies.reduce((amount, strategy) => {
      return strategy.apply(amount, this.getPriceContext());
    }, this.getSubtotal());
  }
}
```

### 🏗️ Strategy Pattern Structure

```
PriceModificationStrategy (Interface)
├── NewCustomerDiscountStrategy
├── BirthdayDiscountStrategy  
├── VolumeDiscountStrategy
├── VATStrategy
└── [Future strategies...]
```

### 💡 Strategy Pattern Benefits

| Benefit | Description | Example |
|---------|-------------|---------|
| **Flexibility** | Swap algorithms at runtime | Change discount rules per customer |
| **Extensibility** | Add new strategies without changing existing code | Add student discount |
| **Testability** | Test each strategy in isolation | Unit test each discount type |
| **Composition** | Combine multiple strategies | Apply multiple discounts |

### 🎮 Strategy Pattern Example

```typescript
// Define strategy
class StudentDiscountStrategy implements PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number {
    if (context.customer.isStudent) {
      return amount * 0.85; // 15% student discount
    }
    return amount;
  }
  
  getDescription(): string {
    return "Student Discount (15%)";
  }
}

// Use strategy
cart.addPriceStrategy(new StudentDiscountStrategy());
cart.addPriceStrategy(new VATStrategy());
// Strategies applied in order: Student → VAT
```

---

## 🌳 Composite Pattern Deep Dive

### 📝 Definition
> **Composite Pattern** allows you to compose objects into tree structures to represent part-whole hierarchies. It lets clients treat individual objects and compositions uniformly.

### 🔍 Problem Statement

```typescript
// ❌ Without Composite Pattern (Bad!)
class Cart {
  private products: Product[] = [];
  private bundles: Bundle[] = [];
  
  calculateTotal(): number {
    let total = 0;
    
    // Different handling for each type!
    for (const product of this.products) {
      total += product.price * product.quantity;
    }
    
    for (const bundle of this.bundles) {
      let bundleTotal = 0;
      for (const item of bundle.items) {
        bundleTotal += item.price * item.quantity;
      }
      total += bundleTotal * (1 - bundle.discount);
    }
    
    return total;
  }
}
```

**Problems:**
- ❌ Cannot nest bundles within bundles
- ❌ Different code paths for products vs bundles
- ❌ Hard to add new component types
- ❌ Complex tree traversal logic

### ✅ Solution with Composite Pattern

```typescript
// ✅ With Composite Pattern (Good!)
interface CartComponent {
  getName(): string;
  getPrice(): number;
  isComposite(): boolean;
}

class Product implements CartComponent {
  getPrice(): number { return this.item.price * this.item.quantity; }
  isComposite(): boolean { return false; }
}

class Bundle implements CartComponent {
  private children: CartComponent[] = [];
  
  add(component: CartComponent) {
    this.children.push(component);
  }
  
  getPrice(): number {
    const subtotal = this.children.reduce((sum, child) => 
      sum + child.getPrice(), 0
    );
    return subtotal * (1 - this.discount);
  }
  
  isComposite(): boolean { return true; }
}
```

### 🏗️ Composite Pattern Structure

```
CartComponent (Interface)
├── Product (Leaf)
│   └── item: CartItem
└── Bundle (Composite)
    ├── children: CartComponent[]
    ├── discount: number
    └── Methods:
        ├── add(component)
        ├── remove(component)  
        └── getPrice() → Recursive!
```

### 🌲 Tree Structure Example

```
Gaming Bundle (15% discount)
├── Gaming Mouse ($80)
├── Gaming Keyboard ($120)  
└── Cable Bundle (10% discount)
    ├── HDMI Cable × 2 ($25 each)
    ├── USB Cable ($15)
    └── Power Cable ($10)
```

**Calculation Flow:**
```typescript
// Recursive calculation:
Cable Bundle: (25×2 + 15 + 10) × 0.9 = 76.5
Gaming Bundle: (80 + 120 + 76.5) × 0.85 = 235.025
```

### 💡 Composite Pattern Benefits

| Benefit | Description | Example |
|---------|-------------|---------|
| **Uniformity** | Treat all components the same | `component.getPrice()` works for all |
| **Recursion** | Natural tree traversal | Nested bundles handled automatically |
| **Flexibility** | Easy to add new component types | Subscription, DigitalProduct, etc. |
| **Scalability** | Supports arbitrary nesting depth | Bundle → Bundle → Bundle → Product |

### 🎮 Composite Pattern Example

```typescript
// Create nested structure
const gamingSetup = new Bundle('Gaming Setup', 1, 0.2); // 20% off

// Add direct products
gamingSetup.add(new Product({
  id: 'monitor', name: '4K Monitor', price: 500, quantity: 1
}));

// Add nested bundle
const peripheralsBundle = new Bundle('Peripherals', 1, 0.1); // 10% off
peripheralsBundle.add(new Product({
  id: 'mouse', name: 'Gaming Mouse', price: 80, quantity: 1
}));
peripheralsBundle.add(new Product({
  id: 'keyboard', name: 'Mechanical Keyboard', price: 150, quantity: 1
}));

gamingSetup.add(peripheralsBundle); // Bundle within bundle!

// Calculate: ((80 + 150) * 0.9 + 500) * 0.8 = 584
console.log(gamingSetup.getPrice()); // 584
```

---

## 🏛️ Models & Interfaces Architecture

### 📁 Project Structure Deep Dive

```
src/
├── 📁 models/
│   ├── interfaces.ts     # 🔗 Core contracts & types
│   └── cart.ts          # 🛒 Main business logic
├── 📁 strategies/  
│   └── price-strategies.ts # 🎯 Strategy implementations
├── 📁 composite/
│   └── cart-components.ts  # 🌳 Composite implementations
└── example.ts           # 🎮 Usage demonstration
```

### 🔗 Interfaces Layer (`models/interfaces.ts`)

**Purpose:** Define contracts and ensure type safety

```typescript
// Core business entities
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isSaleItem?: boolean;
}

interface Customer {
  id: string;
  email: string;
  isNewCustomer: boolean;
  birthday?: Date;
  bonusPoints: number;
}

// Pattern interfaces
interface PriceModificationStrategy { /* ... */ }
interface CartComponent { /* ... */ }
```

**Why Interfaces?**
- ✅ **Contract Definition**: Clear API expectations
- ✅ **Type Safety**: Compile-time error checking  
- ✅ **Decoupling**: Implementation independent
- ✅ **Testing**: Easy to mock/stub
- ✅ **Documentation**: Self-documenting code

### 🛒 Models Layer (`models/cart.ts`)

**Purpose:** Core business logic and orchestration

```typescript
class Cart {
  // Business logic
  private components: CartComponent[] = [];
  private strategies: PriceModificationStrategy[] = [];
  
  // Orchestration methods
  addComponent(component: CartComponent): void
  addPriceStrategy(strategy: PriceModificationStrategy): void
  calculateTotal(): number
  calculateBonusPoints(): number
}
```

**Responsibilities:**
- 🎼 **Orchestration**: Coordinates patterns
- 📊 **Business Logic**: Core calculations
- 🔄 **State Management**: Manages cart state
- 🎯 **Strategy Execution**: Applies pricing strategies
- 🌳 **Composite Management**: Handles component hierarchy

### 🎯 Strategies Layer (`strategies/price-strategies.ts`)

**Purpose:** Implement pricing algorithms

```typescript
// Each strategy is focused and testable
class NewCustomerDiscountStrategy implements PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number {
    // Single responsibility: new customer logic
  }
}
```

**Benefits:**
- 🎯 **Single Responsibility**: One strategy, one concern
- 🧪 **Testable**: Isolated unit testing
- 🔄 **Reusable**: Use in different contexts
- 📈 **Extensible**: Add strategies without modification

### 🌳 Composite Layer (`composite/cart-components.ts`)

**Purpose:** Implement hierarchical structures

```typescript
// Uniform interface for all cart items
abstract class CartComponent {
  abstract getName(): string;
  abstract getPrice(): number;
  abstract isComposite(): boolean;
}

class Product extends CartComponent { /* Leaf implementation */ }
class Bundle extends CartComponent { /* Composite implementation */ }
```

**Benefits:**
- 🔗 **Polymorphism**: Same interface, different behavior
- 🌲 **Recursion**: Natural tree operations
- 📦 **Encapsulation**: Hide complexity
- 🎭 **Abstraction**: Hide implementation details

---

## ⚖️ Pattern Comparison

### 🆚 Strategy vs Composite

| Aspect | Strategy Pattern | Composite Pattern |
|--------|------------------|-------------------|
| **Type** | Behavioral | Structural |
| **Purpose** | Algorithm selection | Object composition |
| **Structure** | Flat (strategies list) | Hierarchical (tree) |
| **Runtime** | Switch algorithms | Traverse structure |
| **Example** | Different pricing rules | Nested bundles |

### 🎯 When to Use Which?

```typescript
// ✅ Use Strategy when:
// - Multiple ways to do the same thing
// - Need to switch algorithms at runtime
// - Want to combine multiple behaviors

cart.addPriceStrategy(new StudentDiscount());
cart.addPriceStrategy(new VolumeDiscount());
cart.addPriceStrategy(new VAT());

// ✅ Use Composite when:  
// - Part-whole hierarchies
// - Tree-like structures
// - Uniform treatment of objects

const bundle = new Bundle('Gaming', 1, 0.1);
bundle.add(new Product(mouse));
bundle.add(new Bundle('Cables', 1, 0.05)); // Recursive!
```

### 🤝 How They Work Together

```typescript
class Cart {
  // Composite: Manages hierarchical structure
  private components: CartComponent[] = [];
  
  // Strategy: Applies pricing algorithms  
  private strategies: PriceModificationStrategy[] = [];
  
  calculateTotal(): number {
    // 1. Composite calculates subtotal from tree structure
    const subtotal = this.components.reduce((sum, component) => 
      sum + component.getPrice(), 0
    );
    
    // 2. Strategy applies pricing algorithms sequentially
    return this.strategies.reduce((amount, strategy) => 
      strategy.apply(amount, this.getPriceContext()), subtotal
    );
  }
}
```

---

## 🔧 Implementation Details

### 🏗️ Dependency Flow

```
User Input
    ↓
Cart (Orchestrator)
    ↓                    ↓
CartComponent        PriceStrategy
(Composite)          (Strategy)
    ↓                    ↓
Product/Bundle       Discount/VAT
```

### 🔄 Data Flow

```
1. Add Products/Bundles → Composite Structure
2. Calculate Subtotal → Tree Traversal  
3. Apply Strategies → Sequential Processing
4. Return Final Price → Aggregated Result
```

### 🧩 Interface Contracts

```typescript
// Composite Contract
interface CartComponent {
  getName(): string;    // Identity
  getPrice(): number;   // Value calculation
  isComposite(): boolean; // Type information
}

// Strategy Contract  
interface PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number; // Transform
  getDescription(): string; // Documentation
}
```

### 🎯 Context Objects

```typescript
interface PriceContext {
  customer: Customer;        // Who is buying
  cartItems: CartItem[];     // What they're buying
  currentDate: Date;         // When they're buying
  totalQuantity: number;     // How much they're buying
}
```

---

## 🎓 Best Practices

### ✅ Do's

#### Strategy Pattern
```typescript
// ✅ Keep strategies stateless
class VATStrategy implements PriceModificationStrategy {
  private static readonly VAT_RATE = 0.077;
  
  apply(amount: number): number {
    return amount * (1 + VATStrategy.VAT_RATE);
  }
}

// ✅ Make strategies composable
cart.addPriceStrategy(new NewCustomerDiscount());
cart.addPriceStrategy(new BirthdayDiscount());
cart.addPriceStrategy(new VAT());

// ✅ Provide clear descriptions
getDescription(): string {
  return "New Customer Discount (5%, max 100 CHF)";
}
```

#### Composite Pattern
```typescript
// ✅ Use recursive methods
getPrice(): number {
  const subtotal = this.children.reduce((sum, child) => 
    sum + child.getPrice(), 0  // Recursive call!
  );
  return subtotal * (1 - this.discount);
}

// ✅ Implement uniform interface
class DigitalProduct implements CartComponent {
  getPrice(): number { return this.price; } // Same interface
  getName(): string { return this.name; }   // Same interface
  isComposite(): boolean { return false; }  // Same interface
}
```

### ❌ Don'ts

```typescript
// ❌ Don't create god objects
class MegaStrategy implements PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number {
    // Handles discounts, VAT, shipping, loyalty points...
    // TOO MUCH RESPONSIBILITY!
  }
}

// ❌ Don't break the composite interface
class SpecialBundle extends Bundle {
  getPrice(): number {
    // Don't add special cases that break polymorphism
    if (this.isSpecialCase) {
      return this.specialCalculation(); // ❌ Breaks uniformity
    }
    return super.getPrice();
  }
}

// ❌ Don't hardcode strategy order
class Cart {
  calculateTotal(): number {
    let total = this.subtotal;
    total = new NewCustomerDiscount().apply(total, context);
    total = new VAT().apply(total, context);
    // ❌ Hardcoded order, not flexible
    return total;
  }
}
```

### 🧪 Testing Strategies

```typescript
// ✅ Test strategies in isolation
describe('NewCustomerDiscountStrategy', () => {
  it('applies 5% discount for new customers', () => {
    const strategy = new NewCustomerDiscountStrategy();
    const context = { 
      customer: { isNewCustomer: true },
      // ... other context
    };
    
    expect(strategy.apply(100, context)).toBe(95);
  });
});

// ✅ Test composite recursion
describe('Bundle', () => {
  it('calculates nested bundle prices correctly', () => {
    const parentBundle = new Bundle('Parent', 1, 0.1);
    const childBundle = new Bundle('Child', 1, 0.2);
    childBundle.add(new Product({ price: 100 }));
    parentBundle.add(childBundle);
    
    // Child: 100 * 0.8 = 80
    // Parent: 80 * 0.9 = 72
    expect(parentBundle.getPrice()).toBe(72);
  });
});
```

### 🚀 Performance Considerations

```typescript
// ✅ Cache expensive calculations
class Bundle implements CartComponent {
  private cachedPrice?: number;
  private isDirty = true;
  
  getPrice(): number {
    if (this.isDirty || this.cachedPrice === undefined) {
      this.cachedPrice = this.calculatePrice();
      this.isDirty = false;
    }
    return this.cachedPrice;
  }
  
  add(component: CartComponent): void {
    this.children.push(component);
    this.isDirty = true; // Invalidate cache
  }
}
```

---

## 🎯 Conclusion

### 🏆 What We Achieved

1. **Flexible Pricing** through Strategy Pattern
2. **Hierarchical Structures** through Composite Pattern  
3. **Clean Architecture** with proper separation of concerns
4. **Type Safety** with TypeScript interfaces
5. **Testable Code** with isolated components
6. **Extensible Design** for future requirements

### 🚀 Benefits Summary

| Benefit | Strategy Pattern | Composite Pattern | Combined |
|---------|------------------|-------------------|----------|
| **Flexibility** | ✅ Swap algorithms | ✅ Restructure trees | ✅ Adapt to business changes |
| **Maintainability** | ✅ Isolated strategies | ✅ Uniform interface | ✅ Clear responsibilities |
| **Testability** | ✅ Unit test each strategy | ✅ Test tree operations | ✅ Comprehensive coverage |
| **Extensibility** | ✅ Add new strategies | ✅ Add new component types | ✅ Future-proof architecture |

### 🎪 The Big Picture

```
Business Problem: "Flexible shopping cart with complex pricing and bundling"
        ↓
Architecture Solution: "Strategy + Composite + TypeScript Interfaces"
        ↓
Implementation: "Clean, testable, maintainable code"
        ↓  
Result: "Extensible system that adapts to changing requirements"
```

This architecture provides a **solid foundation** for building complex e-commerce systems while maintaining **code quality** and **development velocity**.

---

*This documentation serves as a reference for understanding the design decisions and architectural patterns used in the Cart Prototype project.*