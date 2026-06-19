# ReCircuit

ReCircuit is a production-ready MVP marketplace for buying and selling electronics components, robotics parts, IoT modules, Arduino and ESP32 boards, sensors, motors, tools, 3D printed parts, used components, and new stock.

Buyers browse approved listings and contact sellers through WhatsApp. There is no payment gateway, chat system, delivery, or shipping workflow in this MVP.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication with Google login
- Firestore Database
- Firebase Storage
- Vercel deployment

## Features

- Home page with hero search, category cards, recent listings, and post CTA
- Listings page with search, category filter, condition filter, location filter, and price/newest sorting
- Product detail page with image gallery, seller details, WhatsApp contact, and safety note
- Protected add-listing page with validation, image upload, and pending status by default
- Admin dashboard for approving, rejecting, viewing, and deleting listings
- Firebase config placeholders, Firestore rules, and Storage rules included

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Fill in `.env.local` with your Firebase project values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

4. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication.
3. Add Google as a sign-in provider.
4. Create a Firestore database.
5. Create a Firebase Storage bucket.
6. Add your local and production domains to Firebase Authentication authorized domains:
   - `localhost`
   - your Vercel domain
7. Deploy Firestore rules from `firestore.rules`.
8. Deploy Storage rules from `storage.rules`.
9. Set `NEXT_PUBLIC_ADMIN_EMAIL` to the Google account that should access `/admin`.

The app creates a `users` document when someone signs in. If the signed-in email matches `NEXT_PUBLIC_ADMIN_EMAIL`, that user is marked as `admin`.

## Database Structure

### `users`

```ts
{
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  createdAt: Timestamp;
}
```

### `listings`

```ts
{
  id: string;
  title: string;
  category: string;
  condition: "New Stock" | "Reused" | "Working" | "Not Tested";
  price: number;
  quantity: number;
  location: string;
  description: string;
  whatsappNumber: string;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
}
```

## Firestore Indexes

If Firestore prompts for indexes while browsing listings, create the suggested indexes in the Firebase console. The common query is:

- Collection: `listings`
- Fields: `status` ascending, `createdAt` descending

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add all variables from `.env.example` in Vercel Project Settings.
4. Deploy.
5. Add the Vercel domain to Firebase Authentication authorized domains.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Safety Notes

ReCircuit only connects buyers and sellers. Buyers should inspect products, verify working condition, and confirm seller details before payment.
