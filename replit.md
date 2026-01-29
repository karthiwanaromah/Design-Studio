# Product Customizer

## Overview

A pure Vite React JavaScript application for product customization. Users can upload product images (front and back), add custom text and artwork using a canvas editor, and save designs locally to their browser.

## Tech Stack

- **Vite** - Build tool and dev server
- **React 18** - UI framework (JavaScript, not TypeScript)
- **Tailwind CSS** - Styling
- **Fabric.js** - Canvas manipulation for design editing
- **localStorage** - Design persistence (no backend required)
- **wouter** - Client-side routing

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components (Button, Input, Card, Toast, etc.)
│   │   └── ColorPicker.jsx
│   ├── hooks/
│   │   ├── use-designs.js  # localStorage-based design storage
│   │   └── use-toast.js    # Toast notification system
│   ├── lib/
│   │   └── utils.js        # Utility functions (cn for classnames)
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── Customizer.jsx  # Main design editor
│   │   ├── Gallery.jsx     # View saved designs
│   │   └── not-found.jsx   # 404 page
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features

- Upload front and back product images
- Add custom text with color picker
- Upload artwork/images to overlay on products
- Switch between front and back views
- Export designs as PNG
- Save designs to browser localStorage
- View saved designs in gallery

## Development

The app runs on port 5000 with Vite's dev server.

## User Preferences

- Pure JavaScript (no TypeScript)
- Client-side only (no Node.js backend)
- localStorage for data persistence
