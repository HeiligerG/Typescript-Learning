# TypeScript Learning

**Zentrale Projekt- und Lernsammlung für moderne TypeScript-Architekturen.**

Dieses Repository enthält eine wachsende Sammlung von praktischen TypeScript-Projekten, die auf realistischen Anforderungen basieren und fortgeschrittene Konzepte wie Design Patterns, Testing, Modulare Architektur und Clean Code demonstrieren.

## Ziel

Das Ziel dieses Repositories ist es, beim Erlernen und Anwenden von **modernen TypeScript-Techniken** zu unterstützen – sowohl für Eigenprojekte als auch zur Vorbereitung auf professionelle Softwareentwicklung (z. B. im Backend, Frontend oder bei Domain-getriebener Architektur).

Jedes Projekt innerhalb dieses Repositories ist isoliert nutzbar und dokumentiert.

---

## Projekte

### 1. [Cart Prototype](./cart-prototype)

Ein modularer Warenkorb-Prototyp mit den Design Patterns **Strategy** und **Composite**. Umfasst u. a.:

* Flexible Preisstrategien (Rabatte, MwSt, Bedingungen)
* Rekursive Bundle-Struktur
* Erweiterbares Architekturmodell
* TDD mit Jest
* Vollständiges Demo-Setup

→ [Zur Projekt-Dokumentation](./cart-prototype/README.md)

→ [Zur Architektur-Dokumentation](./cart-prototype/ARCHITECTURE.md)

---

## Voraussetzungen

* Node.js >= 18.x
* NPM, Yarn oder pnpm
* Grundlegende TypeScript-Kenntnisse

## Setup

```bash
# Repository klonen
git clone https://github.com/HeiligerG/typescript-learning.git
cd typescript-learning

# In ein Projekt wechseln
cd cart-prototype

# Setup & Test
npm install
npm test
```

---

## Struktur

Jedes Projekt liegt in einem eigenen Unterordner:

```
typescript-learning/
├── cart-prototype/
│   └── ...
├── nächstes-projekt/
│   └── ...
└── README.md
```

Neue Projekte können einfach als Unterverzeichnisse mit eigener `README.md` und Dokumentation hinzugefügt werden.

---

## Mitwirken

Dieses Repository dient in erster Linie der persönlichen Weiterbildung – Pull Requests sind willkommen, sollten aber sauber dokumentiert und begründet sein (z. B. Verbesserungsvorschläge, Bugfixes, zusätzliche Tests oder Architekturideen).

---

## Lizenz

GNU General Public License, Version 3 – siehe [LICENSE](./LICENSE).

---

## Kontakt

* GitHub Issues: [Projektseite](https://github.com/HeiligerG/cart-prototype/issues)
* E-Mail: [devholyg@gmail.com](mailto:devholyg@gmail.com)

---

**Hinweis:** Dieses Repository ist in kontinuierlicher Entwicklung und wächst mit jeder neuen Idee, Technik oder Architektur-Variante in TypeScript.
