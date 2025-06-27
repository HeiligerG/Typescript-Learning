import { Cart } from './models/cart';
import { Product, Bundle } from './composite/cart-components';
import { 
  NewCustomerDiscountStrategy, 
  BirthdayDiscountStrategy, 
  VATStrategy,
  VolumeDiscountStrategy 
} from './strategies/price-strategies';
import { CartItem, Customer } from './models/interfaces';

// Demo des Warenkorb-Prototyps
console.log('=== Warenkorb-Prototyp Demo ===\n');

// 1. Kunde erstellen
const customer: Customer = {
  id: 'cust001',
  email: 'max.mustermann@email.com',
  isNewCustomer: true,
  birthday: new Date(1990, new Date().getMonth(), new Date().getDate()), // Heute Geburtstag
  bonusPoints: 150
};

console.log('Kunde:', customer.email);
console.log('Neukunde:', customer.isNewCustomer);
console.log('Hat heute Geburtstag:', customer.birthday ? 'Ja' : 'Nein');
console.log();

// 2. Warenkorb erstellen
const cart = new Cart(customer);

// 3. Einzelne Produkte hinzufügen
const laptop: CartItem = {
  id: 'laptop001',
  name: 'Gaming Laptop',
  price: 1500,
  quantity: 1,
  isSaleItem: false,
  isEligibleForBonus: true
};

const mouse: CartItem = {
  id: 'mouse001',
  name: 'Gaming Maus',
  price: 80,
  quantity: 2,
  isSaleItem: false,
  isEligibleForBonus: true
};

const saleItem: CartItem = {
  id: 'keyboard001',
  name: 'Tastatur (Sale)',
  price: 120,
  quantity: 1,
  isSaleItem: true,
  isEligibleForBonus: false
};

cart.addComponent(new Product(laptop));
cart.addComponent(new Product(mouse));
cart.addComponent(new Product(saleItem));

// 4. Bundle erstellen (Composite Pattern Demo)
const accessoryBundle = new Bundle('Zubehör-Bundle', 1, 0.15); // 15% Bundle-Rabatt

const headset: CartItem = {
  id: 'headset001',
  name: 'Gaming Headset',
  price: 200,
  quantity: 1,
  isEligibleForBonus: true
};

const webcam: CartItem = {
  id: 'webcam001',
  name: 'HD Webcam',
  price: 150,
  quantity: 1,
  isEligibleForBonus: true
};

accessoryBundle.add(new Product(headset));
accessoryBundle.add(new Product(webcam));

// Verschachteltes Bundle (Bundle in Bundle)
const cableBundle = new Bundle('Kabel-Set', 1, 0.1); // 10% Rabatt
const hdmiCable: CartItem = {
  id: 'hdmi001',
  name: 'HDMI Kabel',
  price: 25,
  quantity: 2
};
const usbCable: CartItem = {
  id: 'usb001',
  name: 'USB Kabel',
  price: 15,
  quantity: 3
};

cableBundle.add(new Product(hdmiCable));
cableBundle.add(new Product(usbCable));

accessoryBundle.add(cableBundle); // Bundle in Bundle

cart.addComponent(accessoryBundle);

console.log('=== Warenkorb Inhalt ===');
console.log('Artikel-Anzahl:', cart.getItemCount());
console.log('Zwischensumme:', cart.getSubtotal().toFixed(2), 'CHF');
console.log();

// 5. Strategien anwenden (Strategy Pattern Demo)
console.log('=== Preis-Strategien anwenden ===');

// Neukunden-Rabatt (nur wenn nicht Sale-Artikel betroffen)
cart.addPriceStrategy(new NewCustomerDiscountStrategy());

// Geburtstags-Rabatt (falls heute Geburtstag)
cart.addPriceStrategy(new BirthdayDiscountStrategy());

// Mengenrabatt
cart.addPriceStrategy(new VolumeDiscountStrategy());

// MwSt am Ende
cart.addPriceStrategy(new VATStrategy());

console.log('Angewendete Strategien:');
cart.getAppliedStrategies().forEach((strategy, index) => {
  console.log(`${index + 1}. ${strategy}`);
});
console.log();

// 6. Endergebnis
const finalTotal = cart.calculateTotal();
const bonusPoints = cart.calculateBonusPoints();

console.log('=== Endergebnis ===');
console.log('Zwischensumme:', cart.getSubtotal().toFixed(2), 'CHF');
console.log('Endpreis (nach allen Rabatten/MwSt):', finalTotal.toFixed(2), 'CHF');
console.log('Erhaltene Bonuspunkte:', bonusPoints);
console.log();

// 7. Demo verschiedener Szenarien
console.log('=== Alternative Szenarien ===');

// Szenario: Bestandskunde ohne Geburtstag
const existingCustomer: Customer = {
  ...customer,
  isNewCustomer: false,
  birthday: undefined
};

const cart2 = new Cart(existingCustomer);
cart2.addComponent(new Product(laptop));
cart2.addPriceStrategy(new NewCustomerDiscountStrategy());
cart2.addPriceStrategy(new BirthdayDiscountStrategy());
cart2.addPriceStrategy(new VATStrategy());

console.log('Bestandskunde ohne Geburtstag:');
console.log('Zwischensumme:', cart2.getSubtotal().toFixed(2), 'CHF');
console.log('Endpreis:', cart2.calculateTotal().toFixed(2), 'CHF');