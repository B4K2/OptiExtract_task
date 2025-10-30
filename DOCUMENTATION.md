# OptiExtract Internship Assignment: File Uploader and Tracker

---


## 1. Local Setup Guide

### **Prerequisites**
Before you begin, ensure you have the following installed on your system:
*   **Git:** For cloning the repository.
*   **Python (3.8+):** For the backend.
*   **Node.js (18.x+):** For the frontend.
*   **PostgreSQL:** The database for the application.

#### **Step 1: Clone the Repository**
```bash
git clone [temp]
cd temp
```

#### **Step 2:Database Setup(PostgreSQL)**
**Open** ```psql``` : Open a new Command Prompt or PowerShell and log in. It will prompt for the password you set during installation.

```bash
psql -U postgres
```

**After opening** `psql`, run the following SQL commands. They are the same for all systems. **Replace** 'your_secure_password' **with your own password.**

```sql
-- Create the database for our application
CREATE DATABASE file_tracker_db;

-- Create a dedicated user for our application
CREATE USER optiuser WITH PASSWORD 'your_secure_password';

-- Grant the user permission to connect to the database
GRANT ALL PRIVILEGES ON DATABASE file_tracker_db TO optiuser;

-- Grant the user permission to create tables in the database schema
GRANT ALL ON SCHEMA public TO optiuser;

-- Exit the psql prompt
\q
```

#### **Step 3: Backend Setup (FastAPI)**
Navigate into the `backend` directory and create `logs` file to store the logs.
```bash
cd backend
mkdir logs
```



## Environment Setup

Follow the steps below to set up your development environment.

---

<details>
<summary><strong>For Windows</strong></summary>

### 1. Create and activate a virtual environment

```powershell
py -m venv venv
.\venv\Scripts\activate
```

### 2. Install dependencies

```powershell
pip install -r requirements.txt
```

### 3. Create the environment file

```powershell
copy .env.example .env
```

</details>

---

<details>
<summary><strong>For macOS & Linux (including WSL)</strong></summary>

### 1. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create the environment file

```bash
cp .env.example .env
```

</details>

---

**Note:** After setup, make sure your `.env` file is properly configured before running the project.


**After completing the steps above,** edit the newly created .env file and fill in your database credentials from Step 2. Remember to URL-encode the password if it contains special characters (like @, $, :).
```env
POSTGRES_USER=optiuser
POSTGRES_PASSWORD=[Your-URL-Encoded-Password]
POSTGRES_SERVER=localhost
POSTGRES_DB=file_tracker_db
```

#### **Step 4: Frontend Setup (React)**
This step is the same for all operating systems. Open a **new terminal** and navigate to the `frontend` directory.

```bash
cd frontend
npm install
```

#### **Step 5: Run the Application**
You need two terminals open simultaneously.

- **In your first terminal (inside `backend/` with venv active):**
```bash
uvicorn app.main:app --reload
```
The backend will run on http://127.0.0.1:8000.

- **In your second terminal (inside `frontend/`):**
```bash
npm run dev
```
The frontend will open in your browser at http://localhost:5173.

The application should now be fully functional.
#### **Step 6: Testing the API with Swagger UI**

To interactively test the backend API, navigate to http://127.0.0.1:8000/docs in your browser. This UI provides complete, interactive documentation for all API endpoints, allowing you to test file uploads and history retrieval directly.


# 2. Project Overview & Rationale   

## Project Structure

The project is origanzied into two file one `frontend` and one `backend` to seprate the FastAPI from frontend.

- `/backend` : The backend is writen in FastAPI for handeling the API request which manages the the file upload and storing and also maintain the history of all the upload the file.
The Code is more modularized into many files like ( `config.py` ) so rather than making changes in each and every file and many other file.

- `/frontend` : The frontend is done with React that provide the user interface. The website is also scalable and responsive based on the device. Where `main.jsx` control routing and `App.jsx` for primary layout.

The website is buld with the basic layout and can be scaled in future.

- **Unique System Filename Generation** : For creating a unique name to the file I used `uuid.uuid4()` to create new unique name to avoid filename collisions and added with original file extension.

- **Synchronization Between File Save and Metadata Recording** : For Synchronization I first upload the file and store the database and using the endpoint `/upload-document/` endpoint. After successful completion on file upload then the metadata is sent to the database. If this fail then the data is roleback and the file deleted from the local storage.

### Challenges 

- **CORS Challenges** : There was a huge problem between the frontend and backend because I usually work in WSL (Linux) so I have written the backend code in WSL and the frontend was also written in WSL but was using Windows `npm` and because of that there was change in localhost but as soon I found this problem it was easy to fix.

- **Frontend Components**: I use components from [ReactBits](https://www.reactbits.dev/) to build the frontend. While the library provided prebuilt components into the website and customizing them to meet specific requirements proved to be a challenging task.

