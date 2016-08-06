var allSketch1 = function(q){
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
    canvas1 =q.createCanvas(q.windowWidth,q.windowHeight,q.WEBGL);
    // canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
    canvas1.parent('sketchholder1');

    q.song.play();
    q.frameRate(20);

    // button1=q.createButton('sketch1');
    // button1.position(0,0);
    // button1.mousePressed(s.movingbox);


    // button2=q.createButton('sketch2');
    // button2.position(40,0);
    // button2.mousePressed(s.freqcurve);

    // button3=q.createButton('sketch3');
    // button3.position(80,0);
    // button3.mousePressed(s.egg);

    q.amplitude = new p5.Amplitude();
    q.amplitude.setInput(q.song);

    q.fft = new p5.FFT();
    q.fft.setInput(q.song);

  }

  q.draw=function(){
    q.background(20);
    // if button clicked hide div.
    s.movingbox();

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
    }

      q.draw=function(){
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



  }
  } //////////movingbox end