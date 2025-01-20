var app;(()=>{"use strict";var e={7806:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(7252)),n=s(r(7174)),o=s(r(6898)),i=s(r(8577)),l=s(r(6376)),u=s(r(218)),d=s(r(5260)),c=s(r(3978)),f=s(r(4251)),_=s(r(2652)),p=r(4664),m=s(r(6799)),g=(0,a.default)();(async()=>{try{const e=d.default.PORT;g.use((0,i.default)(f.default)),g.use(_.default),g.use(c.default),g.use(a.default.json()),g.use((0,n.default)()),g.use((0,o.default)()),g.use((0,l.default)()),g.use(m.default),g.use("/",a.default.static("public")),g.use("/",u.default),g.listen(e,(async()=>{console.log("Application listening on port: ",e),await(0,p.connectionCheck)()}))}catch(e){console.log("error startServer: ",e.message)}})()},2945:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(4122));t.default=a.default},1235:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(1460)),n=s(r(8416)),o=s(r(6716)),i=s(r(5946)),l=s(r(5260)),u=s(r(5560)),d=l.default.FILE_POST_PATH;t.default=new class{async getPostByIdController(e,t){try{const{id:r}=e.query,s=Number(r),n=await a.default.getPostById(s);return n?t.status(200).json(n):t.status(404).json({message:"Новости или акции не найдены"})}catch(e){return console.error("error getNewsController: ",e.message),t.status(500).json({message:"Internal Server Error"})}}async getAllPostsController(e,t){try{const{id:r}=e.params,{page:s=1,offset:n=12}=e.query,o=Number(r),i=Number(s),l=Number(n);if(isNaN(i)||isNaN(l))return t.status(400).json({message:"Некорректные параметры"});const u=await a.default.getAllPosts(o,i,l);return u?t.status(200).json(u):t.status(404).json({message:"Новости не найдены"})}catch(e){return console.error("error getAllPostsController: ",e.message),t.status(500).json({message:"Internal Server Error"})}}async createController(e,t){var r;try{if(!(0,n.default)(e.body,o.default.postSchema))return t.status(400).json({message:"Неверный формат"});const{id_type:s,title:l,description:u,images:c}=e.body;if(!Number(null===(r=e.user)||void 0===r?void 0:r.id))return t.status(404).json({message:"У вас нет доступа"});const f=[];if(e.files&&e.files.images){const r=Array.isArray(e.files.images)?e.files.images:[e.files.images];for(const e of r){const r=await i.default.saveFile({path:d,fileName:e.name,sampleFile:e,type:"image"});if(r.error)return t.status(400).json({message:"Ошибка загрузки файла"});f.push(r.dbFileName)}}const _=await a.default.create(s,l,u,f.length>0?f:c);return _?t.status(200).json({message:"Пост успешно создан",result:_}):t.status(404).json({message:"Ошибка создания поста"})}catch(e){return console.error("Ошибка в createController: ",e.message),t.status(500).json({message:"Ошибка сервера"})}}async showImage(e,t){try{const r=e.params.fileName,s=d+r,a=await u.default.exists(s);return console.log(await u.default.exists(s)),a?t.sendFile(s):t.status(400).json({message:"Файл не найден"})}catch(e){return console.log("error showFile: ",e.message),t.status(500).json({message:"Ошибка сервера"})}}async deletePost(e,t){const{id_post:r}=e.params;return isNaN(Number(r))?t.status(400).json({message:"Неверный формат ID"}):await a.default.deletePostById(Number(r))?t.status(200).json({message:"Успешно удалено"}):t.status(500).json({message:"Ошибка при удалении"})}async updatePost(e,t){try{const{id_post:r}=e.params,s=e.body;if(isNaN(Number(r)))return t.status(400).json({message:"Неверный формат ID"});"string"==typeof s.images_to_delete&&(s.images_to_delete=s.images_to_delete.split(",").map((e=>Number(e.trim()))).filter((e=>!isNaN(e))));const n=[];if(e.files&&e.files.images){const r=Array.isArray(e.files.images)?e.files.images:[e.files.images];for(const e of r){const r=await i.default.saveFile({path:d,fileName:e.name,sampleFile:e,type:"image"});if(r.error)return t.status(400).json({message:"Ошибка загрузки файла"});n.push(r.dbFileName)}}return s.images=n.map((e=>({image_name:e}))),await a.default.updatePostById(Number(r),s)?t.status(200).json({message:"Успешно обновлено"}):t.status(500).json({message:"Ошибка обновления"})}catch(e){return console.error("Error in updatePost:",e),t.status(500).json({message:"Internal server error"})}}async similarArticlesController(e,t){try{const{title:r,id:s}=e.query,n=await a.default.similarArticles(String(r),Number(s));return n?t.status(200).json({message:"Успешно",data:n}):t.status(400).json({message:"Ошибка"})}catch(e){return console.log("error similarArticlesController: ",e.message),!1}}}},4122:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(7252)),n=s(r(1235)),o=s(r(780)),i=a.default.Router();i.get("/get/id",n.default.getPostByIdController),i.post("/create",o.default.isAdminToken,n.default.createController),i.get("/similar",n.default.similarArticlesController),i.get("/get/:id",n.default.getAllPostsController),i.get("/image_file/show/:fileName",n.default.showImage),i.delete("/delete/:id_post",n.default.deletePost),i.put("/update/:id_post",n.default.updatePost),t.default=i},6716:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default={postSchema:{type:"object",properties:{id_type:{type:"string",minLength:1,required:!0},title:{type:"string",minLength:6},description:{type:"string",minLength:6},images:{type:"array",items:{type:"string"}}}}}},1460:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(6928)),n=s(r(5260)),o=s(r(4664)),i=s(r(9896)),l=n.default.ALLOW_HOST,u=n.default.FILE_POST_URL,d=n.default.FILE_POST_PATH,c={getPostById:async function(e){try{const{error:t,rows:r}=await o.default.query("SELECT \n         p.id AS post_id, \n         p.id_type, \n         pt.type_name,\n         p.title, \n         p.description, \n         p.date, \n         p.updated_at, \n         p.active, \n         g.id_image, \n         g.image_name \n       FROM post p \n       JOIN image g ON p.id = g.id_post\n       JOIN post_type pt ON pt.id_post_type = p.id_type\n       WHERE p.id = $1;",[e]);return!t&&0!==r.length&&{id:r[0].post_id,id_type:r[0].id_type,type_name:r[0].type_name,title:r[0].title,description:r[0].description,date:r[0].date,updated_at:r[0].updated_at,active:r[0].active,images:r.map((e=>({id_image:e.id_image,image_name:e.image_name?`${l}${u}image-${e.image_name}`:null})))}}catch(e){return console.log("error getPostById: ",e.message),!1}},getAllPosts:async function(e,t,r){try{const s=r,a=(t-1)*r,{error:n,rows:i}=await o.default.query("SELECT COUNT(*) AS total\n       FROM post \n       WHERE active = true\n         AND id_type = $1;",[e]);if(n||0===i.length)return!1;const d=parseInt(i[0].total,10),{error:c,rows:f}=await o.default.query("SELECT \n          p.id, \n          p.id_type, \n          pt.type_name,\n          p.title, \n          p.description, \n          p.\"date\", \n          p.updated_at, \n          p.active,\n          ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id_image, 'image_name', i.image_name)) AS images\n        FROM post p\n        JOIN image i ON i.id_post = p.id\n        JOIN post_type pt ON pt.id_post_type = p.id_type\n        WHERE p.active = true\n          AND p.id_type = $1\n        GROUP BY p.id, p.id_type, pt.type_name, p.title, p.description, p.\"date\", p.updated_at, p.active\n        ORDER BY p.updated_at DESC\n        LIMIT $2 OFFSET $3;",[e,s,a]);return!c&&{data:f.map((e=>Object.assign(Object.assign({},e),{images:e.images.map((e=>Object.assign(Object.assign({},e),{image_name:e.image_name?`${l}${u}image-${e.image_name}`:null})))}))),total:d,currentPage:t,totalPages:Math.ceil(d/s)}}catch(e){return console.log("error getAllPosts: ",e.message),!1}},create:async function(e,t,r,s){try{const a="",{error:n,rows:i}=await o.default.query("CALL p_insert_post($1, $2, $3, $4, $5);",[e,t,r,s,a]);return n?(console.error("Error while inserting post:",n),!1):i}catch(e){return console.error("Error in create:",e.message),!1}},deletePostById:async function(e){try{const{rows:t}=await o.default.query("SELECT image_name FROM image WHERE id_post = $1",[e]);return t.length>0&&(t.forEach((e=>{const t=a.default.join(`${d}image-${e.image_name}`);i.default.existsSync(t)&&i.default.unlinkSync(t)})),await o.default.query("DELETE FROM image WHERE id_post = $1",[e])),await o.default.query("DELETE FROM post WHERE id = $1",[e]),!0}catch(e){return console.error("Error deleting post and images:",e),!1}},updatePostById:async function(e,t){try{const{title:r,description:s,id_type:n,images_to_delete:l,images:u}=t,c=!0;let f=[],_=[];if(void 0!==r&&(f.push(`title = $${_.length+1}`),_.push(r)),void 0!==s&&(f.push(`description = $${_.length+1}`),_.push(s)),void 0!==n&&(f.push(`id_type = $${_.length+1}`),_.push(n)),f.push(`active = $${_.length+1}`),_.push(c),f.push("updated_at = NOW()"),f.length>0&&await o.default.query(`UPDATE post SET ${f.join(", ")} WHERE id = $${_.length+1}`,[..._,e]),l&&l.length>0){const{rows:e}=await o.default.query("SELECT image_name FROM image WHERE id_image = ANY($1)",[l]);e.forEach((e=>{const t=a.default.join(`${d}image-${e.image_name}`);i.default.existsSync(t)&&i.default.unlinkSync(t)})),await o.default.query("DELETE FROM image WHERE id_image = ANY($1)",[l])}if(u&&u.length>0){const t=u.map((t=>o.default.query("INSERT INTO image (id_post, image_name) VALUES ($1, $2)",[e,t.image_name])));await Promise.all(t)}return!0}catch(e){return console.error("Error updating post and images:",e),!1}},similarArticles:async function(e,t){try{const r=e.replace(/[^\w\sа-яА-Я]/g,"").split(" ").filter((e=>e.length>3)).join(" | "),{rows:s}=await o.default.query("SELECT p.id,\n              p.id_type,\n              p.title,\n              p.description,\n              p.\"date\",\n              p.updated_at,\n              p.active,\n              ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id_image, 'image_name', i.image_name)) AS images\n       FROM post p\n       JOIN image i ON p.id = i.id_post\n       WHERE p.id_type = 1 \n         AND p.tsv_content @@ to_tsquery('russian', $1)\n         AND p.id != $2\n       GROUP BY p.id, p.id_type, p.title, p.description, p.\"date\", p.updated_at, p.active\n       ORDER BY ts_rank(p.tsv_content, to_tsquery('russian', $1)) DESC\n       LIMIT 3;",[r,t]);return s.map((e=>Object.assign(Object.assign({},e),{images:e.images.map((e=>Object.assign(Object.assign({},e),{image_name:e.image_name?`${l}${u}image-${e.image_name}`:null})))})))}catch(e){return console.error("Error in similarArticles:",e.message),[]}}};t.default=c},6799:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(7252),n=s(r(5684)),o=s(r(2945)),i=s(r(1636)),l=s(r(5490)),u=(0,a.Router)().use("/user",n.default).use("/post",o.default).use("/storage",i.default).use("/shared",l.default);u.use(((e,t)=>{t.status(404).json({error:"API not found"})})),t.default=(0,a.Router)().use("/hyundai/api",u)},780:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(4572),n=s(r(5260)),o=s(r(3481)),i=(e,t)=>(0,a.sendError)(e,t,!1,401),l={isAdminToken:async(e,t,r)=>await(async(e,t,r,s)=>{try{const a=e.headers.authorization;if("development"===n.default.NODE_ENV&&console.log("token: ",a),!a)return i(t,e.t("token.notFound"));const l=o.default.getTokenData(a);if(!l)return i(t,e.t("token.invalid"));const u=Date.now();if("development"===n.default.NODE_ENV&&(console.log(Object.assign({},l)),console.log("Token expiration: ",new Date(l.exp)),console.log("Current timestamp: ",new Date(u)),console.log("Is token valid: ",l.exp>u)),l.exp<=u)return i(t,e.t("token.expired"));const d=l.r.map((e=>e.id_role));return await(async(e,t)=>{const r=new Set(e);for(let e of t)if(r.has(e))return!0;return!1})(d,s)?(e.user=l,r()):i(t,e.t("token.permission"))}catch(r){return console.error("CheckToken error:",r.message),i(t,e.t("token.invalid"))}})(e,t,r,[1])};t.default=l},5946:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(5560)),n=r(3903),o={saveFile:async function({path:e,sampleFile:t,ALLOWED_EXTENSIONS:r=["pdf","jpg","jpeg","png"],type:s,allowTypePrefix:a=!0}){try{if(!t||!t.name)return console.error("Ошибка: файл не передан или имеет некорректную структуру"),{error:!0,dbFileName:""};const o=t.name.split(".").pop();if(!o)return{error:!0,dbFileName:""};if(!r.includes(o))return{error:!0,dbFileName:""};const i=`${(0,n.v4)()}.${o}`,l=`${e}${a?`${s}-`:""}${i}`;return await t.mv(l),{error:!1,dbFileName:i}}catch(e){return console.log("error saveFile: ",e.message),{error:!0,dbFileName:""}}},removeFile:async function(e,t){a.default.deleteFile(`${e}${t}`)}};t.default=o},5490:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(7912));t.default=a.default},2669:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(3594)),n=r(4572);t.default=new class{async vehicleList(e,t){try{const r=await a.default.getVehicles();return r?(0,n.sendSuccess)(t,e.t("success"),r):(0,n.sendError)(t,e.t("error"))}catch(r){return(0,n.sendError)(t,e.t("error"))}}}},7912:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(7252)),n=s(r(2669)),o=a.default.Router();o.get("/vehicle",n.default.vehicleList),t.default=o},3594:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(4664));t.default={getVehicles:async function(){try{const{rows:e,error:t}=await a.default.query("SELECT DISTINCT(vehicle_name) FROM files;",[]);return!t&&e}catch(e){return console.log("error getCitizenship: ",e.message),!1}}}},1636:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(144));t.default=a.default},5125:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(8162)),n=s(r(5946)),o=s(r(5260)),i=s(r(5560)),l=o.default.PDF_FILE_PATH;t.default=new class{async saveFilesController(e,t){var r;try{const{vehicle_name:s,title:o}=e.query,i=null===(r=e.files)||void 0===r?void 0:r.file_name;if(!i)return t.status(400).json({message:"Файл отсутствует"});const u=Array.isArray(i)?i[0].name:i.name,{dbFileName:d,error:c}=await n.default.saveFile({path:l,fileName:u,sampleFile:Array.isArray(i)?i[0]:i,type:"file",allowTypePrefix:!1});if(c)return t.status(400).json({message:"Не удалось сохранить файл"});const f=await a.default.saveFiles(String(s),d,String(o));return f?t.status(200).json({message:"Успешно сохранено!",data:f}):t.status(400).json({message:"Ошибка сохранения файла!"})}catch(e){return console.log("error saveFilesController: ",e.message),!1}}async updateFilesController(e,t){var r;try{const{id_file:s}=e.params,o=e.body;if(isNaN(Number(s)))return t.status(400).json({message:"Неверный формат ID"});let i=null;const u=null===(r=e.files)||void 0===r?void 0:r.file_name;if(u){const e=Array.isArray(u)?u[0].name:u.name,{dbFileName:r,error:s}=await n.default.saveFile({path:l,fileName:e,sampleFile:Array.isArray(u)?u[0]:u,type:"file",allowTypePrefix:!1});if(s)return t.status(400).json({message:"Ошибка обновления PDF-файла"});i=r}return i&&(o.file_name=i),await a.default.updateFiles(Number(s),o)?t.status(200).json({message:"Успешно обновлено"}):t.status(500).json({message:"Ошибка обновления"})}catch(e){return console.error("Error in updateVehicle:",e.message),t.status(500).json({message:"Internal server error"})}}async showFile(e,t){try{const r=e.params.fileName,s=l+r,a=await i.default.exists(s);return console.log(await i.default.exists(s)),a?t.sendFile(s):t.status(400).json({message:"Файл не найден"})}catch(e){return console.log("error showFile: ",e.message),t.status(500).json({message:"Ошибка сервера"})}}async deleteStorageController(e,t){const{id_file:r}=e.params;return console.log(r),isNaN(Number(r))?t.status(400).json({message:"Неверный формат ID"}):await a.default.deleteStorageById(Number(r))?t.status(200).json({message:"Успешно удалено"}):t.status(500).json({message:"Ошибка при удалении"})}async getFilesController(e,t){try{const{vehicle_name:r}=e.query,s=await a.default.getFiles(String(r));return s?t.status(200).json({message:"Успешно",data:s}):t.status(400).json({message:"Ошибка получения файла"})}catch(e){return console.log("error getFilesController: ",e.message),!1}}async saveInfoFilesController(e,t){var r;try{const{vehicle_name:s}=e.query,o=null===(r=e.files)||void 0===r?void 0:r.file_name;if(!o)return t.status(400).json({message:"Файл отсутствует"});const i=Array.isArray(o)?o[0].name:o.name,{dbFileName:u,error:d}=await n.default.saveFile({path:l,fileName:i,sampleFile:Array.isArray(o)?o[0]:o,type:"file",allowTypePrefix:!1});if(d)return t.status(400).json({message:"Не удалось сохранить файл"});const c=await a.default.saveInfoFiles(String(s),u);return c?t.status(200).json({message:"Успешно сохранено!",data:c}):t.status(400).json({message:"Ошибка сохранения файла!"})}catch(e){return console.log("error saveFilesController: ",e.message),!1}}async getInfoFilesController(e,t){try{const{vehicle_name:r}=e.query,s=await a.default.getInfoFiles(String(r));return s?t.status(200).json({message:"Успешно",data:s}):t.status(400).json({message:"Ошибка получения файла"})}catch(e){return console.log("error getInfoFilesController: ",e.message),!1}}async deleteInfoStorageController(e,t){const{id_file:r}=e.params;return console.log(r),isNaN(Number(r))?t.status(400).json({message:"Неверный формат ID"}):await a.default.deleteInfoStorageById(Number(r))?t.status(200).json({message:"Успешно удалено"}):t.status(500).json({message:"Ошибка при удалении"})}}},144:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(7252)),n=s(r(5125)),o=a.default.Router();o.post("/save",n.default.saveFilesController),o.post("/save/info",n.default.saveInfoFilesController),o.get("/file",n.default.getFilesController),o.get("/file/info",n.default.getInfoFilesController),o.get("/pdf_file/show/:fileName",n.default.showFile),o.put("/update/:id_file",n.default.updateFilesController),o.delete("/delete/:id_file",n.default.deleteStorageController),o.delete("/delete/:id_file",n.default.deleteInfoStorageController),t.default=o},8162:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(6928)),n=s(r(4664)),o=s(r(9896)),i=s(r(5260)),l=i.default.PDF_FILE_PATH,u=i.default.ALLOW_HOST,d=i.default.PDF_FILE_URL,c={saveFiles:async function(e,t,r){try{const s="\n      SELECT id_file \n      FROM files \n      WHERE vehicle_name = $1 AND title = $2;\n    ",{rows:a}=await n.default.query(s,[e,r]);if(a.length>0){const e="\n        UPDATE files\n        SET file_name = $1\n        WHERE id_file = $2\n        RETURNING id_file;\n      ",{rows:r}=await n.default.query(e,[t,a[0].id_file]);return r}{const s="\n        INSERT INTO files(vehicle_name, file_name, title)\n        VALUES($1, $2, $3)\n        RETURNING id_file;\n      ",{rows:a}=await n.default.query(s,[e,t,r]);return a}}catch(e){return console.log("error saveFiles: ",e.message),!1}},updateFiles:async function(e,t){try{const{file_name:r,title:s}=t;let i=null,u=null;const{rows:d}=await n.default.query("SELECT file_name FROM files WHERE id_file = $1",[e]);if(d.length>0&&(i=d[0].file_name),r&&i&&i!==r){const e=a.default.join(l,i);o.default.existsSync(e)&&o.default.unlinkSync(e)}const c=[],f=[];return r&&(c.push("file_name = $"+(c.length+1)),f.push(r)),s&&(c.push("title = $"+(c.length+1)),f.push(s)),c.length>0&&(f.push(e),u=await n.default.query(`UPDATE files SET ${c.join(", ")} WHERE id_file = $${c.length+1}`,f)),u}catch(e){return console.log("error updateFiles: ",e.message),!1}},deleteStorageById:async function(e){try{const{rows:t}=await n.default.query("SELECT file_name FROM files WHERE id_file = $1",[e]);if(t.length>0&&t[0].file_name){const e=a.default.join(`${l}${t[0].file_name}`);o.default.existsSync(e)&&o.default.unlinkSync(e)}return await n.default.query("DELETE FROM files WHERE id_file = $1",[e]),!0}catch(e){return console.error("Error deleting pdf:",e),!1}},getFiles:async function(e){try{const{error:t,rows:r}=await n.default.query("SELECT id_file, title, file_name FROM files\n       WHERE vehicle_name = $1;",[e]);return!t&&r.map((e=>Object.assign(Object.assign({},e),{file_name:`${u}${d}${e.file_name}`})))}catch(e){return console.log("error getFiles: ",e.message),!1}},saveInfoFiles:async function(e,t){try{const{error:r,rows:s}=await n.default.query("INSERT INTO files(vehicle_name, file_name)\n             VALUES($1, $2)\n             RETURNING id_file;",[e,t]);return!r&&s}catch(e){return console.log("error saveInfoFiles: ",e.message),!1}},getInfoFiles:async function(e){try{const{error:t,rows:r}=await n.default.query("SELECT id_file, file_name FROM files\n       WHERE vehicle_name = $1;",[e]);return!t&&r.map((e=>Object.assign(Object.assign({},e),{file_name:`${u}${d}${e.file_name}`})))}catch(e){return console.log("error getInfoFiles: ",e.message),!1}},deleteInfoStorageById:async function(e){try{const{rows:t}=await n.default.query("SELECT file_name FROM files WHERE id_file = $1",[e]);if(t.length>0&&t[0].file_name){const e=a.default.join(`${l}${t[0].file_name}`);o.default.existsSync(e)&&o.default.unlinkSync(e)}return await n.default.query("DELETE FROM files WHERE id_file = $1",[e]),!0}catch(e){return console.error("Error deleting pdf:",e),!1}}};t.default=c},5684:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(2828));t.default=a.default},5905:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(4572),n=s(r(8416)),o=s(r(5260)),i=s(r(3481)),l=s(r(5574)),u=s(r(3410));t.default=new class{async login(e,t){try{if(!(0,n.default)(e.body,u.default.loginSchema))return(0,a.sendError)(t,e.t("inValidFormat"));const{login:r,password:s}=e.body,d=await l.default.userLogin(r,s);if(d&&d.id){const r=Date.now()+60*parseInt(o.default.JWT_EXPIRE_HOURS)*60*1e3,s=Array.isArray(d.role)?d.role:[d.role],n=i.default.generateAccessToken({id:d.id,r:s,s:d.surname,n:d.name,exp:r});if(!n)return(0,a.sendError)(t,e.t("token.generateError"));if(d)return(0,a.sendSuccess)(t,e.t("success"),{id:d.id,r:s,s:d.surname,n:d.name,exp:r,token:n,tokenType:"Bearer",expiresIn:60*parseInt(o.default.JWT_EXPIRE_HOURS)})}return(0,a.sendError)(t,e.t("unauth"),!1,401)}catch(r){return console.log("error login: ",r.message),(0,a.sendError)(t,e.t("error"),!1,400)}}}},2828:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(7252)),n=s(r(5905)),o=a.default.Router();o.post("/login",n.default.login),t.default=o},3410:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default={loginSchema:{type:"object",properties:{login:{type:["string","number"],required:!0,minLength:1},password:{type:"string",required:!0,minLength:1}}}}},5574:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(7265),n=s(r(4664)),o={userLogin:async function(e,t){try{const r=(0,a.md5)(t),{rows:s,rowCount:o}=await n.default.query("SELECT * FROM public.fn_auth($1, $2);",[e,r]);if(o&&o>0){const{id_user:e,roles:t,surname:r,name:a}=s[0];return{id:e,role:t,surname:r,name:a}}return!1}catch(e){return console.log("error userLogin: ",e.message),!1}}};t.default=o},5260:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),s(r(818)).default.config();const a=Number(process.env.PORT)||9e3,n=process.env.JWT_ACCESS_SECRET||"",o=process.env.JWT_EXPIRE_HOURS||"30h",i=process.env.DBUSER||"postgres",l=process.env.DBPASS||"postgres",u=process.env.DBSERVER||"localhost",d=process.env.DBPORT||5432,c=process.env.DBNAME||"hyundai",f=process.env.DBNAME2||"postgres",_=process.env.DBPG_MAX_CONNECTIONS||20,p=process.env.DBPG_IDLETIMEOUTMILLLIS||3e4,m=process.env.DBPG_CONNECTIONTIMEOUTMILLES||2e3,g=Number(process.env.ID_ADMIN_ROLE)||1,y=process.env.ALLOW_HOST||`http://localhost:${a}`,E={PORT:a,NODE_ENV:"production",JWT_ACCESS_SECRET:n,JWT_EXPIRE_HOURS:o,DBUSER:i,DBPASS:l,DBSERVER:u,DBPORT:d,DBNAME:c,DBNAME2:f,DBPG_MAX_CONNECTIONS:_,DBPG_IDLETIMEOUTMILLLIS:p,DBPG_CONNECTIONTIMEOUTMILLES:m,ALLOW_HOST:y,ALLOW_HOST_LIST:process.env.ALLOW_HOST_LIST?JSON.parse(process.env.ALLOW_HOST_LIST):[y],ID_ADMIN_ROLE:g,FILE_POST_PATH:process.env.FILE_POST_PATH||"",FILE_POST_URL:process.env.FILE_POST_URL||"",FILE_VEHICLE_PATH:process.env.FILE_VEHICLE_PATH||"",FILE_VEHICLE_URL:process.env.FILE_VEHICLE_URL||"",PDF_FILE_PATH:process.env.PDF_FILE_PATH||"",PDF_FILE_URL:process.env.PDF_FILE_URL||"",EMAIL_JWT_EXPIRE_HOURSE:process.env.EMAIL_JWT_EXPIRE_HOURSE||"1000h"};t.default=E},4251:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(5260));t.default=function(e,t){let r;r=-1!==a.default.ALLOW_HOST_LIST.indexOf(e.headers.origin||"")?{origin:!0,credentials:!0}:{origin:!1},t(null,r)}},9095:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(8749));var n=Buffer.from("3e10bb241d611ac910af5d8690011e6c","hex"),o=Buffer.from("34db16c275e2895654e798794f6e47ae","hex");const i="aes-128-cbc";t.default={encrypt:function(e){var t=a.default.createCipheriv(i,o,n);return t.update(e,"utf8","base64")+t.final("base64")},decrypt:function(e){var t=a.default.createDecipheriv(i,o,n);return t.update(e,"base64","utf8")+t.final("utf8")}}},4664:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.db=void 0,t.connectionCheck=async function(){try{return o.query("select 1 as answer;",[]).then((e=>{console.log("Connected to PG=>",e.rows[0]&&1==e.rows[0].answer)})).catch((e=>{throw console.error("Error executing query: ",e.stack),new Error(e)}))}catch(e){return{rows:[],rowCount:0,error:e.message}}},t.transaction=async function(e){const t=await o.connect();try{await t.query("BEGIN");const r=await e(t);return await t.query("COMMIT"),r}catch(e){throw await t.query("ROLLBACK"),e}finally{t.release()}};const a=r(2449),n=s(r(5260)),o=new a.Pool({host:n.default.DBSERVER,port:Number(n.default.DBPORT),database:n.default.DBNAME,user:n.default.DBUSER,password:n.default.DBPASS,max:Number(n.default.DBPG_MAX_CONNECTIONS),idleTimeoutMillis:Number(n.default.DBPG_IDLETIMEOUTMILLLIS),connectionTimeoutMillis:Number(n.default.DBPG_CONNECTIONTIMEOUTMILLES)});t.db=o,t.default={query:async function(e,t){try{"development"===n.default.NODE_ENV&&console.log("PG query: ",{text:e,params:t});const{rows:r,rowCount:s,command:a}=await o.query(e,t);return{rows:r,rowCount:s,error:!1,command:a}}catch(r){return console.log("PG ERROR=>",r),console.log("PG query: ",{text:e,params:t}),{rows:[],rowCount:0,error:r.message}}}}},2652:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(4572);t.default=(e,t,r,a)=>(console.log("errorHandler","=>",{url:t.url,error:e,tFunctionAvailable:"function"==typeof t.t}),(0,s.sendError)(r,null==e?void 0:e.message))},5560:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(9896)),n={exists:async e=>!!await a.default.promises.stat(e).catch((e=>("true"===process.env.DEBUG_MODE&&console.debug(e),!1))),deleteFile:async e=>await a.default.promises.unlink(e).catch((e=>("true"===process.env.DEBUG_MODE&&console.debug(e),!1))),listDir:async e=>await a.default.promises.readdir(e).catch((e=>("true"===process.env.DEBUG_MODE&&console.debug(e),[]))),write:async(e,t)=>await a.default.promises.writeFile(e,t,"utf8"),read:async e=>await a.default.promises.readFile(e,"utf8")};t.default=n},218:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){if("/"===e.originalUrl)return t.redirect("/");const s=function(){let e=__dirname;for(;;){const t=a.default.join(e,"public");if(n.default.existsSync(t)&&n.default.statSync(t).isDirectory())return t;const r=a.default.dirname(e);if(r===e)break;e=r}return null}();return s?t.sendFile(a.default.join(s,"index.html")):t.status(404).send("Public directory not found")};const a=s(r(6928)),n=s(r(9896))},3978:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(6427)),n=s(r(8495)),o=s(r(1889)),i=s(r(970)),l=s(r(1725)),u={ru:{translation:i.default},kg:{translation:l.default}};a.default.use(n.default).use(o.default.LanguageDetector).init({resources:u,defaultNS:"translation",detection:{order:["querystring","cookie"],cache:["cookie"],lookupQuerystring:"lang",lookupCookie:"lang"},fallbackLng:["ru","kg","ky"],preload:["ru"]});const d=o.default.handle(a.default);t.default=d},3481:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(829)),n=s(r(9095)),o=s(r(5260)),i={generateAccessToken:e=>a.default.sign({data:n.default.encrypt(JSON.stringify(e))},o.default.JWT_ACCESS_SECRET,{expiresIn:o.default.JWT_EXPIRE_HOURS}),getTokenData:e=>{try{const t=e.split(" ");if("Bearer"!=t[0])return!1;const r=a.default.verify(t[1],o.default.JWT_ACCESS_SECRET);if(!r||!r.data)return!1;const s=JSON.parse(n.default.decrypt(r.data));return Object.assign({},s)}catch(e){return console.log("error getTokenData: ",e.message),!1}},generateLinkToken:(e,t=o.default.EMAIL_JWT_EXPIRE_HOURSE)=>a.default.sign({data:e},o.default.JWT_ACCESS_SECRET,{expiresIn:t}),getTokenDataLink:e=>{try{const t=a.default.verify(e,o.default.JWT_ACCESS_SECRET);if(!t||"object"!=typeof t||!t.data)return!1;const r=t.data;return Object.assign({},r)}catch(e){return console.log("error getTokenDataLink: ",e.message),!1}}};t.default=i},4572:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.sendSuccess=t.sendError=t.send=void 0;const r=(e,t,r,s,a)=>e.status(a).json({data:t,message:r,error:s});t.send=r,t.sendError=(e,t,s=!1,a=400)=>r(e,s,t,!0,a),t.sendSuccess=(e,t,s=!0,a=200)=>r(e,s,t,!1,a)},7265:function(e,t,r){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.md5=function(e){return a.default.createHash("md5").update(e).digest("hex")};const a=s(r(8749))},8416:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(5781);t.default=(e,t)=>(new s.Validator).validate(e,t).valid},7174:e=>{e.exports=require("compression")},6898:e=>{e.exports=require("cookie-parser")},8577:e=>{e.exports=require("cors")},8749:e=>{e.exports=require("crypto")},818:e=>{e.exports=require("dotenv")},7252:e=>{e.exports=require("express")},6376:e=>{e.exports=require("express-fileupload")},6427:e=>{e.exports=require("i18next")},1889:e=>{e.exports=require("i18next-http-middleware")},8495:e=>{e.exports=require("i18next-node-fs-backend")},5781:e=>{e.exports=require("jsonschema")},829:e=>{e.exports=require("jsonwebtoken")},2449:e=>{e.exports=require("pg")},3903:e=>{e.exports=require("uuid")},9896:e=>{e.exports=require("fs")},6928:e=>{e.exports=require("path")},1725:e=>{e.exports=JSON.parse('{"token":{"notFound":"Токен табылган жок!","invalid":"Токен жараксыз!","permission":"Маалыматты алууга уруксатыңыз жок!","expired":"Токендин мөөнөтү бүттү!","generateError":"Токен жаратуу болбой калды"},"success":"Ийгиликтүү!","error":"Ката!","unauth":"Логин же сырсөз туура эмес!","inValidFormat":"Маалыматтарды туура толтуруңуз!","noValidEmail":"Электрондук дарек туура эмес!","noToken":"Токен жок!","emailUsed":"Email колдонууда","userNotFound":"Колдонуучу табылган жок","emailAlreadyInUse":"Сиз мурунтан эле колдонуп жаткан электрондук почтага өзгөртө албайсыз","changedNumber":"Телефон номери ийгиликтүү өзгөртүлдү","couldNotChangeTheNumber":"Номерди өзгөртүү ишке ашкан жок","phoneAlreadyInUse":"Сиз мурунтан эле колдонуп жаткан телефон номерге өзгөртө албайсыз","passwordAlreadyInUse":"Сиз мурунтан эле колдонуп жүргөн сырсөздү алмаштыра албайсыз","changePassword":"Сырсөздү ийгиликтүү өзгөрттүңүз","couldNotChangeThePassword":"Сырсөз өзгөргөн жок","fileIsMissing":"Файл жок","fileNotFound":"Файл табылган жок!"}')},970:e=>{e.exports=JSON.parse('{"token":{"notFound":"Токен не найден!","invalid":"Токен недействительный!","permission":"У вас нет доступа!","expired":"Срок действия токена истек!","generateError":"Не удалось сгенерировать токен"},"success":"Успешно!","error":"Ошибка!","unauth":"Неправильный логин пароль!","inValidFormat":"Неверный формат данных!","noValidEmail":"Неверный адрес электронной почты!","noToken":"Нет токена!","emailUsed":"Email уже используется","userNotFound":"Пользователь не найден","emailAlreadyInUse":"Нельзя поменять на почту, которую вы уже используете","changedNumber":"Номер телефона успешно изменен","couldNotChangeTheNumber":"Не получилось изменить номер","phoneAlreadyInUse":"Нельзя поменять на номер, которую вы уже используете","passwordAlreadyInUse":"Нельзя поменять на тот же пароль, которую вы уже используете","changePassword":"Вы успешно поменяли пароль","couldNotChangeThePassword":"Не получилось поменять пароль","fileIsMissing":"Файл отсутствует","fileNotFound":"Файл не найден!"}')}},t={},r=function r(s){var a=t[s];if(void 0!==a)return a.exports;var n=t[s]={exports:{}};return e[s].call(n.exports,n,n.exports,r),n.exports}(7806);app=r})();