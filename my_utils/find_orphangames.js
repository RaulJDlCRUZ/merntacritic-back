/* SCRIPT DE ELIMINACIÓN DE JUEGOS SIN RELACIÓN CON OTRAS COLECCIONES */
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ override: true });

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

async function findOrphanedGames() {
  try {
    const client = await MongoClient.connect(url);
    console.log("Conectado exitosamente al servidor MongoDB");
    const db = client.db(dbName);

    const totalGames = await db.collection("games").countDocuments();
    console.log(`Total de juegos en la base de datos: ${totalGames}`);

    console.log("\nIniciando búsqueda de juegos huérfanos...");

    const cursor = db.collection("games").aggregate([
    //   {
    //     $lookup: {
    //       from: "favs",
    //       localField: "slug",
    //       foreignField: "game",
    //       as: "favsRefs",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "longtobeat",
    //       localField: "slug",
    //       foreignField: "game",
    //       as: "longToBeatRefs",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "rankings",
    //       localField: "slug",
    //       foreignField: "game",
    //       as: "rankingsRefs",
    //     },
    //   },
      {
        $lookup: {
          from: "reviews",
          localField: "slug",
          foreignField: "game",
          as: "reviewsRefs",
        },
      },
    //   {
    //     $lookup: {
    //       from: "sales",
    //       localField: "slug",
    //       foreignField: "game",
    //       as: "salesRefs",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "awards",
    //       localField: "title",
    //       foreignField: "game",
    //       as: "awardsRefs",
    //     },
    //   },
      {
        $match: {
          $and: [
            // { favsRefs: { $size: 0 } },
            // { longToBeatRefs: { $size: 0 } },
            // { rankingsRefs: { $size: 0 } },
            { reviewsRefs: { $size: 0 } },
            // { salesRefs: { $size: 0 } },
            // { awardsRefs: { $size: 0 } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
        },
      },
    ]);

    let count = 0;
    const orphanedGames = [];

    // Procesar los resultados uno por uno
    for await (const game of cursor) {
      count++;
      orphanedGames.push(game);

      console.log(`\nJuego huérfano #${count} encontrado:`);
      console.log(`Título: ${game.title}`);
      console.log(`Slug: ${game.slug}`);
      console.log(`ID: ${game._id}`);
      console.log("------------------------");
    }

    console.log("\n=== RESUMEN FINAL ===");
    console.log(`Total de juegos procesados: ${totalGames}`);
    console.log(`Juegos huérfanos encontrados: ${count}`);
    console.log(`Porcentaje: ${((count / totalGames) * 100).toFixed(2)}%`);

    await client.close();
    console.log("\nConexión cerrada");
  } catch (err) {
    console.error("Error:", err);
  }
}

findOrphanedGames();
