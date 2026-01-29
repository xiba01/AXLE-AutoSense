---
description: how to start the frontend and backend servers
---

To run the project correctly, you need to start both the backend server and the frontend development server. This can be done in two separate terminal windows.

### 1. Start the Backend Server
The backend handles AI responses and story persistence.
// turbo
```powershell
npm run server
```

### 2. Start the Frontend Server
The frontend provides the editor and playback interface.
// turbo
```powershell
npm run dev
```

### 3. Verify Connections
- Backend should be running on [http://localhost:5000](http://localhost:5000)
- Frontend should be running on [http://localhost:5173](http://localhost:5173) (or the port shown in the terminal)

> [!TIP]
> Make sure your `.env` file is configured with the necessary API keys (like `GEMINI_API_KEY`) for the AI features to work.
