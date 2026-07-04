import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inviteRoutes from './routes/invite.js';
import seatingDirectoryRoutes from './routes/seatingDirectory.js';
import adminGuestsRoutes from './routes/adminGuests.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(inviteRoutes);
app.use(seatingDirectoryRoutes);
app.use(adminGuestsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Enoch's Dedication invite server running on port ${PORT}`);
});
