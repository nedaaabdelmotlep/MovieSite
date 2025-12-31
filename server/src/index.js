import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("Server is running. Try /api/status"));

const WATCHMODE_BASE = "https://api.watchmode.com/v1";
const API_KEY = process.env.WATCHMODE_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ WATCHMODE_API_KEY is missing in server/.env");
}

const wm = axios.create({
  baseURL: WATCHMODE_BASE,
  timeout: 15000,
});

async function watchmodeGet(path, params = {}) {
  const r = await wm.get(path, { params: { apiKey: API_KEY, ...params } }); // apiKey auth :contentReference[oaicite:2]{index=2}
  return r.data;
}

app.get("/api/health", (req, res) => res.json({ ok: true }));

// 1) Status: بيأكد إن الـ API شغال والـ apiKey صح وكمان يوضح الـ quota :contentReference[oaicite:3]{index=3}
app.get("/api/status", async (req, res) => {
  try {
    const data = await watchmodeGet("/status");
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// 2) Search: /v1/search/?types=&search_field=name&search_value=... :contentReference[oaicite:4]{index=4}
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    const types = req.query.types || ""; // مثال: movie,tv,person (اختياري) :contentReference[oaicite:5]{index=5}
    if (!q) return res.status(400).json({ error: "Missing q" });

    const data = await watchmodeGet("/search/", {
      types,
      search_field: "name",
      search_value: q,
    });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// 3) Title details: /v1/title/{id}/details/ (وفيه language و append_to_response) :contentReference[oaicite:6]{index=6}
app.get("/api/title/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const language = req.query.language; // اختياري
    const append = req.query.append_to_response; // اختياري

    const data = await watchmodeGet(`/title/${id}/details/`, {
      ...(language ? { language } : {}),
      ...(append ? { append_to_response: append } : {}),
    });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// 4) List titles: /v1/list-titles/ (فلترة + sort + pagination) :contentReference[oaicite:7]{index=7}
app.get("/api/list-titles", async (req, res) => {
  try {
    // هنمرر أي query زي ما هي (types, regions, source_types, genres, page, limit, sort_by...)
    // الدوك بيشرح البراميترز بالتفصيل :contentReference[oaicite:8]{index=8}
    const data = await watchmodeGet("/list-titles/", { ...req.query });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
