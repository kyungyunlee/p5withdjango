var allSketch = function(q){
  q.song;
  var musicPlaying =true;
  q.allcanvas;
  var state='movingbox';
  var button1;
  var button2;
  var button3;
  q.amplitude;
  q.fft;
  var canvas1;
  var canvas2;
  var reset;

  q.preload=function(){
    q.song=q.loadSound('static/assets/lifeincolor.mp3');
  }

  q.setup=function(){
    q.createCanvas(q.windowWidth,q.windowHeight,q.WEBGL);

    q.song.play();
    q.frameRate(20);

    button1=q.createButton('sketch1');
    button1.position(0,0);
    button1.mousePressed(s.movingbox);

    button2=q.createButton('sketch2');
    button2.position(40,0);
    button2.mousePressed(s.spheres);

    button3=q.createButton('sketch3');
    button3.position(80,0);
    button3.mousePressed(s.egg);

    q.amplitude = new p5.Amplitude();
    q.amplitude.setInput(q.song);

    q.fft = new p5.FFT();
    q.fft.setInput(q.song);

  }

  q.draw=function(){
    q.background(20);
    // if button clicked hide div.


  }

  var s={};

  s.movingbox = function(){
    var newbox = [];
    var newbox2=[];
    var cameraZ = 0;
    var zpos = -500;
    var w = 300;
    var l = 300;

    var onBeat=false;

    var sizeSlider;
    var moveCameraY = -300;
    var moveCameraX = 500;
    var angleOfCam=0;
    var boxheight;
    q.amp;
    var timer=0;

    q.boxColor=q.color(q.random(20,40), q.random(100,120), q.random(140,180));

    var canvas1;

     q.setup=function(){
      // canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
      // canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
      // canvas1.parent('sketchholder1');
      // q.frameRate(20);
      // sizeSlider = q.createSlider(50,300,300,0.1);
      // sizeSlider.position(300,500);
      // q.boxColor = q.color(q.random(20,40), q.random(100,120), q.random(140,180));
      // q.angleOfCam=0;
      // song.play();
      // q.amplitude = new p5.Amplitude();
      // q.amplitude.setInput(q.song);
      console.log('dd');
    }

      q.draw=function(){
        canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
        // console.log(q.boxColor);
        // canvas1.background(10);
        q.background(20);
        q.ambientLight(150);
        q.pointLight(250, 250, 250, 200, 300, 100);
        q.amp=q.amplitude.getLevel();
        timer = q.int(q.millis()/1000);
        if(timer>0){
          if (timer%30==0){
            angleOfCam-=1;
            moveCameraY+=15;
          }
          else if (timer%20==0){
            angleOfCam +=2;
            moveCameraY -=20;
          }
          else if (timer%10==0){
            angleOfCam -=1;
            moveCameraY +=5;
          }
        }

        q.rotateY(q.radians(angleOfCam));
        q.camera(moveCameraX, moveCameraY, cameraZ);


        boxheight = q.map(q.amp, 0, 1, 30, 2000);
        newbox.push(new q.NewBox(0, 0, zpos, 300, boxheight, 300, q.boxColor));
        newbox2.push(new q.NewBox(1000, 0, zpos, 300, boxheight, 300, q.boxColor));

        for (var i = 0; i < newbox.length; i++) {
          newbox[i].display();
          newbox2[i].display();
        }

        if ((cameraZ-zpos)>5000){
          cameraZ -= 300*1.3;
        }
        else {
          zpos -= 300 + 10;
          cameraZ -= 300;
        }
        if (newbox.length>100){
            newbox.splice(0,1);
            newbox2.splice(0,1);
          }
        }

      q.NewBox=function(x,y,z,w,h,l,bc){
        this.nx=x;
        this.ny=y;
        this.nz=z;
        this.newW=w;
        this.newH=h;
        this.newL=l;
        this.bc = bc;
        this.display = function(){
          q.specularMaterial(this.bc);
          q.push();
          q.translate(this.nx,this.ny-this.newH/2,this.nz);
          q.box(this.newW,this.newH,this.newL);
          q.pop();
  }
}



  } //////////movingbox end

  s.freqcurve = function(){
    var drawParticle = false;
  // var numOfPoints=30;
    var r=255;
    var g=255;
    var b=255;
    var lines=[];
    q.amp1;
    // var strokeSlider;
    q.canvas2;


    q.beatHoldFrames = 20;
  //what amplitude level can trigger a beat
    q.beatThreshold = 0.4;
    //when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
    q.beatCutOff = 0;
    q.beatDecayRate = 0.98;
    q.countFramesSinceLastBeat = 0;

     q.setup = function(){
        // q.canvas2 = q.createCanvas(q.windowWidth, q.windowHeight);
        // q.canvas2.parent('sketchholder2');

        lines.push(new q.Lines(r,g,b));
        // fft = new p5.FFT();
        // fft.setInput(q.song);
        // q.smooth(1);
        // strokeSlider = q.createSlider(2,30,30,1);
        // strokeSlider.position(allcanvas.x-10,allcanvas.y-30);

    }
      q.draw=function(){
        q.amp1=q.amplitude.getLevel();
        q.background(20);
        // q.amp = amplitude.getLevel();

        q.detectBeat(q.amp1);
        r=q.random(255);
        g=q.random(255);
        b=q.random(255);
        if (drawParticle==true){
          lines.push(new q.Lines(r,g,b));
        }
        if (lines.length>4){
          lines.splice(0,1);
        }
        for (var i=0; i<lines.length;i++){
          lines[i].display();
        }
      }

   //for freqcurve

  q.Lines=function(r,g,b){
      this.op=255;
      this.lineR=r;
      this.lineG=g;
      this.lineB=b;
      this.history=[];

      this.numOfPoints=30;
      this.lengthBetweenPoints;
      this.heightOfPoints=[];

      this.smoothFactor=1;
      this.sum=[];
      this.newFreq=[];
      this.freq;

      for (var i=0;i<this.numOfPoints;i++){
        this.sum[i]=0;
        this.newFreq[i]=0;
        this.heightOfPoints[i]=0;
      }

      for(var i=0;i<this.numOfPoints;i++){
          this.history[i]=[];
        }

      this.display=function(){
        this.lengthBetweenPoints = (q.windowWidth-100)/this.numOfPoints;

        this.freq = q.fft.analyze();
        this.range = this.freq.length/this.numOfPoints; //1024/30

        this.col= q.color(this.lineR,this.lineG,this.lineB,this.op);
        q.stroke(this.col);
        q.strokeWeight(20);
        q.noFill();
        // fill(255,1);
        q.ellipse(50,q.windowHeight/2,3,3);
        q.ellipse(q.windowWidth-50, q.windowHeight/2,3,3);

        q.beginShape();
        q.vertex(50,q.windowHeight/2);
        q.curveVertex(50,q.windowHeight/2);
        for(var i=0; i<this.numOfPoints;i++){
          this.heightOfPoints[i] = q.map(q.fft.getEnergy(this.range*i+1, this.range*i+this.range),0,255,0,q.windowHeight*0.8);
          q.curveVertex(i*this.lengthBetweenPoints+50, this.heightOfPoints[i]);
          // ellipse(i*lengthBetweenPoints+50, heightOfPoints[i]+30,1,1);
          this.history[i].push(this.heightOfPoints[i]);
        }
        q.curveVertex(q.windowWidth-50, q.windowHeight/2);
        q.vertex(q.windowWidth-50, q.windowHeight/2);
        q.endShape();


        for (var i=0;i<this.numOfPoints;i++){
          if (this.history[i].length>1){
            this.history[i].splice(0,1);
          }
          for (var j=0; j<this.history[i].length;j++){
            this.op=80*j+10;
            this.col= q.color(this.lineR,this.lineG,this.lineB,this.op);
            q.stroke(this.col);
            q.beginShape();
            q.vertex(50,q.windowHeight/2);
            q.curveVertex(50,q.windowHeight/2);
            for(var k=0; k<this.numOfPoints;k++){
              q.curveVertex(k*this.lengthBetweenPoints+50, this.history[k][j]);
            }
            q.curveVertex(q.windowWidth-50, q.windowHeight/2);
            q.vertex(q.windowWidth-50, q.windowHeight/2);
            q.endShape();
          }
        }
      }
  } ///////q.lines end
  q.detectBeat=function(level){
    if(level>q.beatCutOff && level>q.beatThreshold){
      backgroundColor = q.color(q.random(255),q.random(255),q.random(255));
      drawParticle = true;
      q.beatCutOff = level*1.2;
      q.countFramesSinceLastBeat=0;
    }
    else{
      drawParticle=false;
      if(q.countFramesSinceLastBeat <= q.beatHoldFrames){
        q.countFramesSinceLastBeat++;

      }
      else{
        q.beatCutOff *= q.beatDecayRate;
        q.beatCutOff = Math.max(q.beatCutOff,q.beatThreshold);

    }
  }
} ////////detectbeat end

}

  s.egg = function(){
    var eggbeatOn=false;
    var widthOfScreen;
    var heightOfScreen;
    var numOfScreen=1;
    var eggxpos,eggypos;
    q.amp2;
    var ellipseRadius=1;
    var ellipseRadius3 =1;
    var ellipseRadius4=1;

    q.beatHoldFrames = 20;
  //what amplitude level can trigger a beat
    q.beatThreshold = 0.4;
    //when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
    q.beatCutOff = 0;
    q.beatDecayRate = 0.98;
    q.countFramesSinceLastBeat = 0;

    var numOfSides=3;

    q.setup=function(){
      q.frameRate(60);
    }
    q.draw=function(){
      q.background(20);
      q.fill(100);
      q.noStroke();

      q.amp2=q.amplitude.getLevel();
      // numOfSides = q.map(q.amp2,0,1,3,20);

      q.detectBeat(q.amp2);
      if(eggbeatOn){
        numOfScreen=q.int(q.map(q.amp2,0,1,1,8));

      }
      console.log(eggbeatOn);

      widthOfScreen=q.windowWidth/numOfScreen; //50
      heightOfScreen=q.windowHeight/numOfScreen; //50

      q.push();

      for (var i=0;i<numOfScreen;i++){ //2
        for (var j=0;j<numOfScreen;j++){
          eggxpos=j*widthOfScreen;
          eggypos=i*heightOfScreen;
          q.fill(20);
          q.rect(eggxpos,eggypos,widthOfScreen,heightOfScreen);
          q.push();
          q.translate(-q.windowWidth/2,-q.windowHeight/2);

          q.translate(widthOfScreen/2,heightOfScreen/2);
          q.fill(255);
          ellipseRadius = q.map(q.amp2,0,1,0.5,2);
          // console.log(q.amp2);
          q.ellipse(eggxpos,eggypos,(heightOfScreen*ellipseRadius),(heightOfScreen*ellipseRadius),numOfSides);

          // q.fill(255, 215, 0,50);
          // var ellipseRadius2 = q.map(q.amp2,0,1,0.4,1.9);
          // ellipse(xpos,ypos,heightOfScreen*ellipseRadius2,heightOfScreen*ellipseRadius2);


          q.fill(255, 215, 0,100);
          ellipseRadius3 = q.map(q.amp2,0,1,0.3,1.8);
          q.ellipse(eggxpos,eggypos,heightOfScreen*ellipseRadius3,heightOfScreen*ellipseRadius3,numOfSides);


          q.fill(255, 215, 0,200);
          ellipseRadius4 = q.map(q.amp2,0,1,0,1.7);
          q.ellipse(eggxpos,eggypos,heightOfScreen*ellipseRadius4,heightOfScreen*ellipseRadius4,numOfSides);
          q.pop();
        }
      }
      q.pop();
      }
        q.detectBeat=function(level){
          if(level>q.beatCutOff && level>q.beatThreshold){
            // backgroundColor = q.color(q.random(255),q.random(255),q.random(255));
            eggbeatOn = true;
            q.beatCutOff = level*1.2;
            q.countFramesSinceLastBeat=0;
          }
          else{
            eggbeatOn=false;
            if(q.countFramesSinceLastBeat <= q.beatHoldFrames){
              q.countFramesSinceLastBeat++;

            }
            else{
              q.beatCutOff *= q.beatDecayRate;
              q.beatCutOff = Math.max(q.beatCutOff,q.beatThreshold);

          }
        }
  } ////////detectbeat end
  }//////egg end

  s.spheres=function(){
    var sphereLevel;
    var numOfMesh;
    var scaling=1.6;
    var sphereSmoothFactor=0.08;
    var sphereSum=0;

    var sphereZpos=0;
    var sphereSize=10;
    var sphereAngle=0;
    q.amp3;
    q.setup =function(){

    }
    q.draw=function(){
      q.background(20);
      q.amp3=q.amplitude.getLevel();
      q.ambientLight(150);
      q.pointLight(150,150,150);
      q.specularMaterial(255,200);

      sphereSum+=(q.amp3-sphereSum)*sphereSmoothFactor;
      // numOfMesh=sum*20*2;
      sphereZpos = sphereSum*500*scaling;
      q.push();
      q.translate(0, 0,0);
       q.rotateY(q.radians(sphereAngle));
      q.rotateX(q.radians(sphereAngle));
      // q.sphere(sphereZpos);
      q.specularMaterial(20,190,30,200);
      // q.sphere(sphereZpos-70);
      q.box(sphereZpos);
      sphereAngle++;
      q.pop();
    }
} ///////spheres end



}

// function keyPressed(){
//   if (keyCode ==32){
//     if (musicPlaying){
//       song.pause();
//       musicPlaying=false;
//     }
//     else{
//       song.play();
//       musicPlaying=true;
//     }
//   }
// }




