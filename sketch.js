/*
 * @name Kaleidoscope
 * @arialabel User draws thick black lines on the grey background and it is mirrored 5 times in a circle like a kaleidoscope
 * @description A kaleidoscope is an optical instrument with two or more reflecting surfaces tilted to each other in an angle. This example tries to replicate the behavior of a kaleidoscope. Set the number of reflections at the symmetry variable and start drawing on the screen. Adjust the brush size with the help of the slider. The clear screen as it says clears the screen. The save button will download a .jpg file of the art that you have created.
 */
// Symmetry corresponding to the number of reflections. Change the number for different number of reflections 
let symmetry = 5;  

let angle = 360 / symmetry;
let saveButton, clearButton, mouseButton, keyboardButton;
let slider;

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
}

// Save File Function
function saveFile() {
  save('design.jpg');
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
          symmetry = random(4,12);
          angle = 360 / symmetry;
          // offset = offset - 5;
          // if(offset<-300)
          // {
          //     offset = 0;
          // }
          rx = 505;
          ry= 355;
          prx = rx;
          pry = ry;
      }
    if(int(t)%200==0)
      {
        
        rx = prx+random(0,1);
        ry= pry+random(0,1);
        // console.log(t);
      }
    else{
      rx = prx+random(-6,7);
      ry= pry+random(-6,7);
    }

    // console.log(t);
    
    
    
    if (1) {
      
      
      for (let i = 0; i < symmetry; i++) {
        rotate(angle);
        // let sw = sizeSlider.value();
        mystroke = vol*55
        // mystroke = 4;
        if(mystroke>4)
          {
            mystroke = 4;
          }
        strokeWeight(mystroke);
        
      
        var sad = [10,80,80,120,160,190]
        var angry = [180,255,20,150,10,90]
        var pride = [40,255,100,200,100,255]
        var happy = [80,255,0,100,50,200]
        var envy = [80,100,180,255,120,200]
        var alpha = 255
        //freq= freq-50;
        if (freq<50){
          color = sad
          alpha = 200
        }
        else if (freq<100)
          {
            color = sad
            alpha = 255
          }
        else if (freq<200)
          {
            color = happy
            alpha = 255
          }
        else
          {
            color = pride
            alpha = 255
          }
        
        
        stroke(random(color[0],color[1]),random(color[2],color[3]),random(color[4],color[5]),alpha)
        
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
}
function getFrequency(volume) {
  // You may need to adjust the mapping based on your use case
  let minFreq = 20; // Minimum frequency
  let maxFreq = 20000; // Maximum frequency
  
  // Map the volume to a frequency range
  let freq = map(volume, 0, 1, minFreq, maxFreq);
  return freq;
}
