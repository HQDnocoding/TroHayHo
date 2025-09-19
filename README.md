# 🏠 TroHayHo

**TroHayHo** is a **room rental finder application** built with **Django (backend)** and **React Native (mobile app)**.  
The app helps tenants easily search for rental rooms, view locations on maps, chat directly with landlords, and manage listings with role-based access control.

---

## ✨ Features

- 🔑 **Authentication & Authorization**
  - Google Login, Oauth2
  - Role-based access: **Admin**, **Landlord**, **Tenant**.

- 📍 **Google Maps Integration**
  - Display room locations on the map.
  - Search for rentals by area.

- 💬 **Realtime Chat**
  - Direct chat between tenants and landlords.
  - Implemented with Firebase

- 🏘 **Room Management**
  - Post rental listings (add, edit, delete).
  - Manage room inventory.

- 📊 **Admin Dashboard**
  - Manage users, rooms, and reported listings.
  - System monitoring and statistics.

---

## 🛠 Tech Stack

- **Backend**: Django, Django REST Framework  
- **Authentication**: Django OAuth2, Google Login  
- **Database**:  MySQL  
- **Realtime**: FireBase  
- **Mobile App**: React Native  

---

### Backend (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/HQDnocoding/TroHayHo.git
   cd TroHayHo/tro_hay_ho
2. Create & activate virtual environment:
  ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
3. Install dependencies:
  ```bash
  pip install -r requirements.txt
4. Run migrations:
  ```bash
  python manage.py migrate
5. Start the server:
  ```bash
  python manage.py runserver


