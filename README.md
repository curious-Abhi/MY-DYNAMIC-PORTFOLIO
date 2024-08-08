# Dynamic Portfolio

Welcome to my full stack dynamic portfolio project! This project showcases my skills, projects, and experience, providing a comprehensive view of my professional background.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Overview

This project is a dynamic portfolio built using the PERN stack (PostgreSQL, Express.js, React, and Node.js). It includes a user authentication system, the ability to manage skills and projects, and features to upload avatars and resumes. It is deployed and accessible online for potential employers and collaborators to view.

## Features

- User Authentication (Register, Login, Logout)
- Manage Profile (Update Profile, Update Password)
- Manage Skills (Add, Update, Delete Skills)
- Manage Projects (Add, Update, Delete Projects)
- Upload and manage Avatars and Resumes using Cloudinary
- Responsive Design for Mobile and Desktop

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **File Storage**: Cloudinary
- **Other**: dotenv for environment variables, nodemailer for email notifications

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/dynamic-portfolio.git
   cd dynamic-portfolio
   ```

2.Install dependencies:
```
# For backend
cd backend
npm install
```
```
# For frontend
cd ../frontend
npm install
```

3.Configure environment variables:


Create a .env file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=development
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=7d
JWT_COOKIE_EXPIRES=7
DATABASE_URL=postgres://user:password@localhost:5432/yourdatabase
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
DASHBOARD_URL=http://localhost:3000
```


4.Set up PostgreSQL database:

Make sure PostgreSQL is installed and running. Create a new database and update the DATABASE_URL in the .env file accordingly.

5.Run the backend:
```
cd backend
npm run dev
```

Access the application:

Open your browser and go to http://localhost:3000.
```
Usage
Register a new user account.
Log in to your account.
Update your profile with your avatar and resume.
Add and manage your skills and projects.
API Endpoints
Authentication
```
POST /api/v1/auth/register: Register a new user
POST /api/v1/auth/login: Log in a user
POST /api/v1/auth/logout: Log out a user

User Management
```
GET /api/v1/user: Get user profile
PUT /api/v1/user/profile: Update user profile
PUT /api/v1/user/password: Update user password
POST /api/v1/auth/forgot-password: Forgot password
PUT /api/v1/auth/reset-password/:token: Reset password
```
Skills Management
```
POST /api/v1/skills: Add a new skill
GET /api/v1/skills: Get all skills
PUT /api/v1/skills/:id: Update a skill
DELETE /api/v1/skills/:id: Delete a skill
```

Projects Management
```
POST /api/v1/projects: Add a new project
GET /api/v1/projects: Get all projects
PUT /api/v1/projects/:id: Update a project
DELETE /api/v1/projects/:id: Delete a project
```

Contributing
If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

Fork the repository.
Create a new branch: git checkout -b feature-branch-name
Make your changes.
Commit your changes: git commit -m 'Add some feature'
Push to the branch: git push origin feature-branch-name
Submit a pull request.

