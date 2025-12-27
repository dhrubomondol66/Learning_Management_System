# Learning Management System (LMS)

## Project Overview
This is a full-stack Learning Management System (LMS) built using Django REST Framework for the backend and React for the frontend.  
The system supports role-based authentication, course management, student enrollment, and dashboard analytics.

The project demonstrates secure authentication using JWT, REST API integration, and frontend-backend communication.

---

## Features

### Authentication & Authorization
- User registration & login
- JWT-based authentication
- Role-based access (Admin / Instructor / Student)

### Course Management
- Create, update, delete courses
- Course descriptions & categories
- Course listing and details page

### Enrollment
- Students can enroll in courses
- View enrolled courses
- Enrollment status tracking

### Dashboard
- User-specific dashboard
- Course overview
- Enrollment summary

---

## Tech Stack

### Backend
- Django
- Django REST Framework (DRF)
- JWT Authentication
- SQLite / PostgreSQL

### Frontend
- React
- Axios
- React Router
- Tailwind CSS / Bootstrap

---

##Screenshots
Login page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/eee205a8-354f-4b21-8a3d-6cc3366d7ff5" />

Dashboard



## Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
