# LMS — Corporate Leave Management System

A modern, responsive, enterprise-grade Leave Management System (LMS) built with Next.js 14, Tailwind CSS, TypeScript, and Supabase.

---

## 🌟 Key Features

### 👤 Role-Based Portals
- **Employee Portal**:
  - Dashboard with leave balance summaries and live IST date/time badge.
  - Interactive leave application with automatic blacking out of past dates.
  - Day-by-day leave preview accounting for weekends and public holidays.
  - Department team directory with live "In Office" vs "On Leave" attendance tracking.
  - Personal quota utilization and analytics charts.
  - Profile image and personal information updates.
- **Manager Portal**:
  - Multi-tier leave request approval and rejection workflows.
  - Team calendar and leave overlap detection.
  - Team analytics and leave history.
- **Admin Portal**:
  - Full Employee CRUD operations (Create, Read, Update, Delete).
  - Indian mobile number validation (`+91` / 10-digit) and corporate email formatting.
  - Company leave policy and leave type quota configurations.
  - System audit trails and department management.

### 🕒 Indian Standard Time (IST) Engine
- Built-in timezone engine strictly calibrated to `Asia/Kolkata` (UTC+05:30).
- Real-time ticking IST clock badge in the global navigation bar.
- Dynamic greeting based on IST hour (Morning, Afternoon, Evening).
- Audit timestamps and application histories formatted with explicit IST indicators.

### 🎨 Design System
- Warm corporate luxury palette: `#F8F5EF` canvas, `#101C35` royal navy, and `#C5A46D` champagne gold.
- Responsive mobile drawer navigation and fluid layouts designed for desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.17 or higher)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/shravanireddy960-wq/Leave-Management-System.git
cd Leave-Management-System
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 👥 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Employee** | `employee@lms.in` | `employee@123` |
| **Manager** | `manager@lms.in` | `manager@123` |
| **Admin** | `admin@lms.in` | `admin@123` |

---

## 📄 License
This project is licensed under the MIT License.

