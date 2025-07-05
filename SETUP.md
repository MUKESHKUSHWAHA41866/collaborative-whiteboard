 first download the project and Export the file

for backend

 then go cd server  and do npm i  and then write npm run dev 

 for client

  then  open new terminal  and cd client  and npm i and npm start 



## 🗂️ Project Structure Setup

\`\`\`bash
# Create project directory
mkdir collaborative-whiteboard
cd collaborative-whiteboard

# Create the following structure:
collaborative-whiteboard/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── package.json           # Root package file
└── README.md
\`\`\`

## ⚙️ Step-by-Step Installation

### 1. Install Dependencies

\`\`\`bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
\`\`\`
  



  # **API Documentation - List Format**

## **REST API Endpoints**

 
 

### **Health Check Endpoints**

1. **GET /** - Basic API information
2. **GET /api/health** - Complete system health status
3. **GET /api/db-status** - Database connection status only


### **Room Management Endpoints**

4. **POST /api/rooms/join** - Join existing room or create new one
5. **GET /api/rooms/:roomId** - Get room information and drawing history