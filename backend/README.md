# SmartAttend Backend

SmartAttend is a Node.js, Express, MongoDB, and Socket.IO backend for QR-based classroom attendance tracking.

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret key for signing JWT tokens
- `PORT` - server port, Render sets this automatically
- `CORS_ORIGIN` - frontend URL, for example `https://smartattend.vercel.app`
- `QR_EXPIRY_MINUTES` - how long a QR code stays valid, for example `5`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Sessions

- `POST /api/sessions`
- `PATCH /api/sessions/:id/start`
- `PATCH /api/sessions/:id/stop`
- `GET /api/sessions/:id`
- `GET /api/sessions/my`

### Attendance

- `POST /api/attendance/submit`
- `GET /api/attendance/session/:id`
- `GET /api/attendance/student/me`
- `GET /api/attendance/analytics/:sessionId`
- `GET /api/attendance/export/:sessionId`

### Health

- `GET /health`

## Run Locally

```bash
npm run dev
```
