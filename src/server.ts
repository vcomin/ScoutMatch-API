import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

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

app.get("/api/matches/live", async (req, res) => {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "API_FOOTBALL_KEY não foi configurada no arquivo .env",
      });
    }

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": apiKey,
        },
      },
    );

    const formattedMatches = response.data.response.map((match: any) => {
      return {
        id: match.fixture.id,
        referee: match.fixture.referee,
        timezone: match.fixture.timezone,
        date: match.fixture.date,
        status: {
          long: match.fixture.status.long,
          short: match.fixture.status.short,
          elapsed: match.fixture.status.elapsed,
        },
        league: {
          id: match.league.id,
          name: match.league.name,
          country: match.league.country,
          logo: match.league.logo,
          flag: match.league.flag,
          season: match.league.season,
          round: match.league.round,
        },
        teams: {
          home: {
            id: match.teams.home.id,
            name: match.teams.home.name,
            logo: match.teams.home.logo,
            winner: match.teams.home.winner,
          },
          away: {
            id: match.teams.away.id,
            name: match.teams.away.name,
            logo: match.teams.away.logo,
            winner: match.teams.away.winner,
          },
        },
        goals: {
          home: match.goals.home,
          away: match.goals.away,
        },
      };
    });

    return res.json({
      success: true,
      source: "API-Football",
      count: formattedMatches.length,
      data: formattedMatches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar partidas ao vivo.",
    });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});