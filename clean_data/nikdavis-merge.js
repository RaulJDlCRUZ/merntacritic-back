import {
  readCSVFile,
  createCSVWriter,
} from "../utils.js";

const directory_nikdavis = "./origin_csv/nik-davis/";

const description = directory_nikdavis + "steam_description_data.csv";
const media = directory_nikdavis + "steam_media_data.csv";
const requirements = directory_nikdavis + "steam_requirements_data.csv";
const support = directory_nikdavis + "steam_support_info.csv";
const games = directory_nikdavis + "steam.csv";

const outFilePath = "./filtered_csv/nikdavis-merge.csv";

async function createCSV() {
  try {
    /* Leer archivos CSV */
    const jsonArrayGames = await readCSVFile(games);
    const jsonArrayDescription = await readCSVFile(description);
    const jsonArrayMedia = await readCSVFile(media);
    const jsonArrayRequirements = await readCSVFile(requirements);
    const jsonArraySupport = await readCSVFile(support);

    console.log("[i] Archivos CSV leidos");

    /* Obtener headers */
    const headersGames = Object.keys(jsonArrayGames[0]);
    const headersDescription = Object.keys(jsonArrayDescription[0]);
    const headersMedia = Object.keys(jsonArrayMedia[0]);
    const headersRequirements = Object.keys(jsonArrayRequirements[0]);
    const headersSupport = Object.keys(jsonArraySupport[0]);

    console.log("[i] Headers obtenidos");

    /* Concatenar headers (solo con uno de ellos el ID será pedido) */
    const finalheaders = [
      ...headersGames,
      ...headersDescription.slice(1),
      ...headersMedia.slice(1),
      ...headersRequirements.slice(1),
      ...headersSupport.slice(1),
    ];
    console.log("[i] Headers concatenados");

    const csvWriter = createCSVWriter(outFilePath, finalheaders);

    for (const game of jsonArrayGames) {
      const gameId = game.appid;
      //   console.log(`${gameId}`);

      const descriptionData =
        jsonArrayDescription.find((item) => item.steam_appid === gameId) || {};
      const mediaData =
        jsonArrayMedia.find((item) => item.steam_appid === gameId) || {};
      const requirementsData =
        jsonArrayRequirements.find((item) => item.steam_appid === gameId) || {};
      const supportData =
        jsonArraySupport.find((item) => item.steam_appid === gameId) || {};

      const record = {
        ...game,
        ...descriptionData,
        ...mediaData,
        ...requirementsData,
        ...supportData,
      };

      await csvWriter.writeRecords([record]);
    }
  } catch (error) {
    console.error(error);
  }
}

// Mucho rato escribiendo datos!!!
createCSV();
