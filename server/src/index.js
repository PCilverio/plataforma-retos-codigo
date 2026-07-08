import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 🔒 REQUERIMIENTO: Configuración de CORS para permitir al cliente Astro (Puerto 4321)
app.use(cors({
  origin: 'http://localhost:4321'
}));

app.use(express.json());

// Datos estáticos temporales para simular la base de datos
const mockChallenges = [
  { id: "1", title: "Reverse a String", description: "Escribe una función que invierta una cadena de texto.", difficulty: "Easy" },
  { id: "2", title: "Two Sum", description: "Dado un array de enteros, devuelve los índices de los dos números que sumen el objetivo.", difficulty: "Medium" }
];

const mockSubmissions = [];

// 📋 ENDPOINT 1: GET /api/challenges
app.get('/api/challenges', (req, res) => {
  try {
    res.json(mockChallenges);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor al obtener retos" });
  }
});

app.post('/api/submissions', (req, res) => {
  const { challengeId, code } = req.body;
  
  if (!challengeId || !code) {
    return res.status(400).json({ error: "Faltan campos obligatorios: challengeId y code." });
  }

  try {
    const newSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      challengeId,
      code,
      status: code.includes("return") ? "Accepted" : "Wrong Answer",
      createdAt: new Date()
    };

    mockSubmissions.push(newSubmission);
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: "Error interno al procesar el envío" });
  }
});

app.listen(PORT, () => {
  console.log(` API del Servidor corriendo en http://localhost:${PORT}`);
});