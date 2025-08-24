# Luxurious Blog

A luxurious blogging website built with Astro.js and Tailwind CSS featuring an elegant light color contrast design.

## Features

- Modern, luxurious design with a light color palette
- Fully responsive layout
- Blog listing with categories
- Featured article section
- Newsletter subscription form
- Contact page with form
- About page

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v7.x or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd luxurious-blog
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:4321` to see the website

## Build for Production

To build the site for production, run:
```bash
npm run build
```

The built site will be in the `dist/` directory.

## Project Structure

```
luxurious-blog/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Page components
│   └── styles/      # Global styles
├── astro.config.mjs # Astro configuration
└── package.json     # Project dependencies
```

## Customization

The site uses a custom color palette defined in `tailwind.config.mjs`. You can modify these colors to match your brand:

- cream: #F9F5EB
- sand: #E5DCC5
- gold: #D4B483
- taupe: #C1A78E
- mocha: #7D6E5B
- charcoal: #2D2A24
- sage: #CAD2C5
- rose: #F6E6E4
- slate: #E2E8F0

## License

This project is licensed under the MIT License.
