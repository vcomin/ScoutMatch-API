import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const matches = [
  {
    id: 1,
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga",
    matchDate: "2026-05-06",
    matchTime: "16:00",
    status: "scheduled",
    score: {
      home: null,
      away: null,
    },
  },
  {
    id: 2,
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    league: "Premier League",
    matchDate: "2026-05-06",
    matchTime: "18:30",
    status: "scheduled",
    score: {
      home: null,
      away: null,
    },
  },
  {
    id: 3,
    homeTeam: "Brasil",
    awayTeam: "Argentina",
    league: "International Friendly",
    matchDate: "2026-05-07",
    matchTime: "21:00",
    status: "scheduled",
    score: {
      home: null,
      away: null,
    },
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "ScoutMatch API funcionando!",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    project: "ScoutMatch",
  });
});

app.get("/api/matches", (req, res) => {
  res.json({
    success: true,
    count: matches.length,
    data: matches,
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});