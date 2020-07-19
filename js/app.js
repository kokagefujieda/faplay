/* Get the webcam */
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
   imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 0,        // maximum number of boxes to detect
    iouThreshold: 0.7,      // ioU threshold for non-max suppression
    scoreThreshold: 0.1,    // confidence threshold 手とみなすしきい値　1に近ければ近いほど確からしくないと手として認めてくれなくなる
}
      

// Select everything in the HTML
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');


let model;

handTrack.startVideo(video)
    .then(status => {
        if(status){
            navigator.getUserMedia({video: {}}, stream => {
                video.srcObject = stream
   //             setInterval(runDetecotion, 10)
                setInterval(runDetecotion, 100)

            },
            err => console.log(err)
        )
    }
})
var handX = befhandX = handyX = 0;
var handY = befhandY = handyY = 0;
var handwidth = 0;
var handheight = 0;
const camerawidtht=canvas.width;
const cameraheight=canvas.height;



function runDetecotion() {
    model.detect(video).then(predictions => {
  //    model.renderPredictions(predictions, canvas, context, video)
        if (predictions.length > 0) {
//bbox: [x, y, width, height], //この1番目を取得するとx

befhandX=handX;
 handX = predictions[0].bbox[0] ;
handyX = handX - befhandX;


befhandY=handY;
 handY = predictions[0].bbox[1] ;
handyY = handY - befhandY;


handwidth = predictions[0].bbox[2] ;
handheight = predictions[0].bbox[3] ;




        } 


    })
}



handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel;
    // model.detect(img).then(predictions => {
    //   console.log('Predictions: ', predictions); 
    // });
    });