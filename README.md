# LocalHub - Local Mini-Blog & Deals Hub

A production-ready MVP for a mobile-first mini-blog and deals hub focused on local communities. Currently configured for Govandi, Shivaji Nagar, and Baiganwadi areas of Mumbai, but easily customizable for any location.

## 🚀 Features

### Core Functionality
- **Public Pages**: Home, News, Deals, Category, About, Contact
- **Election Section**: Landing page with gated reports (paywall UI)
- **Affiliate Tracking**: Click tracking API for affiliate links
- **Search & Filters**: Client-side search with area-based filtering
- **SEO Optimized**: Dynamic metadata, sitemap, robots.txt, OG images
- **Modern UI**: Clean design with TailwindCSS and shadcn/ui components

### Technical Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS with custom design system
- **Components**: shadcn/ui + lucide-react icons
- **Database**: Prisma ORM + SQLite
- **Authentication**: NextAuth.js (Email magic link - scaffolding)
- **Payment**: Razorpay integration (stubbed endpoints)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd govandi-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example file and customize it:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your values:
   ```env
   # NextAuth Configuration (REQUIRED)
   NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
   NEXTAUTH_URL=http://localhost:3000
   
   # Database (REQUIRED)
   DATABASE_URL="file:./dev.db"
   
   # Email Configuration (Optional - for magic links)
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=noreply@localhub.com
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
govandi-hub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── deals/             # Deals detail pages
│   │   ├── election/          # Election section
│   │   ├── news/              # News detail pages
│   │   ├── search/            # Search functionality
│   │   └── globals.css        # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── header.tsx         # Site header
│   │   ├── footer.tsx         # Site footer
│   │   └── theme-provider.tsx # Theme management
│   └── lib/                   # Utility functions
│       ├── auth.ts            # NextAuth configuration
│       ├── sample-data.ts     # Sample data for development
│       └── utils.ts           # Helper functions
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── package.json               # Dependencies and scripts
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run seed` - Seed database with sample data

## 🔧 Configuration

### TailwindCSS
The project uses TailwindCSS with a custom design system. Configuration is in `tailwind.config.ts`.

### shadcn/ui Components
All UI components are built using shadcn/ui for consistency and accessibility.

### Database
SQLite is used for development. The schema includes:
- **Deal**: Product deals with affiliate tracking
- **Click**: Click tracking for analytics

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
Ensure all required environment variables are set in your production environment:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL` (use production database)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

## 📝 TODO for Phase 2

### Sanity CMS Integration
- [ ] Set up Sanity studio
- [ ] Create content schemas for Post, Deal, and Report
- [ ] Implement content synchronization
- [ ] Add image optimization and CDN

### Razorpay Integration
- [ ] Implement actual payment processing
- [ ] Add webhook handlers for payment confirmation
- [ ] Integrate with user access management
- [ ] Add payment analytics

### Enhanced Features
- [ ] User management dashboard
- [ ] Content moderation tools
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database ORM by [Prisma](https://www.prisma.io/)
