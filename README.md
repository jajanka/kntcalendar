# kuntcalend.ar - Raw Daily Tracking

A bold, honest daily reflection app where users can track their wins, losses, and everything in between. No bullshit, just raw self-tracking.

## Features

- **Supabase Authentication** - Sign in with Google or GitHub
- **Daily Tracking** - Mark each day as success or failure
- **Emotional Reflection** - Choose if you're happy or meh about your day
- **Optional Notes** - Add detailed reflections about what happened
- **Visual Calendar** - See your month at a glance with color-coded status indicators
- **User-Specific Data** - Each user's data is stored separately and securely
- **Dark Mode Support** - Automatic theme detection
- **Real-time Updates** - Powered by Supabase real-time subscriptions

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with OAuth providers
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account (free tier available)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jajanka/kntcalendar.git
   cd kntcalendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   **Option A: Use Supabase Cloud (Recommended)**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Go to Settings → API to get your project URL and anon key

4. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database (choose one option below)
   DATABASE_URL=
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
   
   # OAuth Providers (optional for now)
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_ID=
   GITHUB_SECRET=
   
   # Web3 Configuration
   # Get your Reown (WalletConnect) Project ID from https://cloud.walletconnect.com/
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
   
   # Deployed contract address (will be updated after deployment)
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   
   # Optional: Enable debug mode for development
   NEXT_PUBLIC_DEBUG=true
   
   # Monad Testnet Private Key
   PRIVATE_KEY=
   ```

5. **Set up the database schema**
   
   **For Supabase Cloud:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase/migrations/20240101000000_initial_schema.sql`
   

6. **Configure OAuth providers (optional)**
   
   **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - In Supabase Dashboard → Authentication → Providers → Google, add your credentials
   
   **GitHub OAuth:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - In Supabase Dashboard → Authentication → Providers → GitHub, add your credentials

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Supabase Features Used

### Authentication
- **OAuth Providers**: Google, GitHub
- **Session Management**: Automatic token refresh
- **User Profiles**: Automatic profile creation on signup

### Database
- **Row Level Security (RLS)**: Users can only access their own data
- **Real-time Subscriptions**: Live updates (ready for future features)
- **Automatic Timestamps**: Created/updated timestamps
- **Foreign Key Constraints**: Data integrity

### Security
- **JWT Tokens**: Secure authentication
- **RLS Policies**: Database-level security
- **CORS Protection**: API security
- **Rate Limiting**: Built-in protection

## Local Development with Supabase (not using it currently)

If you want to develop locally with Supabase:

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**
   ```bash
   supabase start
   ```

3. **Update your environment variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
   ```

4. **Access local services**
   - Supabase Studio: http://localhost:54323
   - API: http://localhost:54321
   - Database: localhost:54322

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
     - `NEXT_PUBLIC_CONTRACT_ADDRESS`
     - `NEXT_PUBLIC_DEBUG` (set to `false` for production)
     - `PRIVATE_KEY` (for contract deployment)
   - Deploy!

3. **Update OAuth redirect URIs**
   - Update Google OAuth: `https://your-domain.vercel.app/api/auth/supabase`
   - Update GitHub OAuth: `https://your-domain.vercel.app/api/auth/supabase`

### Environment Variables for Production

Make sure to set these in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Your WalletConnect project ID
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your deployed contract address
- `NEXT_PUBLIC_DEBUG` - Set to `false` for production
- `PRIVATE_KEY` - Your Monad testnet private key (for contract deployment)

## Database Schema

The app uses these tables:

### `users` table
```sql
- id (UUID, references auth.users)
- name (TEXT)
- email (TEXT, unique)
- email_verified (TIMESTAMP)
- image (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `entries` table
```sql
- id (UUID, primary key)
- user_id (UUID, references users)
- date (TEXT, YYYY-MM-DD format)
- success (BOOLEAN)
- happy (BOOLEAN)
- notes (TEXT, optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Row Level Security (RLS)

The app implements RLS policies to ensure users can only access their own data:

- Users can only view/update their own profile
- Users can only view/insert/update/delete their own entries
- All operations are automatically filtered by `auth.uid()`

## Usage

1. **Sign In** - Use Google or GitHub to authenticate
2. **View Calendar** - See your monthly overview with color-coded days
3. **Click a Day** - Add or edit your daily reflection
4. **Track Your Day** - Mark as success/failure and happy/meh
5. **Add Notes** - Optional detailed reflection
6. **Save** - Your data is automatically synced across devices

## Data Structure

Each user's entries are stored with this structure:
```javascript
{
  user_id: "uuid",
  date: "2024-01-15",
  success: true/false,
  happy: true/false,
  notes: "Optional reflection text"
}
```

## Privacy & Security

- **Row Level Security**: Database-level user isolation
- **JWT Authentication**: Secure token-based auth
- **OAuth Providers**: Password security handled by Google/GitHub
- **No Sensitive Logging**: Secure data handling
- **Automatic Cleanup**: User data deleted when account is deleted

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you have questions or need help:
- Open an issue on GitHub
- Check the [Supabase documentation](https://supabase.com/docs)
- Join our community discussions

---

**Remember**: This is raw, honest tracking. No bullshit, just real reflection on your daily wins and losses.
