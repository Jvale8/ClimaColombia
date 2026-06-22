import express from 'express';
import cors from "cors";
import forecastRouter from './routes/getForecast.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ["http://localhost:5173", "https://clima-colombia.vercel.app"],
    methods: ["GET", "POST"],
    credentials: false
}));

app.use(express.json());

app.use("/api/weather", forecastRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});

