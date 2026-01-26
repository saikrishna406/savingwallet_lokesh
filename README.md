# Saving Wallet (Lokesh Project)

This repository contains the source code for the "Saving Wallet" application, consisting of a NestJS backend and a Next.js frontend.

## Codebase Statistics
- **Total Files**: Approximately 24,228 files (including tracked dependencies/assets).
- **Backend**: NestJS (TypeScript)
- **Frontend**: Next.js (TypeScript, React)

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- npm or yarn installed

### 2. Environment Configuration (Backend)
The backend requires environment variables to function correctly, specifically for Supabase and Razorpay integration.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a file named `.env`:
   ```bash
   touch .env
   # or manually create it
   ```
3. Add the following variables to `.env`. **Note**: Replace the placeholder values with your actual credentials.

   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Application Configuration
   PORT=3002
   NODE_ENV=development

   # Razorpay Credentials
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

### 3. Running the Application

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Repository Information
- **Remote URL**: https://github.com/saikrishna406/shareingprojectto-lokes.git
