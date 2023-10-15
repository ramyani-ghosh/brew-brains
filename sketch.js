/*
 * @name Kaleidoscope
 * @arialabel User draws thick black lines on the grey background and it is mirrored 5 times in a circle like a kaleidoscope
 * @description A kaleidoscope is an optical instrument with two or more reflecting surfaces tilted to each other in an angle. This example tries to replicate the behavior of a kaleidoscope. Set the number of reflections at the symmetry variable and start drawing on the screen. Adjust the brush size with the help of the slider. The clear screen as it says clears the screen. The save button will download a .jpg file of the art that you have created.
 */
// Symmetry corresponding to the number of reflections. Change the number for different number of reflections 

// var palette1= [[0,70,70,110,140,180],[0,70,140,170,140,200],[80,255,0,100,50,200],[80,255,0,100,50,200],[120,255,80,120,120,220]];
// var palette2 = [[0,70,70,110,140,180],[50,80,100,190,100,140],[70,90,100,210,80,200],[140,255,100,230,90,120],[200,255,200,230,90,120]];

let palettes = [[[0,70,70,110,140,180],[0,70,140,170,140,200],[80,255,0,100,50,200],[80,255,0,100,50,200],[200,255,80,120,180,220]],
              [[50,80,100,190,100,140],[0,70,70,110,140,180],[70,90,100,210,80,200],[140,255,100,255,90,120],[240,255,200,230,120,160]],
                [[30,80,40,80,120,180],[40,100,40,100,100,170],[70,90,70,110,150,190],[90,130,100,180,160,240],[180,210,160,200,230,255]],
                [[80,130,50,100,50,130],[100,150,50,90,50,80],[170,210,90,120,80,90],[170,220,90,110,90,120],[240,255,200,220,150,190]]
];
var palette;
var lowfreq = [115,130,160,200]
var highfreq = [170,200,290,400]
let symmetry = 5;  
let angle = 360 / symmetry;
let saveButton, clearButton, mouseButton, keyboardButton;
let slider;

let freqmode = highfreq;


function setup() { 
  createCanvas(1010, 710);
  angleMode(DEGREES);
  bg = loadImage('backgroundsky.jpeg');
  background(0);

  // Creating the save button for the file
  saveButton = createButton('save');
  saveButton.mousePressed(saveFile);

  // Creating the clear screen button
  clearButton = createButton('clear');
  clearButton.mousePressed(clearScreen);

  // Creating the button for Full Screen
  fullscreenButton = createButton('Full Screen');
  fullscreenButton.mousePressed(screenFull);

  // Setting up the slider for the thickness of the brush
  brushSizeSlider = createButton('Brush Size Slider');
  sizeSlider = createSlider(1, 100, 4, 0.1);
    
  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
  palette = palettes[int(random(4))];
}

// Save File Function
function saveFile() {
  file_name = "postcard" + int(random(10000)) + ".jpg";
  save(file_name);
}

// Clear Screen function
function clearScreen() {
  background(0);
}

// Full Screen Function
function screenFull() {
  let fs = fullscreen();
  fullscreen(!fs);
}


offset = 0;
var rx = 525 + offset;
var ry= 355 + offset;
var  prx = rx;
var  pry = ry;
var t = 0;


function draw() {
  if (frameCount == 60*30) {
    noLoop();
    saveFile();
    console.log("Your aural visual is ready :)");
  }
  
  
  let vol = mic.getLevel();
  let freq = getFrequency(vol);
  
  
  translate(width / 2, height / 2);

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)   {
    
  
    let mx =  rx - width / 2;
    let my =  ry - height / 2;
    let pmx =  prx - width / 2;
    let pmy = pry - height / 2;
    prx = rx;
    pry = ry;
    
    if(mx > 300)
      {
          symmetry = random(5,7);
          angle = 360 / symmetry;
          offset = offset - 5;
          if(offset<-300)
          {
              offset = 0;
          }
          rx = 505;
          ry= 355;
          prx = rx;
          pry = ry;
      }
    if(int(t)%200==0)
    {
        rx = prx+random(0,1);
        ry= pry+random(0,1);
    }
    else{
        rx = prx+random(-6,7);
        ry= pry+random(-6,7);
    }
    

      
      for (let i = 0; i < symmetry; i++) {
        rotate(angle);
        let sw = sizeSlider.value();
        mystroke = vol*55+0.2
        if(mystroke>2)
          {
            mystroke = 2;
          }
        strokeWeight(mystroke);
        
      
        // var sad = [0,70,70,110,140,180]
        // var angry = [180,255,20,150,10,90]
        // var pride = [20,255,0,255,20,255]
        // var happy = [80,255,0,100,50,200]
        
        var myalpha = 255
        //freq= freq-50;
        
        // var palette = random(palette1,palette2);
        
        
        if (freq<freqmode[0]){
            
            mycolor = palette[0]
            // console.log(mycolor)
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

        
        line(mx, my, pmx, pmy);
        // line(x,y,px,py);
        push();
        scale(1, -1);
        line(mx, my, pmx, pmy);
        // line(x,y,px,py);
        pop();
        t+=0.1;
      }
    
  }
}
function getFrequency(volume) {
  // You may need to adjust the mapping based on your use case
  let minFreq = 20; // Minimum frequency
  let maxFreq = 20000; // Maximum frequency
  
  // Map the volume to a frequency range
  let freq = map(volume, 0, 1, minFreq, maxFreq);
  return freq;
}
