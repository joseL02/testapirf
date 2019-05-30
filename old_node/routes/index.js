var express = require('express');
var faceapi = require('face-api.js');
var commons_1 = require("./commons");
var router = express.Router();
const path = require('path');
const fs = require('fs');
const canvas = require('canvas');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/uniquefr/', function(req, res, next) {
  let directori = req.body.rutaFotos; //;'//Users/jose/Documents/face-recognition/unique-fr/data3';
  let fotoSemilla = req.body.fotoSemilla;

  
  const result =  {"fotoSemilla": directori+'/'+fotoSemilla};
  
  res.send(buscaRostros(directori, fotoSemilla));
});

async function buscaRostros(directori, fotoSemilla){
  let rutaImgSemilla = directori+'/'+fotoSemilla;  
  let imgCanvas = canvas.loadImage(rutaImgSemilla);
  let faceDetectionOptions = {"_name":"SsdMobilenetv1Options","_minConfidence":0.5,"_maxResults":100};
  let img = '';
  
  imgCanvas.then(async function(value) {
    console.log(value);
    img = await faceapi.detectAllFaces(imgCanvas);
  });
  console.log(img);
  
  //console.log(img);
  // const resultsRef = await faceapi.detectAllFaces(rutaImgSemilla).withFaceDescriptors();

  // fs.readdirSync(directori).forEach(async file => {
  //   let fileType = file.split('.');
  //   if(fileType[1] == 'jpg' || fileType[1] == 'JPG'){                  
  //     let resultsQuery = await faceapi.detectAllFaces(file).withFaceDescriptors();

  //   }
  // });

}

module.exports = router;
