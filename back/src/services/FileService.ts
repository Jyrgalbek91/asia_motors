import { UploadedFile } from "express-fileupload";
import File from "../utils/file";
import { v4 as uuidv4 } from 'uuid';

type ITypeFile = "image" | "file";

export interface ISaveFileResult {
  error: boolean;
  dbFileName: string;
}

interface ISaveFile {
  path: string;
  fileName: string;
  sampleFile: UploadedFile;
  ALLOWED_EXTENSIONS?: string[];
  type: ITypeFile;
  allowTypePrefix?: boolean;
}

async function saveFile({
  path,
  sampleFile,
  ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"],
  type,
  allowTypePrefix = true,
}: ISaveFile): Promise<ISaveFileResult> {
  try {
    if (!sampleFile || !sampleFile.name) {
      console.error("Ошибка: файл не передан или имеет некорректную структуру");
      return { error: true, dbFileName: "" };
    }

    const ext = sampleFile.name.split(".").pop();
    if (!ext) return { error: true, dbFileName: "" };

    if (!ALLOWED_EXTENSIONS.includes(ext)) return { error: true, dbFileName: "" };

    const uniqueName = `${uuidv4()}.${ext}`;
    const realUploadPath = `${path}${allowTypePrefix ? `${type}-` : ""}${uniqueName}`;

    await sampleFile.mv(realUploadPath);
    return { error: false, dbFileName: uniqueName };
  } catch (error) {
    console.log("error saveFile: ", error.message);
    return { error: true, dbFileName: "" };
  }
}


async function removeFile(path: string, fileName: string) {
  File.deleteFile(`${path}${fileName}`);
}

const FileService = {
  saveFile,
  removeFile,
};

export default FileService;
