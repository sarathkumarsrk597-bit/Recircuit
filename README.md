# ReCircuit

ReCircuit is a production-ready MVP marketplace for buying and selling electronics components, robotics parts, IoT modules, Arduino and ESP32 boards, sensors, motors, tools, 3D printed parts, used components, and new stock.

Buyers browse approved listings and contact sellers through WhatsApp. There is no payment gateway, chat system, delivery, or shipping workflow in this MVP.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication with Google login
- Firestore Database
- Cloudinary unsigned uploads for listing images
- Vercel deployment

## Free-Tier Architecture

ReCircuit uses Firebase only for Google login and Firestore listing data. Listing images upload directly to Cloudinary through an unsigned upload preset, and the returned image URLs are saved in Firestore.

Firebase Storage is not used because new Firebase Storage setup can require a billing-enabled Firebase project.

## Features

- Home page with hero search, category cards, recent listings, and post CTA
- Listings page with search, category filter, condition filter, location filter, and price/newest sorting
- Product detail page with image gallery, seller details, WhatsApp contact, and safety note
- Protected add-listing page with validation, Cloudinary image upload, and pending status by default
- Admin dashboard for approving, rejecting, viewing, and deleting listings
- Firebase config placeholders and Firestore rules included

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

3. Fill in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

4. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project on the Spark plan.
2. Add a web app in Project settings and copy its config values.
3. Enable Authentication.
4. Add Google as a sign-in provider.
5. Create a Firestore database.
6. Deploy Firestore rules from `firestore.rules`.
7. Add your local and production domains to Firebase Authentication authorized domains:
   - `localhost`
   - your Vercel domain
8. Set `NEXT_PUBLIC_ADMIN_EMAIL` to the Google account that should access `/admin`.

Do not create or configure Firebase Storage for this MVP.

The app creates a `users` document when someone signs in. If the signed-in email matches `NEXT_PUBLIC_ADMIN_EMAIL`, that user is marked as `admin`.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Copy your cloud name from the Cloudinary dashboard into `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Go to Settings > Upload > Upload presets.
4. Create an unsigned upload preset.
5. Restrict the preset for MVP safety:
   - Resource type: image
   - Allowed formats: jpg, jpeg, png, webp
   - Folder: `recircuit/listings`
   - Use a maximum file size that matches the app expectation, such as 5 MB
6. Copy the preset name into `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

Unsigned presets can be used from the browser, so treat the preset name as sensitive. Rotate it if it is exposed or abused.

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
