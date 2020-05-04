import * as db from '../database';

export async function plants(args) {
  console.log(args);
}

export async function updatePlants(args) {
  const { author, plants } = args;

  console.log('Push Plant');

  const updatePlants = await Promise.all(
    plants.map(async (p: PlantDescription) => {
      p.meta.authorID = author;
      await db.updatePlant(p);
    }),
  );

  return updatePlants;
}

export async function plant(args) {}

export async function user(args) {}

export async function createUser(args) {}

export async function getUpdatedPlants(args) {
  if (args.author) {
    const plantsByAuthor = await db.getPlants({ author: args.author });

    if (plantsByAuthor.length) {
      const plantMap = plantsByAuthor.reduce(
        (result, plant: PlantDescription) => {
          result[plant.meta.id] = plant; //a, b, c
          return result;
        },
        {},
      );

      console.log(plantMap);

      return [];
    } else {
      return [];
    }
  } else {
    return [];
  }
}
