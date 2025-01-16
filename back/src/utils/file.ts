import fs from "fs";

<<<<<<< HEAD
const exists = async (filePath: string) => {
  console.log('Параметр filePath:', filePath);  // Логируем параметр
  return !!(await fs.promises.stat(filePath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);  // Логируем ошибку, если DEBUG_MODE включен
    }
    return false;
  }));
};

=======
const exists = async (filePath: string) =>
  !!(await fs.promises.stat(filePath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);
    }
    return false;
  }));
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c

const deleteFile = async (filePath: string) =>
  await fs.promises.unlink(filePath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);
    }
    return false;
  });

const listDir = async (dirPath: string) =>
  await fs.promises.readdir(dirPath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);
    }
    return [];
  });

const write = async (filePath: string, content: string) =>
  await fs.promises.writeFile(filePath, content, "utf8");

const read = async (filePath: string) =>
  await fs.promises.readFile(filePath, "utf8");

// require("fs").readFile("FILE.TXT", "utf8", (err, data) => { console.log(data); });

const File = { exists, deleteFile, listDir, write, read };

export default File;
