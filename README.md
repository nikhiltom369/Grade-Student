# Student Marks Entry & Grade Calculation System

A complete production-ready web application built using Node.js, Express, EJS, and Firebase Firestore.

## Features

- **Authentication:** Secure login using Express sessions.
- **Student Data Entry:** Form with robust server-side validation.
- **Grade Calculation:** Automatically calculates the Best of 5 subjects, computes the percentage, and determines the grade.
- **Student List Report:** Interactive dashboard UI built with Bootstrap 5.
- **Bonus Features:** 
  - Client-side searching by name and roll number.
  - Sorting by name or grade.
  - Export table data to CSV.
  - Pagination for student records.

## Prerequisites

- Node.js installed (v14 or above)
- Firebase Account and Project (with Firestore enabled)
- A Firebase Admin SDK service account key (`serviceAccountKey.json`)

## Setup Instructions

1. **Install Dependencies:**
   Run the following command in the project directory to install all required packages:
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Go to your Firebase Console > Project Settings > Service Accounts.
   - Generate a new private key and download the JSON file.
   - Rename the file to `serviceAccountKey.json` and place it inside the `config/` directory of this project.

3. **Start the Application:**
   Start the server using:
   ```bash
   npm start
   ```
   For development mode with auto-reload, use:
   ```bash
   npm run dev
   ```

4. **Access the App:**
   Open your browser and navigate to `http://localhost:3000`.

## Testing Credentials

Use the following hardcoded credentials to log into the system:
- **Username:** `admin`
- **Password:** `test123`

## Directory Structure

```
student-grade-system/
│
├── config/
│   └── firebase.js          # Firebase Admin configuration
│
├── controllers/
│   ├── authController.js    # Login and session logic
│   └── studentController.js # Student logic (CRUD operations)
│
├── middleware/
│   └── authMiddleware.js    # Route protection logic
│
├── public/
│   ├── css/
│   │   └── style.css        # Custom UI styling
│   └── js/
│       └── main.js          # Client-side validation, pagination, export, filtering
│
├── routes/
│   ├── authRoutes.js        # Auth-related routing
│   └── studentRoutes.js     # Student-related routing
│
├── services/
│   └── gradeService.js      # Business logic (calculations)
│
├── views/
│   ├── partials/
│   │   └── navbar.ejs       # Shared navigation bar
│   ├── addStudent.ejs       # Student entry form
│   ├── login.ejs            # Login page
│   └── studentList.ejs      # Display table of students
│
├── package.json             # Dependencies
├── server.js                # App entry point
└── README.md                # Documentation
```
