import { Request, Response } from "express";
import PostService from "./postService";
import validate from "../utils/validate";
import postSchema from "./postSchema";
import FileService from "../services/FileService";
import Config from "../utils/config";
import File from "../utils/file";
import TokenService from "../utils/jwt";

const FILE_POST_PATH = Config.FILE_POST_PATH;

class PostController {
  async getPostByIdController(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const idPost = Number(id);
      const result = await PostService.getPostById(idPost);
      if (!result)
        return res
          .status(404)
          .json({ message: "Новости или акции не найдены" });
      return res.status(200).json(result);
    } catch (error) {
      console.error("error getNewsController: ", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAllPostsController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, offset = 12 } = req.query;
      const idType = Number(id);
      const pageNumber = Number(page);
      const offsetNumber = Number(offset);
  
      if (isNaN(pageNumber) || isNaN(offsetNumber)) {
        return res.status(400).json({ message: "Некорректные параметры" });
      }
  
      const authHeader = req.headers.authorization;
      
      let isAdmin = false; 
  
      if (authHeader) {
        const resultToken = TokenService.getTokenData(authHeader);
        console.log(resultToken);
        if (resultToken === false) {
          return res.status(400).json({ message: "Invalid or missing token" });
        }
          const roles = resultToken.r || [];
          isAdmin = roles.some((role: any) => role.role_name === "ADMIN");
      }
      console.log(isAdmin)
  
      const result = await PostService.getAllPosts(
        idType,
        pageNumber,
        offsetNumber,
        isAdmin
      );
  
      if (!result) {
        return res.status(404).json({ message: "Новости не найдены" });
      }
  
      return res.status(200).json(result);
    } catch (error) {
      console.error("error getAllPostsController: ", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }  

  async createController(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, postSchema.postSchema);
      if (!isValid) return res.status(400).json({ message: "Неверный формат" });

      const { id_type, title, description, images, date } = req.body;

      const idUser = Number(req.user?.id);
      if (!idUser) {
        return res.status(404).json({ message: "У вас нет доступа" });
      }

      const uploadedImages: string[] = [];

      if (req.files && req.files.images) {
        const imagesArray = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of imagesArray) {
          const result = await FileService.saveFile({
            path: FILE_POST_PATH,
            fileName: file.name,
            sampleFile: file,
            type: "image",
          });

          if (result.error) {
            return res.status(400).json({ message: "Ошибка загрузки файла" });
          }

          uploadedImages.push(result.dbFileName);
        }
      }

      const postDate = date ? date : new Date().toISOString();

      const result = await PostService.create(
        id_type,
        title,
        description,
        uploadedImages.length > 0 ? uploadedImages : images,
        postDate
      );

      if (!result) {
        return res.status(404).json({ message: "Ошибка создания поста" });
      }

      return res.status(200).json({ message: "Пост успешно создан", result });
    } catch (error) {
      console.error("Ошибка в createController: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async showImage(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName;
      const path = FILE_POST_PATH + fileName;
      const existFile = await File.exists(path);
      console.log(await File.exists(path));
      if (existFile) return res.sendFile(path);
      else return res.status(400).json({ message: "Файл не найден" });
    } catch (error) {
      console.log("error showFile: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async deletePost(req: Request, res: Response) {
    const { id_post } = req.params;

    if (isNaN(Number(id_post))) {
      return res.status(400).json({ message: "Неверный формат ID" });
    }

    const result = await PostService.deletePostById(Number(id_post));

    if (result) {
      return res.status(200).json({ message: "Успешно удалено" });
    } else {
      return res.status(500).json({ message: "Ошибка при удалении" });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const { id_post } = req.params;
      const data = req.body;
  
      if (isNaN(Number(id_post))) {
        return res.status(400).json({ message: "Неверный формат ID" });
      }
  
      if (typeof data.images_to_delete === "string") {
        data.images_to_delete = data.images_to_delete
          .split(",")
          .map((id: string) => Number(id.trim()))
          .filter((id: number) => !isNaN(id));
      }
  
      if (data.date && isNaN(Date.parse(data.date))) {
        return res.status(400).json({ message: "Неверный формат даты" });
      }
  
      const uploadedImages: string[] = [];
      if (req.files && req.files.images) {
        const imagesArray = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];
  
        for (const file of imagesArray) {
          const result = await FileService.saveFile({
            path: FILE_POST_PATH,
            fileName: file.name,
            sampleFile: file,
            type: "image",
          });
  
          if (result.error) {
            return res.status(400).json({ message: "Ошибка загрузки файла" });
          }
  
          uploadedImages.push(result.dbFileName);
        }
      }
  
      data.images = uploadedImages.map((imageName) => ({
        image_name: imageName,
      }));
  
      const result = await PostService.updatePostById(Number(id_post), data);
  
      if (result) {
        return res.status(200).json({ message: "Успешно обновлено" });
      } else {
        return res.status(500).json({ message: "Ошибка обновления" });
      }
    } catch (error) {
      console.error("Error in updatePost:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }  

  async similarArticlesController(req: Request, res: Response) {
    try {
      const { id_type, title, id } = req.query;
      const data = await PostService.similarArticles(Number(id_type), String(title), Number(id));
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error similarArticlesController: ", error.message);
      return false;
    }
  }
}

export default new PostController();
