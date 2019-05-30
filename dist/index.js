"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@tensorflow/tfjs-node");
const bodyParser = __importStar(require("body-parser"));
const canvas = __importStar(require("canvas"));
const express_1 = __importDefault(require("express"));
const faceapi = __importStar(require("face-api.js"));
const fs = __importStar(require("fs"));
const app = express_1.default();
const port = 3000; // default port to listen
app.use(bodyParser.json());
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.post("/uniquefr/", (req, res, next) => {
    const directori = req.body.rutaFotosAlbum; // ;'//Users/jose/Documents/face-recognition/unique-fr/data3';
    const fotoSemilla = req.body.fotoSemilla;
    const result = { fotoSemilla: directori + "/" + fotoSemilla };
    matchRostros(req.body);
    res.send(result);
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
function matchRostros(objAlbumDatos) {
    return __awaiter(this, void 0, void 0, function* () {
        const directori = objAlbumDatos.rutaFotosAlbum;
        const rutFotoSemilla = objAlbumDatos.rutaFotosAlbum + "/" + objAlbumDatos.fotoSemilla;
        const canFotoSemilla = yield canvas.loadImage(rutFotoSemilla);
        const resultsQuery = yield faceapi.detectAllFaces(canFotoSemilla);
        // tslint:disable-next-line:no-console
        console.log(resultsQuery);
        fs.readdirSync(directori).forEach((file) => __awaiter(this, void 0, void 0, function* () {
            //   let fileType = file.split(".");
            //   if (fileType[1] === "jpg" || fileType[1] === "JPG") {
            //     let resultsQuery = await faceapi.detectAllFaces(file);
            //     // tslint:disable-next-line:no-console
            //     console.log(resultsQuery);
            //   }
        }));
    });
}
// const input = "data3/DSC_7692.JPG";
// const detections = faceapi.detectAllFaces(input);
// // tslint:disable-next-line:no-console
// console.log(detections);
//# sourceMappingURL=index.js.map