# Food Street - Full Stack Web Application

A modern, responsive food inspection checklist web application with user and admin modules.

## Project Structure

```
vc_web/
├── server/           # Node.js + Express backend
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── server.js     # Main server file
│   └── package.json
├── client/           # React + Vite frontend
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── services/ # API service layer
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Deployment**: Vercel (frontend), Render (backend)

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/foodstreet
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Features

### User Module
- **Combined Login/Register Page**: Single form that auto-detects new vs existing users by email
- **Landing Page**: Welcome page with hero section
- **Inspection Form**: Card-based questionnaire with Yes/No dropdowns for:
  - Exterior
  - Restrooms
  - FOH/Dining Area
  - CSR Counter

### Admin Module
- **Admin Welcome Page**: Entry point to admin area
- **Admin Login/Register**: Combined authentication page
- **Admin Dashboard**: 
  - Left sidebar with Responses accordion
  - User list showing all submissions
  - Click user to view their complete inspection responses

## API Endpoints

### User Auth
- `POST /api/auth/check-email` - Check if email exists
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Admin Auth
- `POST /api/admin-auth/check-email` - Check if admin email exists
- `POST /api/admin-auth/register` - Register new admin
- `POST /api/admin-auth/login` - Login admin

### Responses
- `POST /api/responses/submit` - Submit inspection form
- `GET /api/responses/users` - Get all users who submitted
- `GET /api/responses/user/:userId` - Get user's response details

## Routing

### User Routes
- `/auth` - Login/Register page
- `/landing` - Landing page (protected)
- `/form` - Inspection form (protected)

### Admin Routes
- `/admin` - Admin welcome page
- `/admin-auth` - Admin login/register
- `/admin-dashboard` - Admin dashboard (protected)

## Database Schema

### User
```javascript
{
  email: String (unique, lowercase),
  password: String (hashed),
  createdAt: Date
}
```

### Admin
```javascript
{
  email: String (unique, lowercase),
  password: String (hashed),
  createdAt: Date
}
```

### Response
```javascript
{
  userId: ObjectId (ref: User),
  email: String,
  submittedAt: Date,
  responses: [{
    category: String,
    questions: [{
      question: String,
      answer: "Yes" | "No"
    }]
  }]
}
```

## Testing Checklist

- [ ] User can register with new email
- [ ] User can login with existing email
- [ ] User cannot submit if email verification fails
- [ ] Landing page shows after successful login
- [ ] Form shows all categories and questions
- [ ] Form prevents submission if any question is unanswered
- [ ] Form submission stores data correctly
- [ ] Admin can register/login
- [ ] Admin dashboard loads all submitted users
- [ ] Admin can click user and view their complete responses
- [ ] Responses display organized by category
- [ ] All Yes/No answers display correctly
- [ ] Logout clears tokens and redirects to auth pages

## File Organization Rules

- No direct API calls in components - use services/
- Every form validates inputs before submitting
- Always show loading state during API calls
- Always show error messages when API calls fail
- One component per file, file name matches component name
- useEffect always has cleanup function
- Components kept under 150 lines

## Future Enhancements

- Image upload for inspection photos
- Export inspection data to PDF
- Multiple user roles and permissions
- Inspection history and analytics
- Real-time dashboard updates
