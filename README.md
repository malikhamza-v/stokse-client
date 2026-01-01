# Stokse Client

A comprehensive Electron-based Point of Sale (POS) desktop application built with React and TypeScript.

> **Stokse** - Seamless POS solution for growing businesses

## Overview

Stokse Client is a cross-platform desktop application (Windows, Linux) that provides a complete business management solution including inventory management, sales processing, customer relationship management, employee management, and appointment scheduling.

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Electron | 26.2.1 |
| **Frontend** | React | 18.2.0 |
| **Language** | TypeScript | - |
| **Build Tool** | Webpack (Electron), Vite (Web) | - |
| **State Management** | Redux Toolkit | 2.2.1 |
| **Data Fetching** | React Query | 5.51.11 |
| **Routing** | React Router DOM | 6.16.0 |
| **HTTP Client** | Axios | 1.6.7 |
| **Styling** | Tailwind CSS + DaisyUI | 3.4.1 / 4.11.1 |
| **Charts** | React ApexCharts | 1.4.1 |
| **Calendar** | React Big Calendar | 1.13.1 |
| **Date Handling** | Moment.js | 2.30.1 |
| **Barcode** | JsBarcode | 3.11.6 |
| **Notifications** | React Toastify | 10.0.4 |
| **Cloud Storage** | AWS SDK S3 | 3.529.1 |
| **Auto-updater** | Electron Updater | 6.1.8 |

## Features

### Authentication & Onboarding
- User registration and sign-in
- Multi-step signup process (admin info, verify code, setup business, setup store)
- Store selection for multi-store businesses

### Dashboard
- Real-time sales analytics (today/week/month)
- Customer analytics with growth metrics
- Sales volume tracking
- Top transactions, customers, and products
- Interactive charts (Bar charts, Line charts)
- Percentage change indicators

### Sales / POS System
- Product catalog browsing
- Shopping cart functionality
- Customer selection (walk-in or registered)
- Multiple payment methods support
- Tax calculations with additional tax support
- Discount and tip handling
- Order completion and receipt generation

### Inventory Management
- **Product Management**: Add/Edit/View products with stock tracking, low stock notifications, categories, brands, pricing, and tax configuration
- **Service Management**: Duration-based services with pricing and categories

### Order Management
- View order history
- Edit existing orders
- Order details with items, taxes, discounts
- Payment status tracking

### Customer Management (CRM)
- Customer database with purchase history
- Contact information and total spent tracking
- Customer analytics

### Employee Management
- Employee profiles with role assignments
- Add/Edit employees

### Appointment / Calendar System
- Calendar view for appointments
- Create/view/edit appointments
- Employee scheduling
- Service booking with time slots
- Appointment status management

### Settings & Configuration
- Categories (product and service types)
- Brands management
- Taxes configuration
- Payment methods (Cash, Card, etc.)
- Multi-store management
- Manager assignments
- Activity logs

## Project Structure

```
stokse-client/
├── .erb/                      # Electron React Boilerplate configs
│   ├── configs/               # Webpack configurations
│   └── scripts/               # Build and utility scripts
├── assets/                    # Application assets (icons, images)
├── src/
│   ├── main/                  # Electron main process
│   │   ├── main.ts           # Main entry point
│   │   ├── menu.ts           # Application menu
│   │   ├── preload.ts        # Preload script
│   │   └── util.ts           # Utilities
│   ├── renderer/              # React frontend
│   │   ├── App.tsx           # Main app component with routing
│   │   ├── components/       # Reusable UI components
│   │   │   ├── commonComponents/  # Buttons, inputs, modal, sidebar, etc.
│   │   │   ├── layout/            # Layout components
│   │   │   └── viewComponents/     # Feature-specific components
│   │   ├── views/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Signin.tsx / Signup.tsx
│   │   │   ├── products/     # Product management
│   │   │   ├── services/     # Service management
│   │   │   ├── inventory/    # Inventory wrapper
│   │   │   ├── sale/         # POS/Sales
│   │   │   ├── orders/       # Order management
│   │   │   ├── customer/     # Customer management
│   │   │   ├── employee/     # Employee management
│   │   │   ├── appointments/ # Calendar/Appointments
│   │   │   └── setting/      # Settings pages
│   │   ├── utils/           # Utility functions & hooks
│   │   ├── assets/          # Frontend assets
│   │   └── styles/          # Style files
│   ├── store/               # Redux store configuration
│   ├── __tests__/           # Test files
│   └── web/                 # Web-specific build files
└── release/                 # Build output directory
```

## Getting Started

### Prerequisites

- Node.js >= 14.x (tested with 20.18.1)
- npm >= 7.x
- For Windows builds: Docker with Wine support

### Installation

```bash
# Clone the repository
git clone https://github.com/malikhamza-v/stokse-client.git
cd stokse-client

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start

# Start web version (Vite)
npm run start:web
```

### Building

```bash
# Build for production
npm run build

# Package Electron app
npm run package
```

### Distribution

```bash
# Create distributable builds
npm run dist
```

## Chrome Sandbox Error Fix

If you encounter Chrome sandbox errors:

```bash
sudo chown root node_modules/electron/dist/chrome-sandbox && \
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```

## Windows Build (Docker)

To create Windows builds from Linux/Mac using Docker:

```bash
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine

npm run dist
```

## Configuration

### API Configuration

- Base URL: `https://api.stokse.com/api`
- Device type header: `desktop`
- Authentication: Bearer token from localStorage

### Build Targets

- **Windows**: NSIS installer
- **Linux**: DEB package
- **Web**: Via Vite build

## Repository

- GitHub: https://github.com/malikhamza-v/stokse-client
- Releases: https://github.com/malikhamza-v/stokse-builds

## License

Copyright (c) Stokse. All rights reserved.
