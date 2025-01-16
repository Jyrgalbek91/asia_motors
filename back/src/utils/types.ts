import { UploadedFile } from "express-fileupload";
import { Schema } from "jsonschema";

type IPin = number;

interface IUploadedFiles {
  [fieldName: string]: UploadedFile | UploadedFile[];
}

export { Schema, IPin, IUploadedFiles };
