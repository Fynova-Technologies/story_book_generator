import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import storyRouter from './routes/story.route';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL || ''
  ]
}));
// app.use(cors())
app.use(express.json({ limit: '20mb' }));  // large limit for base64 images

// ── Routes ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'StoryBook backend running' });
});

app.use('/api/story', storyRouter);

app.listen(PORT, () => {
  console.log(`StoryBook backend running on port ${PORT}`);
});