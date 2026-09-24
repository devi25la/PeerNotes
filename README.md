# 📚 PeerNotes – Student Notes & Academic Resource Marketplace

A full-stack, production-ready educational platform designed for college students to upload, discover, share, rate, and download academic study materials (lecture notes, previous year question papers, lab manuals, and exam guides).

---

## 🌟 Key Features

### 👥 User Roles & Access Control
- **Student**: Register, login, edit profile, upload academic notes, browse & search materials, download files (-1 credit), submit 1-5 star ratings & detailed reviews, bookmark favorites, report inappropriate resources, track upload statuses (Approved/Pending/Rejected), and review credit transaction ledgers.
- **Admin**: Dedicated moderation portal (`/admin`), view platform statistics, review pending uploads, approve resources (+10 credits awarded to student) or reject with feedback, manage students (activate/deactivate/adjust credits), moderate reports, and manage academic categories.
- **Guest**: Public landing page, search & filter resources with server-side pagination, view resource details, and instant registration with **+50 Free Welcome Starter Credits**.

### 🪙 Student Credit Economy System
- 🎁 **Signup Starter Bonus**: `+50 credits` credited automatically upon student registration.
- 🎉 **Resource Approval Reward**: `+10 credits` awarded when an admin verifies and approves an uploaded note.
- 🎯 **Download Milestone Reward**: `+5 credits` awarded to the author for every 10 downloads reached.
- ⭐ **Rating Milestone Reward**: `+3 credits` awarded to the author when a resource accumulates 5 positive reviews (4★ or 5★).
- 📥 **Download Cost**: `-1 credit` deducted per download (authors download their own notes for free).
- 🛡️ **Zero Negative Balance**: Students cannot download without sufficient balance; credits cannot become negative.
- 📜 **Immutable Ledger**: Every credit balance update creates an immutable `CreditTransaction` entry with timestamp, amount, and description.

### 🔍 Advanced Resource Discovery & Filtering
- Full-text search by title, course code, subject, department, and tags.
- Multi-faceted filtering by:
  - **Academic Category** (Data Structures, DBMS, OS, Computer Networks, AI, ML, Web Dev, Previous Question Papers, Lab Manuals, Study Guides, etc.)
  - **Semester** (Semester 1 through 8)
  - **Department** (CSE, IT, AI & Data Science, ECE, Software Engineering, Cyber Security, etc.)
  - **File Format** (PDF, Word DOC/DOCX, PowerPoint PPT/PPTX, Images)
- Server-side sorting: Most Downloaded, Highest Rated, Recently Added, Most Bookmarked, Oldest.
- High performance MongoDB server-side pagination.

### ⭐ Peer Rating & Review System
- 1 to 5 star rating selector with interactive stars.
- Students can leave detailed feedback comments.
- One review per student per resource (supports updating existing reviews).
- Automatic real-time recalculation of average ratings and total review counts using Mongoose aggregations.

### 🔖 Bookmarks & Downloads Tracking
- Pinned bookmarks with duplicate prevention.
- Dedicated "My Bookmarks" and "Download History" pages with direct re-download capability.

### 🛡️ Moderation & Report System
- Students can report inappropriate or copyrighted resources with preset reasons and descriptions.
- Admin moderation panel to inspect flagged documents, resolve reports, dismiss false flags, or remove offending content.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, REST API architecture, Multer, Morgan, CORS, Dotenv |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js password hashing, Role Middleware |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |

---

## 📁 Project Architecture & Folder Structure

```
peerNotes-StudentNotes/
│
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ResourceCard, RatingStars, FilterSidebar, Pagination, Modals...
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # MainLayout, DashboardLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, Browse, ResourceDetails, Login, Register, NotFound
│   │   │   ├── student/        # Dashboard, UploadResource, EditResource, MyResources, MyBookmarks, Credits, History, Profile
│   │   │   └── admin/          # AdminDashboard, ManageResources, ManageUsers, ManageReports, ManageCategories
│   │   ├── routes/             # ProtectedRoute, AdminRoute
│   │   ├── services/           # api.js (Axios with JWT interceptors)
│   │   ├── App.jsx             # Master routing tree
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind base styles & glassmorphic tokens
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express REST API
│   ├── config/                 # db.js (MongoDB Connection)
│   ├── controllers/            # authController, resourceController, reviewController, adminController, creditController...
│   ├── middleware/             # authMiddleware, roleMiddleware, uploadMiddleware, errorMiddleware
│   ├── models/                 # User, Resource, Review, Bookmark, Report, CreditTransaction, Download, Category
│   ├── routes/                 # authRoutes, resourceRoutes, categoryRoutes, adminRoutes, reviewRoutes, downloadRoutes...
│   ├── utils/                  # creditManager.js, sampleFiles.js
│   ├── uploads/                # Static storage for PDFs, DOCs, slides & thumbnails
│   ├── seed.js                 # Complete database seeding script
│   ├── test_flow.js            # Automated full-stack verification test suite
│   ├── app.js                  # Express App configuration
│   ├── server.js               # Entry point
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package.json with concurrent run commands
└── README.md                   # Complete documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas cluster connection string)

---

### 2. Installation

Clone repository and install dependencies:

```bash
# 1. Install root scripts
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

---

### 3. Environment Configuration

Create a `.env` file in the `server/` directory (or edit `server/.env`):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/peernotes
JWT_SECRET=peernotes_jwt_super_secret_production_key_2026_secure
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

> **For MongoDB Atlas**: Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/peernotes?retryWrites=true&w=majority`

---

### 4. Database Seeding (Demo Data)

Populate the database with **1 Admin, 10 Student accounts, 15 Categories, 35+ realistic study resources, sample PDF files, reviews, downloads, and credit transactions**:

```bash
cd server
npm run seed
```

---

### 5. Running the Application

Run both frontend and backend concurrently from the root workspace:

```bash
# From workspace root
npm run dev
```

Or run them individually in separate terminals:

```bash
# Terminal 1 - Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (Port 5173)
cd client
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials

| Role | Email | Password | Pre-loaded Credits |
|---|---|---|---|
| **Chief Admin** | `admin@peernotes.edu` | `Admin@123456` | 999 |
| **Student 1** | `aarav@student.edu` | `Student@123456` | 95 |
| **Student 2** | `ananya@student.edu` | `Student@123456` | 120 |
| **Student 3** | `rohit@student.edu` | `Student@123456` | 80 |
| **Student 4** | `sneha@student.edu` | `Student@123456` | 65 |
| **Student 5** | `vikram@student.edu` | `Student@123456` | 140 |

> 💡 **Tip:** The Login page includes **one-click demo login buttons** for instant evaluation.

---

## 🧪 Automated Verification Test Suite

Run the full-stack end-to-end integration test suite to verify all auth, credit deduction, upload, search, and moderation workflows:

```bash
cd server
node test_flow.js
```

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student (+50 welcome credits)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current logged-in user details
- `PUT /api/auth/profile` — Update user profile

### 📚 Resources (`/api/resources`)
- `GET /api/resources` — Search, filter by category/semester/department/type, sort and paginate
- `POST /api/resources` — Upload new academic note (status: `pending`)
- `GET /api/resources/:id` — Get resource details, ratings, user interactions, related items
- `PUT /api/resources/:id` — Update resource details (Author/Admin)
- `DELETE /api/resources/:id` — Delete resource (Author/Admin)
- `GET /api/resources/my-uploads` — Get current student's uploads with status filters
- `GET /api/resources/featured-summary` — Get popular, recent, and platform statistics for landing page

### 📥 Downloads (`/api/downloads`)
- `POST /api/downloads/:resourceId` — Download resource (-1 credit, awards uploader +5 at 10-download milestone)
- `GET /api/downloads/history` — Get student's download history

### ⭐ Ratings & Reviews (`/api/reviews`)
- `GET /api/reviews/:resourceId` — Get reviews for a resource
- `POST /api/reviews/:resourceId` — Submit or update 1-5 star review (calculates avg rating)
- `DELETE /api/reviews/:id` — Delete review

### 🔖 Bookmarks (`/api/bookmarks`)
- `GET /api/bookmarks` — List student's bookmarked resources
- `POST /api/bookmarks/:resourceId` — Add / remove bookmark

### 🪙 Credit Ledger (`/api/credits`)
- `GET /api/credits/history` — Get paginated credit transactions, balance, total earned, total spent

### 🛡️ Moderation Reports (`/api/reports`)
- `POST /api/reports` — Submit report for inappropriate resource
- `GET /api/reports` — List reports queue (Admin)
- `PUT /api/reports/:id` — Resolve, dismiss, or reject reported resource (Admin)

### 📂 Categories (`/api/categories`)
- `GET /api/categories` — Get all categories with dynamic live counts
- `POST /api/categories` — Create category (Admin)
- `PUT /api/categories/:id` — Update category (Admin)
- `DELETE /api/categories/:id` — Delete category (Admin)

### 👨‍💼 Admin Management (`/api/admin`)
- `GET /api/admin/stats` — Executive dashboard statistics & distributions
- `PUT /api/admin/resources/:id/approve` — Approve pending resource (+10 credits to student)
- `PUT /api/admin/resources/:id/reject` — Reject resource with feedback reason
- `GET /api/admin/users` — Directory of students with search, filters & statistics
- `PUT /api/admin/users/:id/toggle-status` — Activate / Deactivate user account
- `POST /api/admin/users/:id/credits` — Manual credit adjustment
- `DELETE /api/admin/users/:id` — Delete user account

---

## 🔒 Security & Best Practices
- **Password Protection**: Salted password hashing with `bcryptjs`.
- **JWT Protection**: Tokens signed with server secret and expiration.
- **Role Enforcement**: Protected routes and admin-only endpoints reject unauthorized access with appropriate HTTP status codes (401, 403).
- **Input Sanitization**: Mongoose schema validations, text trimming, and regex matching.
- **Upload Safety**: Multer size restriction (50MB limit) and file extension allowlists.
- **Central Error Handling**: Standardized `{ success: false, message: "..." }` responses.

---

## 🎓 Academic Demonstration Guide
1. **Explore Landing Page**: Open [http://localhost:5173](http://localhost:5173), browse categories and live stats.
2. **Search Resources**: Navigate to `/browse`, search for `"DBMS"` or filter by `"Semester 4"` and file type `"PDF"`.
3. **Inspect Resource**: Click on any note to view description, rating breakdown, and related notes.
4. **Log in as Student**: Use the quick button on `/login` to sign in as `aarav@student.edu`.
5. **Download Notes**: Click Download on a note; observe the 1 credit deduction and updated balance in the top badge.
6. **Upload Note**: Click **Upload Notes** to submit a study note. Notice it goes into `PENDING` review.
7. **Moderate as Admin**: Log in as `admin@peernotes.edu` on `/login`, visit `/admin`, and approve the pending note. Observe the student receiving +10 credits instantly in their ledger!
