import express from 'express';
import cors from 'cors';
import { connectToDb } from './db/mongo.js';

// Imports des routes
import userRouter from './routes/api/user.route.js';
import dayTypeRouter from './routes/api/daytype.route.js';
import musicRouter from './routes/api/music.route.js';
import alarmRouter from './routes/api/alarm.route.js';
import genreRouter from './routes/api/genre.route.js';
import seedRouter from './routes/api/seed.route.js';
import authRouter from "./routes/api/auth.route.js";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Connexion DB
connectToDb();

// Routes
app.use('/api/users', userRouter);
app.use('/api/daytypes', dayTypeRouter);
app.use('/api/musics', musicRouter);
app.use('/api/alarms', alarmRouter);
app.use('/api/genres', genreRouter);
app.use('/api/seed', seedRouter);
app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello from Backend API');
});

export default app;