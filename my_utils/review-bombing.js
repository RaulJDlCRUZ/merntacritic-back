import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ override: true });

let API_URL = process.env.API_URL + "/reviews/secure";
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const REVIEW_INTERVAL = 15000; // 15 segundos
const CANDIDATE_GAMES = [
  "the-legend-of-zelda-ocarina-of-time-n64",
  "grand-theft-auto-v-ps3",
  "super-mario-64-n64",
];
const BAD_COMMENTS = [
  "Es una basura",
  "No merece la pena",
  "Es una vergüenza",
  "Quiero mi dinero de vuelta, me siento estafado",
];

/* Función para generar nicknames aleatorios */
function generateRandomNickname() {
  const adjectives = [
    "Quick",
    "Lazy",
    "Happy",
    "Sad",
    "Angry",
    "Brave",
    "Clever",
    "Witty",
  ];
  const nouns = ["Fox", "Dog", "Cat", "Mouse", "Bear", "Lion", "Tiger", "Wolf"];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 10000);

  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

/* Función para seleccionar un juego candidato al azar */
function getRandomCandidateGame() {
  const randomIndex = Math.floor(Math.random() * CANDIDATE_GAMES.length);
  return CANDIDATE_GAMES[randomIndex];
}

/* Función para seleccionar un comentario malo al azar */
function getRandomBadComment() {
  const randomIndex = Math.floor(Math.random() * BAD_COMMENTS.length);
  return BAD_COMMENTS[randomIndex];
}

/* Función para generar un token JWT */
function generateToken() {
  if (!TOKEN_SECRET) {
    console.error("TOKEN_SECRET no está configurado en el .env");
    process.exit(1);
  }

  const payload = {
    system: "reviewPoster", // Identificador del sistema
  };

  const options = {
    expiresIn: "1h", // Duración del token
  };

  const token = jwt.sign(payload, TOKEN_SECRET, options);
  console.log("Token generado con éxito:", token);
  return token;
}

/* Función para enviar una reseña securizada */
async function postReview(token) {
  const myuser = generateRandomNickname();
  const mygame = getRandomCandidateGame();
  const mycomment = getRandomBadComment();
  const reviewData = {
    game: mygame,
    username: myuser,
    review_text: mycomment,
    review_score: 0,
    hours_played: 0,
    recommendation: "Not Recommended",
    review_votes: 0,
    date: new Date(),
  };

  console.log(reviewData);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Usa el token generado
      },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Review publicada con éxito:", data);
    } else {
      const errorData = await response.json();
      console.error("Error al publicar la review:", errorData);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

/* Función principal que lo coordina todo */
async function main() {
  console.log(API_URL);
  const token = generateToken();
  console.log(`Enviando reviews cada ${REVIEW_INTERVAL / 1000} segundos...\n`);
  setInterval(async () => {
    console.log(
      `\nPublicando nueva reseña a las ${new Date().toLocaleTimeString()}...`
    );
    await postReview(token);
  }, REVIEW_INTERVAL);
}

// Ejecutar la función principal
main();
