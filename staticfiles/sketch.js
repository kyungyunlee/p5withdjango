var song,amplitude;
var musicPlaying =true;

var beatHoldFrames = 20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff = 0;
var beatDecayRate = 0.98;
var countFramesSinceLastBeat = 0;

function preload(){
  song=loadSound('assets/lifeincolor.mp3');
}

function setup(){
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
}


var callSketch1= function(p){
  p.newbox = [];
  p.newbox2=[];
  p.cameraZ = 0;
  p.zpos = -500;
  p.w = 300;
  p.l = 300;

  p.boxColor;
  p.onBeat=false;

  p.sizeSlider;
  p.moveCameraY = -300;
  p.moveCameraX = 500;
  p.angleOfCam;
  p.boxheight;

  p.setup=function(){
    p.createCanvas(p.windowWidth,p.windowHeight,p.WEBGL);
    p.frameRate(20);
    p.sizeSlider = p.createSlider(50,300,300,0.1);
    p.sizeSlider.position(300,p.windowHeight-30);

    p.boxColor = p.color(p.random(20,40), p.random(100,120), p.random(140,180));
    p.angleOfCam=0;
    p.timer;
  }

  p.draw=function(){
    p.timer = p.int(p.millis()/1000);
  // var timer = frameCount;
    // print(timer);
    p.background(255,0,0);
    p.ambientLight(150);
    p.pointLight(250, 250, 250, 200, 300, 100);

    if(p.timer>0){
      if (p.timer%30==0){
        p.angleOfCam-=1;
        p.moveCameraY+=15;
      }
      else if (p.timer%20==0){
        p.angleOfCam +=2;
        p.moveCameraY -=20;
      }
      else if (p.timer%10==0){
        p.angleOfCam -=1;
        p.moveCameraY +=5;
      }
    }

    p.rotateY(p.radians(p.angleOfCam));
    p.camera(p.moveCameraX, p.moveCameraY, p.cameraZ);


    p.boxheight = p.map(p.amplitude.getLevel(), 0, 1, 30, 2000);
    p.newbox.push(new p.NewBox(0, 0, p.zpos, p.sizeSlider.value(), p.boxheight, p.sizeSlider.value(),p.boxColor));
    p.newbox2.push(new p.NewBox(1000, 0, p.zpos, p.sizeSlider.value(), p.boxheight, p.sizeSlider.value(), p.boxColor));
    // detectBeat(amplitude.getLevel());

    for (var i = 0; i < p.newbox.length; i++) {
      p.newbox[i].display();
      p.newbox2[i].display();
    }

    if ((p.cameraZ-p.zpos)>5000){
      p.cameraZ -= p.sizeSlider.value()*1.3;
    }
    else {
      p.zpos -= p.sizeSlider.value() + 10;
      p.cameraZ -= p.sizeSlider.value();
    }
    if (p.newbox.length>100){
        p.newbox.splice(0,1);
        p.newbox2.splice(0,1);
      }
    }
    p.Newbox=function(x,y,z,w,h,l,boxcolor){
      this.pos = createVector(x,y,z);
      this.newW=w;
      this.newH=h;
      this.newL=l;
      this.bc = boxcolor;

      this.display = function(){

        p.specularMaterial(this.bc);

        p.push();
        p.translate(this.pos.x,this.pos.y-this.newH/2,this.pos.z);
        p.box(this.newW,this.newH,this.newL);
        p.pop();

  }
}
}

var callSketch2 = function(p){
  p.drawParticle = false;
  p.numOfPoints=30;
  p.r;
  p.g;
  p.b;
  p.lines=[];

  p.setup = function(){
    p.createCanvas(p.windowWidth,p.windowHeight);
    p.r=255;
    p.g=255;
    p.b=255;
    p.lines.push(new p.Lines(p.r,p.g,p.b));
  }
  p.draw=function(){
    p.background(0,255,0);
    // p.amp = amplitude.getLevel();

    //detectBeat(amp);
    p.r=p.random(255);
    p.g=p.random(255);
    p.b=p.random(255);
    if (p.drawParticle==true){
      p.lines.push(new p.Lines(p.r,p.g,p.b));
    }
    if (p.lines.length>4){
      p.lines.splice(0,1);
    }
    for (var i=0; i<p.lines.length;i++){
      p.lines[i].display();
    }
  }

  p.Lines=function(r,g,b){
      p.op;
      this.lineR=r;
      this.lineG=g;
      this.lineB=b;
      p.history=[];

      p.numOfPoints=30;
      p.lengthBetweenPoints;
      p.heightOfPoints=[];

      p.smoothFactor=1;
      p.sum=[];
      p.newFreq=[];

      for (var i=0;i<p.numOfPoints;i++){
        p.sum[i]=0;
        p.newFreq[i]=0;
        p.heightOfPoints[i]=0;
      }

      for(var i=0;i<p.numOfPoints;i++){
          p.history[i]=[];
        }

      this.display=function(){
        p.lengthBetweenPoints = (p.windowWidth-100)/p.numOfPoints;

        p.freq = fft.analyze();
        p.range = p.freq.length/p.numOfPoints; //1024/30

        ///smoothing effect - may be unnecessary
    //     for (var k=0;k<numOfPoints;k++){
    //       newFreq[k] = fft.getEnergy(range*k+1, range*k+range);
    //       sum[k]+=(newFreq[k]-sum[k])*smoothFactor;
    //       heightOfPoints[k] = sum[k];
    //       // this.y = heightOfPoints[k];
    // }
        p.col= color(this.newR,this.newG,this.newB,p.op);
        p.stroke(p.col);
        p.strokeWeight(4);
        p.noFill();
        // fill(255,1);
        p.ellipse(50,p.windowHeight/2,3,3);
        p.ellipse(p.windowWidth-50, p.windowHeight/2,3,3);

        p.beginShape();
        p.vertex(50,p.windowHeight/2);
        p.curveVertex(50,p.windowHeight/2);
        for(var i=0; i<p.numOfPoints;i++){
          p.heightOfPoints[i] = p.map(fft.getEnergy(p.range*i+1, p.range*i+p.range),0,255,0,p.windowHeight*0.8);
          p.curveVertex(i*p.lengthBetweenPoints+50, p.heightOfPoints[i]);
          // ellipse(i*lengthBetweenPoints+50, heightOfPoints[i]+30,1,1);
          p.history[i].push(p.heightOfPoints[i]);
        }
        p.curveVertex(p.windowWidth-50, p.windowHeight/2);
        p.vertex(p.windowWidth-50, p.windowHeight/2);
        p.endShape();


        for (var i=0;i<p.numOfPoints;i++){
          if (p.history[i].length>1){
            p.history[i].splice(0,1);
          }
          for (var j=0; j<p.history[i].length;j++){
            p.op=50*j+10;
            p.col= color(this.newR,this.newG,this.newB,p,op);
            p.stroke(p.col);
            p.beginShape();
            p.vertex(50,p.windowHeight/2);
            p.curveVertex(50,p.windowHeight/2);
            for(var k=0; k<p.numOfPoints;k++){
              p.curveVertex(k*p.lengthBetweenPoints+50, p.history[k][j]);
            }
            p.curveVertex(p.windowWidth-50, p.windowHeight/2);
            p.vertex(p.windowWidth-50, p.windowHeight/2);
            p.endShape();
          }
        }
      }
  }
}
