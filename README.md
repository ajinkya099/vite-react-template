# VDR SaaS Platform - Production-Grade Virtual Data Room

A comprehensive Virtual Data Room (VDR) SaaS application built with modern technologies, featuring enterprise-grade security, document management, NDA workflows, billing, and analytics - comparable to Docusend, Digify, and other leading VDR providers.

## 🚀 Features

### Core VDR Functionality
- **Secure Document Storage** - Cloudflare R2-based storage with presigned URLs
- **Folder Structure** - Hierarchical document organization
- **Version Control** - Track document versions and changes
- **Bulk Upload** - Drag-and-drop multiple files with progress tracking
- **Virus Scanning** - Automatic malware detection on uploads

### Security Features
- **Dynamic Watermarking** - User-specific watermarks with email, date, IP
- **Screenshot Detection** - Detect and log screenshot attempts
- **Copy/Paste Prevention** - Disable text selection and clipboard access
- **Download Controls** - Granular download permissions per user/document
- **Print Restrictions** - Block or allow printing with tracking
- **Session Timeout** - Auto-logout after inactivity
- **IP Restrictions** - Limit access by IP address/range
- **Domain Restrictions** - Allow only specific email domains

### NDA Management
- **Custom NDA Templates** - Create reusable NDA templates
- **Digital Signatures** - Canvas-based signature capture
- **Required Fields** - Configurable form fields (name, email, company, date)
- **NDA Gating** - Require signed NDA before document access
- **Audit Trail** - Complete record of all NDA signings
- **Expiration** - Set NDA validity periods

### Access Control
- **Role-Based Access** - Admin, Editor, Viewer roles
- **Email Invitations** - Invite users with custom messages
- **Expiring Access** - Set access expiration dates
- **Instant Revocation** - Revoke access anytime
- **Pending Approval** - Review and approve access requests

### Analytics & Tracking
- **Document Views** - Track who viewed what and when
- **View Duration** - Measure time spent on each document
- **Page-Level Tracking** - See which pages were viewed
- **Download Analytics** - Monitor download activity
- **Geographic Data** - Track viewer location (country/city)
- **Device Information** - Browser, OS, device type
- **Activity Timeline** - Real-time activity feed
- **Heatmaps** - Visual representation of engagement

### Billing & Subscription
- **Multiple Plans** - Free, Starter, Professional, Enterprise
- **Stripe Integration** - Secure payment processing
- **Subscription Management** - Upgrade, downgrade, cancel
- **Usage Tracking** - Monitor storage, VDR count, users
- **Webhook Handling** - Automated subscription updates
- **Invoice Generation** - Download billing history

### White-Label Branding
- **Custom Logo** - Upload organization logo
- **Color Themes** - Customize primary colors
- **Custom Domain** - Use your own domain
- **Email Templates** - Branded email notifications

### Admin Features
- **User Management** - Add, remove, update user roles
- **Organization Settings** - Configure global defaults
- **Audit Logs** - Complete system activity trail
- **Compliance Reports** - Generate compliance documentation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **Recharts** - Data visualization
- **React Dropzone** - File upload handling
- **PDF.js** - PDF rendering
- **jsPDF** - PDF generation

### Backend
- **Hono** - Lightweight, fast web framework
- **Cloudflare Workers** - Edge computing platform
- **Cloudflare D1** - SQLite database at the edge
- **Cloudflare R2** - Object storage for documents
- **Cloudflare KV** - Key-value store for sessions/cache
- **Zod** - Schema validation
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Integrations
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications
- **date-fns** - Date manipulation

## 📁 Project Structure

```
/workspace
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (button, input, card, dialog)
│   │   ├── DocumentUploader.tsx
│   │   ├── SecureDocumentViewer.tsx
│   │   └── NDAForm.tsx
│   ├── features/            # Feature-based modules
│   │   ├── auth/            # Authentication flows
│   │   ├── documents/       # Document management
│   │   ├── vdr/             # VDR creation and management
│   │   ├── billing/         # Subscription and payments
│   │   ├── nda/             # NDA workflows
│   │   ├── watermark/       # Watermarking logic
│   │   ├── analytics/       # Analytics dashboard
│   │   └── admin/           # Admin panel
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   └── utils/           # Helper functions
│   ├── types/               # TypeScript type definitions
│   ├── worker/              # Cloudflare Worker backend
│   │   ├── index.ts         # Main worker entry
│   │   └── api.ts           # API routes
│   └── react-app/           # React application
│       ├── App.tsx          # Main app component
│       └── main.tsx         # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Cloudflare account (for deployment)
- Stripe account (for billing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

### Environment Variables

Create a `.env` file with:

```env
# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password

# Application
APP_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## 📊 Database Schema

The application uses Cloudflare D1 (SQLite) with the following tables:

- `users` - User accounts
- `organizations` - Tenant organizations
- `virtual_data_rooms` - VDR instances
- `documents` - Document metadata
- `access_grants` - User permissions
- `nda_templates` - NDA templates
- `nda_agreements` - Signed NDAs
- `activity_logs` - Audit trail
- `subscriptions` - Billing subscriptions
- `usage_metrics` - Usage tracking
- `analytics_events` - Detailed analytics

## 🔐 Security Considerations

1. **Authentication**: JWT-based auth with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Encryption**: TLS in transit, encryption at rest
4. **Watermarking**: Dynamic, user-specific watermarks
5. **Access Logs**: Comprehensive audit trails
6. **Session Management**: Configurable timeouts
7. **CORS**: Strict origin policies
8. **Rate Limiting**: API rate limiting enabled

## 💰 Pricing Tiers

### Free ($0/month)
- Up to 3 VDRs
- 1GB storage
- Basic watermarking
- Email support

### Starter ($49/month)
- Up to 10 VDRs
- 10GB storage
- Advanced watermarking
- NDA management
- Priority support

### Professional ($149/month)
- Unlimited VDRs
- 100GB storage
- Dynamic watermarking
- Custom branding
- Analytics dashboard
- API access

### Enterprise ($499/month)
- Everything in Professional
- Unlimited storage
- SSO integration
- Dedicated support
- Custom integrations
- SLA guarantee

## 🎯 Competitive Advantages vs Docusend/Digify

1. **Edge-Native Architecture** - Built on Cloudflare Workers for global low-latency
2. **Modern Stack** - React 19, TypeScript, latest best practices
3. **Cost-Effective** - Lower infrastructure costs with serverless
4. **Customizable** - Open architecture for custom features
5. **Real-time Analytics** - Comprehensive tracking and reporting
6. **Advanced Security** - Multi-layer security approach
7. **Seamless Billing** - Integrated Stripe subscription management
8. **White-Label Ready** - Full branding customization

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### VDR Management
- `GET /api/vdrs` - List VDRs
- `POST /api/vdrs` - Create VDR
- `GET /api/vdrs/:id` - Get VDR details
- `PUT /api/vdrs/:id` - Update VDR
- `DELETE /api/vdrs/:id` - Archive VDR

### Documents
- `POST /api/vdrs/:vdrId/documents/upload-url` - Get upload URL
- `GET /api/vdrs/:vdrId/documents` - List documents
- `GET /api/documents/:id/download-url` - Get download URL

### Access Control
- `POST /api/vdrs/:vdrId/access-grants` - Grant access
- `GET /api/vdrs/:vdrId/access-grants` - List access grants
- `PATCH /api/access-grants/:id/revoke` - Revoke access

### NDA
- `GET /api/nda-templates` - List templates
- `POST /api/nda-templates` - Create template
- `POST /api/nda/sign` - Sign NDA
- `GET /api/vdrs/:vdrId/nda-status` - Check NDA status

### Analytics
- `GET /api/vdrs/:vdrId/analytics` - Get analytics
- `GET /api/vdrs/:vdrId/activity-log` - Get activity log
- `POST /api/analytics/track` - Track event

### Billing
- `GET /api/billing/plans` - List plans
- `POST /api/billing/checkout-session` - Create checkout
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/cancel-subscription` - Cancel subscription
- `POST /api/billing/webhook` - Stripe webhook

## 🤝 Contributing

This is a production-ready SaaS application. For customization:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For support and questions:
- Email: support@vdrplatform.com
- Documentation: https://docs.vdrplatform.com
- Status: https://status.vdrplatform.com

---

Built with ❤️ using Cloudflare Workers, React, and modern web technologies.
