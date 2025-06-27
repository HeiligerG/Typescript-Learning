import { Cart } from '../src/models/cart';
import { Product, Bundle } from '../src/composite/cart-components';
import { NewCustomerDiscountStrategy, BirthdayDiscountStrategy, VATStrategy, VolumeDiscountStrategy } from '../src/strategies/price-strategies';
import { CartItem, Customer } from '../src/models/interfaces';

describe('Cart System Tests', () => {
  let customer: Customer;
  let cart: Cart;

  beforeEach(() => {
    customer = {
      id: 'customer1',
      email: 'test@test.com',
      isNewCustomer: false,
      bonusPoints: 0
    };
    cart = new Cart(customer);
  });

  describe('Basic Cart Operations', () => {
    test('should add products to cart', () => {
      const item: CartItem = {
        id: 'item1',
        name: 'Test Product',
        price: 100,
        quantity: 2
      };
      const product = new Product(item);
      
      cart.addComponent(product);
      
      expect(cart.getComponents()).toHaveLength(1);
      expect(cart.getSubtotal()).toBe(200);
    });

    test('should create and add bundles', () => {
      const item1: CartItem = { id: 'item1', name: 'Product 1', price: 50, quantity: 1 };
      const item2: CartItem = { id: 'item2', name: 'Product 2', price: 30, quantity: 1 };
      
      const bundle = new Bundle('Test Bundle', 1, 0.1); // 10% Bundle-Rabatt
      bundle.add(new Product(item1));
      bundle.add(new Product(item2));
      
      cart.addComponent(bundle);
      
      expect(cart.getSubtotal()).toBe(72); // (50 + 30) * 0.9
    });
  });

  describe('Strategy Pattern Tests', () => {
    test('should apply new customer discount', () => {
      customer.isNewCustomer = true;
      cart = new Cart(customer);
      
      const item: CartItem = {
        id: 'item1',
        name: 'Test Product',
        price: 100,
        quantity: 1,
        isSaleItem: false
      };
      cart.addComponent(new Product(item));
      cart.addPriceStrategy(new NewCustomerDiscountStrategy());
      
      const total = cart.calculateTotal();
      expect(total).toBe(95); // 100 - 5% = 95
    });

    test('should not apply new customer discount on sale items', () => {
      customer.isNewCustomer = true;
      cart = new Cart(customer);
      
      const item: CartItem = {
        id: 'item1',
        name: 'Sale Product',
        price: 100,
        quantity: 1,
        isSaleItem: true
      };
      cart.addComponent(new Product(item));
      cart.addPriceStrategy(new NewCustomerDiscountStrategy());
      
      const total = cart.calculateTotal();
      expect(total).toBe(100); // Kein Rabatt bei Sale-Artikeln
    });

    test('should apply birthday discount', () => {
      const today = new Date();
      customer.birthday = new Date(1990, today.getMonth(), today.getDate());
      customer.isNewCustomer = false;
      cart = new Cart(customer);
      
      const item: CartItem = {
        id: 'item1',
        name: 'Test Product',
        price: 100,
        quantity: 1,
        isSaleItem: false
      };
      cart.addComponent(new Product(item));
      cart.addPriceStrategy(new BirthdayDiscountStrategy());
      
      const total = cart.calculateTotal();
      expect(total).toBe(97); // 100 - 3% = 97
    });

    test('should apply VAT correctly', () => {
      const item: CartItem = {
        id: 'item1',
        name: 'Test Product',
        price: 100,
        quantity: 1
      };
      cart.addComponent(new Product(item));
      cart.addPriceStrategy(new VATStrategy());
      
      const total = cart.calculateTotal();
      expect(total).toBe(107.7); // 100 * 1.077
    });

    test('should apply multiple strategies in sequence', () => {
      customer.isNewCustomer = true;
      cart = new Cart(customer);
      
      const item: CartItem = {
        id: 'item1',
        name: 'Test Product',
        price: 100,
        quantity: 1,
        isSaleItem: false
      };
      cart.addComponent(new Product(item));
      cart.addPriceStrategy(new NewCustomerDiscountStrategy()); // -5% = 95
      cart.addPriceStrategy(new VATStrategy()); // +7.7% = 102.315
      
      const total = cart.calculateTotal();
      expect(total).toBe(102.32); // Gerundet
    });
  });

  describe('Composite Pattern Tests', () => {
    test('should handle nested bundles', () => {
      const item1: CartItem = { id: 'item1', name: 'Product 1', price: 10, quantity: 1 };
      const item2: CartItem = { id: 'item2', name: 'Product 2', price: 20, quantity: 1 };
      const item3: CartItem = { id: 'item3', name: 'Product 3', price: 30, quantity: 1 };
      
      const innerBundle = new Bundle('Inner Bundle', 1, 0.1); // 10% Rabatt
      innerBundle.add(new Product(item1));
      innerBundle.add(new Product(item2));
      
      const outerBundle = new Bundle('Outer Bundle', 1, 0.05); // 5% Rabatt
      outerBundle.add(innerBundle);
      outerBundle.add(new Product(item3));
      
      cart.addComponent(outerBundle);
      
      // Inner Bundle: (10 + 20) * 0.9 = 27
      // Outer Bundle: (27 + 30) * 0.95 = 54.15
      expect(cart.getSubtotal()).toBe(54.15);
    });
  });

  describe('Volume Discount Tests', () => {
    test('should apply volume discount for same items', () => {
      const item: CartItem = {
        id: 'item1',
        name: 'Test Product',
        price: 10,
        quantity: 15, // Qualifiziert für 5% Rabatt
        isSaleItem: false
      };
      cart.addComponent(new Product(item));
      cart.addPriceStrategy(new VolumeDiscountStrategy());
      
      const total = cart.calculateTotal();
      // 15 * 10 = 150, mit 5% Rabatt = 142.5
      expect(total).toBe(142.5);
    });
  });
});