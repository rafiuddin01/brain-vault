# BrainVault

BrainVault is a full-stack Notes & File Vault application built using React, Node.js, Express, MySQL, and Sequelize.

## Features

* User Registration
* Email Verification using OTP
* Secure JWT Authentication
* Create Notes
* View Notes
* Delete Notes
* PDF Upload Support
* MySQL Database Integration
* Responsive UI with Tailwind CSS

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Toastify
* Framer Motion

### Backend

* Node.js
* Express.js
* Sequelize ORM
* JWT Authentication
* Nodemailer
* Multer

### Database

* MySQL

## Project Structure

brain-vault/
├── frontend/
│ └── brain-vault/
├── backend/
│ └── backend/

## Installation

### Frontend

```bash
cd frontend/brain-vault
npm install
npm run dev
```

### Backend

```bash
cd backend/backend
npm install
npm run dev
```

## Environment Variables

Create a .env file in the backend folder and add:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=brainvault_dev

JWT_SECRET=your_secret_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:5173

## Author

Mohammed Rafiuddin

## Future Enhancements

* Edit Notes
* Search Notes
* File Management
* User Profile Page
* Cloud Deployment
