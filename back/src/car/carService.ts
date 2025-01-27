import path from "path";
import Config from "../utils/config";
import db from "../utils/db";
import fs from "fs";

const ALLOW_HOST = Config.ALLOW_HOST;
const FILE_CAR_IMAGES_URL = Config.FILE_CAR_IMAGES_URL;
const FILE_CAR_IMAGES_PATH = process.env.FILE_CAR_IMAGES_PATH;

async function createCarImage(
  id_vehicle: number,
  id_color: number,
  id_size: number,
  images: string[]
) {
  try {
    const result_message = "";
    const { error, rows } = await db.query(
      `CALL p_car_images_ins($1::integer, $2::integer, $3::integer, $4::text[], $5::text)`,
      [id_vehicle, id_color, id_size, images, result_message]
    );
    if (error) {
      console.error("Error while inserting post:", error);
      return false;
    }

    return rows;
  } catch (error) {
    console.error("Error in create:", error.message);
    return false;
  }
}

async function getCarImages(
  id_vehicle: number,
  id_color: number,
  id_size: number
) {
  try {
    const { error, rows } = await db.query(
      `SELECT ci.id_car_image, ci.image_name FROM car_image ci 
       JOIN car c USING(id_car)
       WHERE c.id_vehicle = $1 AND c.id_color = $2 AND c.id_size = $3
       ORDER BY id_car_image;`,
      [id_vehicle, id_color, id_size]
    );
    
    if (error) {
      return false;
    }

    if (!rows || rows.length === 0) {
      console.log("No images found.");
      return []; 
    }

    const data = rows.map((car: any) => ({
      ...car,
      image_name: car.image_name
        ? `${ALLOW_HOST}${FILE_CAR_IMAGES_URL}image-${car.image_name}`
        : null,
    }));

    return data;
  } catch (error) {
    console.log("error getCarImages: ", error.message);
    return false;
  }
}

async function deleteCarById(id_car: number) {
  try {
    const { rows: images } = await db.query(
      `SELECT image_name FROM car_image WHERE id_car = $1`,
      [id_car]
    );

    if (images.length > 0) {
      images.forEach((image: any) => {
        const imagePath = path.join(
          `${FILE_CAR_IMAGES_PATH}image-${image.image_name}`
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await db.query(`DELETE FROM car_image WHERE id_car = $1`, [id_car]);
    }

    await db.query(`DELETE FROM car WHERE id_car = $1`, [id_car]);

    return true;
  } catch (error) {
    console.error("Error deleting deleteCarById: ", error);
    return false;
  }
}


const carService = {
  createCarImage,
  getCarImages,
  deleteCarById,
};
export default carService;
