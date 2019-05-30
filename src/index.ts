import * as bodyParser from "body-parser";
import express from "express";
import * as fs from "fs";
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
//import * as canvas from 'canvas';
const canvas = require("canvas");
import * as faceapi from 'face-api.js';

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
const app = express();
const port = 3000; // default port to listen
app.use(bodyParser.json());
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello Unique!" );
} );
app.post("/uniquefr/", async (req, res, next) => {
    const directori = req.body.rutaFotosAlbum; // ;'//Users/jose/Documents/face-recognition/unique-fr/data3';
    const fotoSemilla = req.body.fotoSemilla;
    const result = await matchRostros(req.body);//{fotoSemilla: directori + "/" + fotoSemilla};
    res.send(result);
  });

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `SERVER STARTED AT http://localhost:${ port } \n` );
} );

async function matchRostros( objAlbumDatos: any ) {    
    var today = new Date();
    console.log( "tiempo inicio:"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() );    
    // await faceDetectionNet.loadFromDisk('../weights')
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('../weights');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('../weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('../weights')
    
    var labelArray = new Array();
    var matchArray = new Array();
    const directori = objAlbumDatos.rutaFotosAlbum;
    const arrayFotosEnAlbum = fs.readdirSync(directori);    
    const rutFotoSemilla = objAlbumDatos.rutaFotosAlbum + "/" + objAlbumDatos.fotoSemilla;
    const canvasFotoSemilla = await canvas.loadImage(rutFotoSemilla);
    
    const resultsFotoSemilla = await faceapi.detectAllFaces(canvasFotoSemilla)
                                            .withFaceLandmarks()
                                            .withFaceDescriptors();            

    resultsFotoSemilla.forEach( (key, index)=>{
        var labelName = new faceapi.LabeledFaceDescriptors(`Persona ${index++}`,[ key.descriptor ]);
        labelArray.push(labelName);
    });    
    const faceMatcher = new faceapi.FaceMatcher(labelArray);
    
    arrayFotosEnAlbum.forEach(async (file,index) => {
      let fileType = file.split(".");
      let tempMathArray = new Array();  
      if ( fileType[1] === "jpg" || fileType[1] === "JPG" ) {
        if(file === "DSC_7708.JPG"){
        var rutFotoLista = objAlbumDatos.rutaFotosAlbum + "/" + file;
        var canvasFotoLista = await canvas.loadImage(rutFotoLista);
        var resultsQueryFotoLista = await faceapi.detectAllFaces(canvasFotoLista)
                                                    .withFaceLandmarks()
                                                    .withFaceDescriptors();

        await resultsQueryFotoLista.forEach(fd =>{
            var bestMatch = faceMatcher.findBestMatch(fd.descriptor);
            
            tempMathArray.push({"label":bestMatch.label, "distance": bestMatch.distance});
        });
        await matchArray.push({tempMathArray, file});
        console.log("matchArray 1:");
        console.log( JSON.stringify(matchArray) );
        var today2 = new Date();
        console.log("tiempo fin:"+today2.getHours() + ":" + today2.getMinutes() + ":" + today2.getSeconds());
        }
      }
      
    });
    
    return matchArray;
}

