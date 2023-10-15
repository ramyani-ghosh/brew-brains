
//All color palettes: Tangled, Summer, Ice, Diwali
let palettes = [[[70,80,30,70,120,150],[40,70,70,120,120,180],[80,255,0,100,50,200],[80,255,0,100,50,200],[240,255,100,170,200,240]],
                [[30,50,90,110,70,90],[0,70,110,180,100,150],[70,90,100,210,80,200],[140,205,180,255,90,120],[240,255,200,230,170,190]],
                [[30,70,60,70,110,170],[50,70,40,90,140,160],[70,90,70,110,150,190],[90,130,100,180,160,240],[180,210,200,220,240,255]],
                [[80,130,50,100,50,130],[100,150,50,90,50,80],[170,210,90,120,80,90],[170,220,90,110,90,120],[240,255,200,220,150,190]]
];

var palette;
var lowfreq = [115,160,190,250,90]
var highfreq = [200,280,360,440,100]
let symmetry = 10;  
let angle = 360 / symmetry;
let slider;
var mywidth;
var myheight;
var divider = 100;

//Choose frequency mode depending on level of noise
let freqmode = lowfreq;

// Get the canvas and its context
const canvas = document.getElementById('combinedCanvas');
const ctx = canvas.getContext('2d');
canvas.style.display="none";

const image2 = new Image();
image2.src = 'posttcard.png';

image2.onload = function() {
  // Draw the image on the canvas
  ctx.drawImage(image2, canvas.width/2+10, 50, canvas.width/2-50, 400);
};

function setup() { 
  
  var cnv= createCanvas(windowWidth, windowHeight+70);
  cnv.style('display', 'block');  // This makes the canvas take up the whole window
  fullscreen(true);
  mywidth = int(windowWidth/2);
  myheight = int(windowHeight/2);
  angleMode(DEGREES);
  background(0);
    
  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input
  mic.start();

  //Color palette choice is random
  palette = palettes[int(random(4))];
  symmetry = random(5,7);
  angle = 360 / symmetry;
}

function saveFile() {
  // Convert canvas data to a Blob
  const canvasmain = document.getElementById('defaultCanvas0');
  canvasmain.toBlob(function(blob) {
    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);

     // Create a new Image element
     const img = new Image();

     // Set the source of the Image to the Blob URL
     img.src = blobUrl;
 
     // Wait for the image to load
     img.onload = function() {
       // Draw the image on the canvas
       //const ctx = canvasmain.getContext('2d');
       canvasmain.style.display = "none";
       ctx.drawImage(img, 50, 50, canvas.width/2-70, 400);
       canvas.style.display="block";
     }
  }, 'image/jpeg'); // Specify the image format if needed (e.g., 'image/png')
}

//Initial starting positions
offset = 0;
var rx = 550 + offset;
var ry= 350  + offset;
var prx = rx;
var pry = ry;
var t = 0;

//Function called to draw every frame
function draw() {

  //Stop after 30 seconds of frames and save image
  if (frameCount == 60*30) {
    noLoop();
    saveFile();
    console.log("Your aural visual is ready :)");
  }

  let vol = mic.getLevel();
  let freq = getFrequency(vol);
  
  //translate image to scale to the canvas
  translate(width / 2, height / 2);

  if (freq>freqmode[4])   { 
    console.log(width);
    let mx =  rx - width / 2;
    let my =  ry - height / 2;
    let pmx =  prx - width / 2;
    let pmy = pry - height / 2;
    prx = rx;
    pry = ry;
    
    if(my > myheight+300) {

          //Reset center position, new symmetry value, and updated radial jump forward value.
          divider = int(random(1,4))*100;
          symmetry = random(4,7);
          angle = 360 / symmetry;
          offset = offset - 5;
          if(offset<- (mywidth-20))
          {
              offset = 0;
          }
          rx = mywidth-10;
          ry= myheight;
          prx = rx;
          pry = ry;
    }
    if(int(t)%divider==0){
        //jump ahead radially to ensure design progresses outwards from center
        rx= prx+random(0,1);
        ry= pry+random(0,1);
    }
    else{
        rx = prx+random(-7,8);
        ry= pry+random(-8,11);
    }
    
    for (let i = 0; i < symmetry; i++) {

      rotate(angle);
      //Vary stroke width based on audio volume
      var mystroke = vol*100+0.5;
      if(mystroke>2){
          mystroke = 2;
      }
      strokeWeight(mystroke);

      //Vary color and transparency based on frequency
      var myalpha = 255;
      var mycolor;

      if (freq<freqmode[0]){
          mycolor = palette[0]
          myalpha = 180
      }
      else if (freq<freqmode[1])
      {
          mycolor = palette[1]
          myalpha = 200
      }
      else if (freq<freqmode[2])
      {
          mycolor = palette[2]
          myalpha = 230
      }
      else if (freq<freqmode[3])
      {
          mycolor = palette[3]
          myalpha = 255
      }
      else 
      {
          mycolor = palette[4]
          myalpha = 255
      }
      stroke(random(mycolor[0],mycolor[1]),random(mycolor[2],mycolor[3]),random(mycolor[4],mycolor[5]),myalpha)

      //Draw line between previous and current point
      line(mx, my, pmx, pmy);
      push();
      //Scale and draw reflection
      scale(1, -1);
      line(mx, my, pmx, pmy);
      pop();

      //Increment time(or frame)
      t+=0.1;
    }
  }
}
function getFrequency(volume) {
  let minFreq = 20; // Minimum frequency
  let maxFreq = 20000; // Maximum frequency
  // Map the volume to a frequency range
  let freq = map(volume, 0, 1, minFreq, maxFreq);
  return freq;
}
