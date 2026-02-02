# Unhire Platform

Unhire is a modern workforce platform designed to connect ambitious businesses with top-tier expert talent. Built with the MERN stack and enhanced with AI capabilities, it provides a seamless, secure, and instant collaboration experience.

## 🚀 Key Features

- **Google OAuth Integration**: Fast and secure authentication for both Clients and Experts.
- **Expert Onboarding**: Simplified transition for experts to showcase their skills and sync with LinkedIn.
- **Role-Based Access Control**: Secure, isolated dashboards for Clients and Experts.
- **Real-Time Notifications**: System-wide alerts for new projects and critical updates.
- **AI-Powered Matching**: Gemini AI integration for smart expert recommendations.
- **Dynamic Project Monitoring**: Background jobs handle project lifecycles and expirations.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Intelligence**: Google Gemini AI
- **Authentication**: JWT, Google OAuth 2.0

## 📂 Project Structure

- `/Frontend`: React application with modern UI/UX design.
- `/Backend`: Express server with robust API endpoints and CRON jobs.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for Google Auth)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Unhire-production
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   # Create a .env file with:
   # MONGO_URI, JWT_SECRET, PORT, VITE_GOOGLE_CLIENT_ID
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   # Create a .env file with:
   # VITE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID
   npm run dev
   ``

---

Built with ❤️ by the Unhire Team
