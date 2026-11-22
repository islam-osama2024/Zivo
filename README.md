# Zivo

A React e-commerce storefront demo, live at https://zivo-six.vercel.app/

Built as a front-end practice project: a complete shopping flow (browse, search, cart, wishlist, checkout, auth) wired to public test APIs, so anyone can try it without a private server.

## Features

- Product browsing with search, pagination, and category filtering
- Categories and brands pages
- Cart and wishlist with shared state (React Context)
- Checkout flow with form validation
- Register / login with protected routes
- English / Arabic localization
- Light / dark theme

## Tech stack

- React 19 + Vite 7
- React Router 7
- TanStack Query + Axios for data fetching
- Formik + Yup for forms and validation
- Tailwind CSS + Bootstrap 5, react-slick sliders
- i18next (en/ar), react-hot-toast, react-icons

## Demo data sources

This demo uses public test APIs instead of a private backend:

- Products, categories, search: [DummyJSON](https://dummyjson.com)
- Auth and brands: [Route e-commerce training API](https://ecommerce.routemisr.com)
- Checkout orders are posted to [JSONPlaceholder](https://jsonplaceholder.typicode.com) (not stored)

A separate genuine Express + MongoDB API for this project lives in the
[zivo-backend](https://github.com/islam-osama2024/zivo-backend) repo.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`. The site is deployed on Vercel;
`vercel.json` at the repo root rewrites all paths to `index.html` so deep
links like `/products` work on refresh.
