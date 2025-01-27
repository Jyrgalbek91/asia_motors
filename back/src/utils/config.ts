import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 9000;
const NODE_ENV = process.env.NODE_ENV || "development";

//jwt
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_EXPIRE_HOURS = process.env.JWT_EXPIRE_HOURS || "30h";

//database
const DBUSER = process.env.DBUSER || "postgres";
const DBPASS = process.env.DBPASS || "postgres";
const DBSERVER = process.env.DBSERVER || "localhost";
const DBPORT = process.env.DBPORT || 5432;
const DBNAME = process.env.DBNAME || "hyundai";
const DBNAME2 = process.env.DBNAME2 || "postgres";
const DBPG_MAX_CONNECTIONS = process.env.DBPG_MAX_CONNECTIONS || 20;
const DBPG_IDLETIMEOUTMILLLIS = process.env.DBPG_IDLETIMEOUTMILLLIS || 30000;
const DBPG_CONNECTIONTIMEOUTMILLES =
  process.env.DBPG_CONNECTIONTIMEOUTMILLES || 2000;

//role_admin
const ID_ADMIN_ROLE = Number(process.env.ID_ADMIN_ROLE) || 1;

//cors
const ALLOW_HOST = process.env.ALLOW_HOST || `http://localhost:${PORT}`;

const ALLOW_HOST_LIST: string[] = (
  process.env.ALLOW_HOST_LIST
    ? JSON.parse(process.env.ALLOW_HOST_LIST)
    : [ALLOW_HOST]
) as string[];

//file
const FILE_POST_PATH = process.env.FILE_POST_PATH || "";
const FILE_POST_URL = process.env.FILE_POST_URL || "";
const FILE_VEHICLE_PATH = process.env.FILE_VEHICLE_PATH || "";
const FILE_VEHICLE_URL = process.env.FILE_VEHICLE_URL || "";
const PDF_FILE_PATH = process.env.PDF_FILE_PATH || "";
const PDF_FILE_URL = process.env.PDF_FILE_URL || "";

const FILE_CAR_IMAGES_PATH = process.env.FILE_CAR_IMAGES_PATH || "";
const FILE_CAR_IMAGES_URL = process.env.FILE_CAR_IMAGES_URL || "";

const EMAIL_JWT_EXPIRE_HOURSE = process.env.EMAIL_JWT_EXPIRE_HOURSE || "1000h";

const Config = {
  PORT,
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_EXPIRE_HOURS,
  DBUSER,
  DBPASS,
  DBSERVER,
  DBPORT,
  DBNAME,
  DBNAME2,
  DBPG_MAX_CONNECTIONS,
  DBPG_IDLETIMEOUTMILLLIS,
  DBPG_CONNECTIONTIMEOUTMILLES,
  ALLOW_HOST,
  ALLOW_HOST_LIST,
  ID_ADMIN_ROLE,
  FILE_POST_PATH,
  FILE_POST_URL,
  FILE_VEHICLE_PATH,
  FILE_VEHICLE_URL,
  PDF_FILE_PATH,
  PDF_FILE_URL,
  EMAIL_JWT_EXPIRE_HOURSE,
  FILE_CAR_IMAGES_PATH,
  FILE_CAR_IMAGES_URL,
};

export default Config;
