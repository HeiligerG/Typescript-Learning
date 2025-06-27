# Cart Prototype

Ein **TypeScript-Prototyp** für ein modulares Warenkorb-System mit den Design Patterns **Strategy** und **Composite**.

## Projektübersicht

Der Prototyp erfüllt zentrale Anforderungen aus typischen E-Commerce-Szenarien:

* Flexible Preisstrategien (Rabatte, MwSt, Bedingungen)
* Rekursives Bundle-System
* Test-Driven Development
* Erweiterbare, klar strukturierte Architektur

### Verwendete Design Patterns

| Pattern   | Einsatzgebiet                    | Vorteil                             |
| --------- | -------------------------------- | ----------------------------------- |
| Strategy  | Preisanpassungen (z. B. Rabatte) | Kombinierbar und leicht erweiterbar |
| Composite | Bundle-Strukturen                | Beliebige Verschachtelung möglich   |

## Quick Start

```bash
# Repository klonen
git clone https://github.com/HeiligerG/Typescript-Learning.git
cd cart-prototype

# Abhängigkeiten installieren
npm install

# Tests ausführen
npm test

# Beispiel-Demo starten
npm run dev

# Production Build
npm run build
```

## Features

### Preisstrategien (Strategy Pattern)

| Strategie          | Beschreibung              | Einschränkungen                    |
| ------------------ | ------------------------- | ---------------------------------- |
| Neukunden-Rabatt   | 5 % Rabatt (max. 100 CHF) | Nicht auf Sale-Artikel             |
| Geburtstags-Rabatt | 3 % Rabatt                | Nur Bestandskunden, nicht auf Sale |
| Mengenrabatt       | 5–20 % abhängig von Menge | Auch auf Sale-Artikel anwendbar    |
| Mehrwertsteuer     | 7.7 % (CH)                | Immer anwendbar                    |

### Bundle-System (Composite Pattern)

* Bundles können Produkte oder andere Bundles enthalten
* Rabatte gelten je Bundle-Ebene
* Automatische, rekursive Preisberechnung
* Flexible Kombinationsmöglichkeiten

## Projektstruktur

```
cart-prototype/
├── src/
│   ├── models/
│   │   ├── interfaces.ts
│   │   └── cart.ts
│   ├── strategies/
│   │   └── price-strategies.ts
│   ├── composite/
│   │   └── cart-components.ts
│   └── example.ts
├── tests/
│   ├── cart.test.ts
│   └── tsconfig.json
├── tsconfig.json
├── jest.config.js
└── package.json
```

## Testing

Das Projekt verwendet **Jest** mit vollständiger **TypeScript-Unterstützung**.

```bash
# Tests ausführen
npm test

# Watch-Modus
npm run test:watch

# Coverage Report
npm run test:coverage
```

### Testabdeckung

* Basisfunktionen des Warenkorbs
* Preisstrategien inkl. Kombinationen
* Bundle-Verschachtelung
* Edge Cases: Sale-Artikel, Geburtstagskunden, Neukunden

## Code-Beispiele

### Einfacher Warenkorb mit Rabatt & Steuer

```ts
const cart = new Cart(customer);
cart.addComponent(new Product({ name: 'Gaming Laptop', price: 1500, quantity: 1 }));

cart.addPriceStrategy(new NewCustomerDiscountStrategy());
cart.addPriceStrategy(new VATStrategy());

console.log('Endpreis:', cart.calculateTotal());
```

### Verschachtelte Bundles

```ts
const gamingBundle = new Bundle('Gaming-Set', 1, 0.15);
gamingBundle.add(new Product({ name: 'Maus', price: 80, quantity: 1 }));
gamingBundle.add(new Product({ name: 'Tastatur', price: 120, quantity: 1 }));

const cableBundle = new Bundle('Kabel-Set', 1, 0.1);
cableBundle.add(new Product({ name: 'HDMI Kabel', price: 25, quantity: 2 }));

gamingBundle.add(cableBundle);
cart.addComponent(gamingBundle);
```

### Eigene Strategie erstellen

```ts
export class StudentDiscountStrategy implements PriceModificationStrategy {
  apply(amount: number, context: PriceContext): number {
    return context.customer.isStudent ? amount * 0.9 : amount;
  }

  getDescription(): string {
    return 'Studenten-Rabatt (10 %)';
  }
}
```

## User Story Mapping

| User Story                       | Implementierung               | Status |
| -------------------------------- | ----------------------------- | ------ |
| Neukunden-Rabatt (max. 100 CHF)  | `NewCustomerDiscountStrategy` | ✅      |
| Geburtstags-Bonus (3 % + Punkte) | `BirthdayDiscountStrategy`    | ✅      |
| Mengenrabatt                     | `VolumeDiscountStrategy`      | ✅      |
| Bonuspunkte-System               | `Cart.calculateBonusPoints()` | ✅      |
| Sale-Ausschlüsse                 | `CartItem.isSaleItem`         | ✅      |
| Rekursive Bundle-Struktur        | `Bundle` (Composite Pattern)  | ✅      |

## Erweiterungsideen

### Eigene Komponenten (z. B. digitale Produkte)

```ts
export class DigitalProduct implements CartComponent {
  constructor(private item: DigitalItem) {}
  getName() { return this.item.name; }
  getPrice() { return this.item.price; }
  isComposite() { return false; }
  getDownloadLink() { return this.item.downloadUrl; }
}
```

## Bekannte Einschränkungen

| Einschränkung           | Workaround / Lösungsidee          | Priorität |
| ----------------------- | --------------------------------- | --------- |
| Keine Persistierung     | In-Memory, keine Datenbank        | Mittel    |
| Bundle-Rabatte isoliert | Keine bereichsübergreifende Logik | Niedrig   |
| Kein Multi-Currency     | Nur CHF unterstützt               | Mittel    |

## Roadmap

* [ ] Persistenzebene (Datenbank/Redis)
* [ ] REST-API mit Express
* [ ] Authentifizierung (z. B. via JWT)
* [ ] Frontend-Anbindung (React/Vue)
* [ ] Analytics / Reporting
* [ ] Mehrwährungsfähigkeit
* [ ] Multi-Tenant-Unterstützung

## Mitwirken

```bash
git clone <your-fork>
cd cart-prototype
git checkout -b feature/feature-name
# Änderungen vornehmen
npm test
git commit -m "Implement feature"
git push origin feature/feature-name
```

## Lizenz

GNU General Public License, Version 3 – siehe [LICENSE](../LICENSE).

## Kontakt

* GitHub Issues: [Projektseite](https://github.com/HeiligerG/Typescript-Learning/issues)
* E-Mail: [your.email@domain.com](mailto:devholyg@gmail.com)

---

**Hinweis:** Dieser Prototyp dient als technische Referenz für moderne Architekturentscheidungen in TypeScript-Projekten.