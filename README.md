# MediScript — Frontend

A professional, role-based React frontend for a digital prescription management system. Built with React, Tailwind CSS, and Vite.

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **OCR**: Tesseract.js
- **Charts**: Recharts
- **State Management**: React Context API

---

## Project Structure

```
src/
├── api/
│   └── axios.js                  # Axios instance with JWT interceptor
├── context/
│   └── AuthContext.jsx            # Global auth state (user, token, login, logout)
├── components/
│   ├── common/
│   │   ├── Navbar.jsx             # Top navigation with user info and logout
│   │   ├── Sidebar.jsx            # Role-based sidebar navigation
│   │   └── ProtectedRoute.jsx     # Route guard for authenticated users
│   ├── doctor/
│   │   ├── CreatePrescription.jsx # Prescription form with multiple medications
│   │   ├── PatientHistory.jsx     # List of assigned patients
│   │   └── DrugInteractionChecker.jsx  # Real FDA drug interaction lookup
│   ├── patient/
│   │   ├── PrescriptionList.jsx   # Patient's prescription history
│   │   ├── OCRUpload.jsx          # Upload and scan prescription images
│   │   ├── Teleconsultation.jsx   # Video call placeholder
│   │   ├── Chatbot.jsx            # AI chatbot placeholder
│   │   └── InsurancePharmacy.jsx  # Insurance & pharmacy placeholder
│   └── admin/
│       ├── UserManagement.jsx     # Manage users, assign doctors, toggle status
│       └── Analytics.jsx          # Charts — top drugs, prescriptions over time
├── pages/
│   ├── Login.jsx                  # Login page
│   ├── Register.jsx               # Register page (doctor/patient)
│   ├── DoctorDashboard.jsx        # Doctor home with stats and quick actions
│   ├── PatientDashboard.jsx       # Patient home with health summary
│   └── AdminDashboard.jsx         # Admin home with system overview
├── App.jsx                        # Routes and layout
├── main.jsx                       # Entry point with AuthProvider
└── index.css                      # Global styles
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running at `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone https://github.com/ishitakhedekar/prescription-recommendation-system.git
cd prescription-recommendation-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start at `http://localhost:5173`

---

## Environment Setup

Make sure the backend is running before starting the frontend. The API base URL is configured in `src/api/axios.js`:

```javascript
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})
```

Update this URL when deploying to production.

---

## User Roles & Pages

### Doctor
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/doctor-dashboard` | Stats overview and quick actions |
| My Patients | `/doctor/patients` | View assigned patients |
| Prescriptions | `/doctor/prescriptions` | Create prescriptions with medications |

### Patient
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/patient-dashboard` | Health summary and quick access |
| My Prescriptions | `/patient/prescriptions` | View all prescriptions |
| OCR Upload | `/patient/ocr` | Scan and save prescription images |
| Teleconsultation | `/patient/teleconsultation` | Video call (future scope) |
| AI Chatbot | `/patient/chatbot` | Medical chatbot (future scope) |
| Insurance & Pharmacy | `/patient/insurance` | Insurance info (future scope) |

### Admin
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/admin-dashboard` | System stats overview |
| User Management | `/admin/users` | Manage users, assign doctors to patients |
| Analytics | `/admin/analytics` | Charts and prescription trends |

---

## Key Features

### Authentication
- JWT-based login with token stored in localStorage
- Role-based redirect after login (doctor/patient/admin)
- Protected routes — unauthorized users redirected to login
- Persistent login across page refreshes

### OCR Prescription Upload
- Upload prescription images (JPG, PNG)
- Tesseract.js extracts text directly in the browser
- Auto-parses medication names, dosages, and frequency
- Editable form to review and correct before saving
- Saved directly to the database linked to the patient's assigned doctor

### Drug Interaction Checker
- Real-time lookup using the OpenFDA Drug Label API
- No API key required
- Detects interactions between two drugs
- Shows detailed interaction notes from FDA database

### Admin Analytics
- Live stats: total doctors, patients, prescriptions
- Line chart: prescriptions over time (monthly)
- Bar chart: top prescribed drugs
- Pie charts: user breakdown and prescription status

---

## Authentication Flow

1. User registers at `/register` (doctor or patient)
2. Admin assigns patient to a doctor via User Management
3. User logs in at `/login`
4. JWT token stored in localStorage
5. Token automatically attached to all API requests via Axios interceptor
6. On logout, token and user data cleared from localStorage

---

## Future Scope

- AI Chatbot powered by Ollama (local LLM)
- Teleconsultation via Twilio Video API
- Insurance and pharmacy finder
- Push notifications for prescription reminders
- Mobile app (React Native)
- Dark mode support