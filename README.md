# NovoMart Products & Inventory

A SAPUI5 freestyle application for managing products and inventory for **NovoMart Distributors**.

This project is developed as an SAPUI5 training/capstone application following the requirements of the **Product Inventory & Order Management Portal** assignment.

The application is designed as a client-side prototype using a local JSON model. No backend or OData service is required.

---

## Overview

NovoMart Distributors requires an internal portal for warehouse and procurement staff to:

* Browse the product catalog
* Inspect product stock levels
* Search and filter products
* View product details
* Add products
* Edit products
* Raise stock reorder requests
* Receive clear UI feedback

---

## Technology Stack

* **SAPUI5 / OpenUI5**
* **SAP Fiori Tools**
* **SAP Business Application Studio (BAS)**
* **JavaScript**
* **XML Views**
* **JSON Model**
* **SAP Horizon Theme**
* **ESLint**
* **UI5 Tooling / UI5 CLI**

The repository was generated using the SAP Fiori Application Generator in SAP Business Application Studio. The generated project uses UI5 **1.150.1**, the `sap_horizon` theme, and does not use a backend service.

---

## Prerequisites

Before running the project, install or have access to:

* SAP Business Application Studio
* Node.js LTS
* npm

The repository's generated project configuration expects an active Node.js LTS installation.

---

## Running the Application

### 1. Clone the repository

```bash
git clone https://github.com/Atharv-A2/NovoMart-Products-Inventory.git
```

### 2. Open the project in SAP Business Application Studio

Import or clone the repository into your BAS workspace.

Open a terminal at the project root.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the UI5 application

```bash
"npm start" or "ui5 serve"
```

The generated SAP Fiori project is configured to start through the standard UI5 tooling command.

---

## Project Structure

The project follows the standard SAPUI5 application structure.

```text
NovoMart-Products-Inventory/
│
├── .vscode/
│
├── webapp/
│   ├── Component.js
│   ├── manifest.json
│   ├── index.html
│   │
│   ├── controller/
│   │
│   ├── view/
│   │
│   ├── fragment/
│   │
│   ├── model/
│   │
│   ├── i18n/
│   │
│   └── css/
│
├── .appGenInfo.json
├── .gitignore
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── ui5-local.yaml
├── ui5.yaml
└── README.md
```

The repository currently contains the generated `webapp` application directory together with UI5 configuration, npm configuration, ESLint configuration and application-generator metadata.

---

# Application Features

The target application is based on the following functional areas.

## Product List

The product list is intended to provide:

* Product name
* Category
* Price
* Stock status
* Product search
* Client-side filtering
* Sorting
* Grouping
* Product count
* Navigation to product details

Stock status is expected to be derived from stock quantity:

| Condition                   | Status       |
| --------------------------- | ------------ |
| `stock === 0`               | Out of Stock |
| `stock <= reorderThreshold` | Low Stock    |
| Otherwise                   | Available    |

---

## Product Detail

The detail page is intended to display:

* Product name
* Category
* Price
* Description
* Supplier
* SKU
* Warehouse
* Stock quantity
* Product image, when available

The detail page should obtain the selected product using routing and element/context binding.

---

## Add / Edit Product

A reusable dialog is intended to support both:

* Creating products
* Editing existing products

The form should use two-way binding and provide validation for required fields and non-negative price/stock values.

---

## Reorder Product

The reorder action should increase the product stock by a predefined batch amount and provide user feedback using a `MessageToast`.

---

## Search, Sort, Filter and Group

The product list is intended to support:

* Search by product name
* Search by category
* Sort by name
* Sort by price
* Sort by stock
* Group by category
* Filter by stock status
* Filter by price range

---

# Data Model

The project is designed around a local JSON data source rather than an OData or real backend service.

A product follows the roadmap's structure:

```json
{
  "productId": "P-1001",
  "name": "Wireless Barcode Scanner",
  "category": "Hardware",
  "sku": "SCN-8842",
  "price": 129.99,
  "currency": "USD",
  "stock": 42,
  "reorderThreshold": 20,
  "supplier": "ScanTech Ltd.",
  "warehouse": "WH-North-A3",
  "description": "2D wireless scanner with 100m range.",
  "imageUrl": "",
  "lastUpdated": "2026-07-14"
}
```

---

# Architecture

The intended architecture is a **freestyle SAPUI5 client-side application**.

```text
                    ┌─────────────────────┐
                    │      index.html     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Component.js    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     manifest.json   │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
            JSON Model     Resource Model   Router
                 │             │             │
                 ▼             ▼             ▼
             products       i18n        Master / Detail
                 │
                 ▼
          ┌───────────────┐
          │ Product List  │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Product Detail│
          └───────┬───────┘
                  │
          ┌───────┼────────┐
          ▼       ▼        ▼
        Edit    Delete   Reorder
          │
          ▼
     Add/Edit Fragment
```

There is intentionally **no backend/OData layer** in this project. The project specifies a local `products.json` model as the application's data source.

---

# Milestone Coverage

The roadmap defines five major implementation milestones:

### Milestone 1 — Application Foundation

* BAS application scaffold
* `Component.js`
* `manifest.json`
* JSON model
* Root view
* FCL shell

### Milestone 2 — Product List

* Product binding
* Status formatter
* Currency formatter
* Search

### Milestone 3 — Navigation and Detail

* Routing
* Detail view
* Element binding
* NotFound handling
* Date formatter

### Milestone 4 — Product Management

* Add/Edit fragment
* Two-way binding
* Validation
* Delete
* Reorder
* ViewSettings fragment

### Milestone 5 — Final UX and Submission

* i18n
* Second language (French)
* Responsiveness
* Busy/empty states
* Cleanup
* README
* Demo

These milestones are defined by the roadmap.

---

# Reference

Project repository:

https://github.com/Atharv-A2/NovoMart-Products-Inventory

SAP Websie:

https://ui5.sap.com
