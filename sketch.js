var bgImage
var balloonImage
var bg, bottomGround, topGround, balloon
var obsTop1, obsTop2
var PLAY=1
var END=0
var gameState=PLAY
var restartImg, gameOverImg
var score=0


function preload(){
  bgImage = loadImage ("images/bg balloon.png")
  balloonImage = loadAnimation("images/balloon1.png","images/balloon2.png","images/balloon3.png")
  obsTop1 = loadImage("images/obsTop1.png")
  obsTop2 = loadImage("images/obsTop2.png")
  obsBottom1 = loadImage("images/obsBottom1.png")
  obsBottom2 = loadImage("images/obsBottom2.png")
  obsBottom3 = loadImage("images/obsBottom3.png")
  restartImg = loadImage("images/restart.png")
  gameOverImg = loadImage("images/gameOver.png")
  jumpSound = loadSound("images/jump.mp3")
  dieSound = loadSound("images/die.mp3")
  bgNight = loadImage("images/bgImg2.jpg")
}

function setup() {
  createCanvas(1280,570);
  
  bg= createSprite(640,290,20,20)
  getBackgroundImg()
  
  balloon= createSprite(70,200,20,20)
  balloon.addAnimation("balloon",balloonImage)
  balloon.scale= 0.3

  bottomGround= createSprite(400,480,800,20)
  bottomGround.visible= false

  topGround= createSprite(400,-300,800,20)
  topGround.visible= false
  topObstacleGroup= new Group()
  bottomObstacleGroup= new Group()

  restart= createSprite(640,200,20,20)
  restart.addImage(restartImg)
  restart.visible=false
  restart.scale= 0.5

  gameOver= createSprite(640,250,20,20)
  gameOver.addImage(gameOverImg)
  gameOver.visible=false
  gameOver.scale= 0.5

  barGroup = new Group ()
}

function draw() {
  background(255,255,255);  
  if(gameState===PLAY){
    if(keyDown("space")){
      balloon.velocityY= -6
      jumpSound.play()
    }
  
    balloon.velocityY= balloon.velocityY+2
    bar()
    spawnObstaclesBottom()
    spawnObstaclesTop()
    if(topObstacleGroup.isTouching(balloon)|| balloon.isTouching(topGround) || bottomObstacleGroup.isTouching(balloon) || balloon.isTouching(bottomGround)){
      gameState=END
      dieSound.play()
    }
  }
  if(gameState===END){
    balloon.velocityX=0
    balloon.velocityY=0
    topObstacleGroup.setVelocityXEach(0)
    bottomObstacleGroup.setVelocityXEach(0)
    topObstacleGroup.setLifetimeEach(-1)
    bottomObstacleGroup.setLifetimeEach(-1)
    gameOver.visible= true
    restart.visible= true
    balloon.y= 100
    if(mousePressedOver(restart)){
      reset()
    }
  }
  
  drawSprites();
  
  Score()

}

function reset(){
  gameState= PLAY
  gameOver.visible=false
  restart.visible= false
  topObstacleGroup.destroyEach()
  bottomObstacleGroup.destroyEach()
  score= 0
}

function spawnObstaclesTop(){
  if(World.frameCount%60=== 0){
    obstaclesTop=createSprite(1280,10,2,2)
    obstaclesTop.scale= 0.09
    obstaclesTop.velocityX= -4
    obstaclesTop.y= Math.round(random(55,150))
    var r= Math.round(random(1,2)) 
    switch (r){
      case 1: obstaclesTop.addImage(obsTop1)
      break;
      case 2: obstaclesTop.addImage(obsTop2)
      break;
      default:break;
    }
    obstaclesTop.lifetime= 350
    balloon.depth= balloon.depth+1
    topObstacleGroup.add(obstaclesTop)
    
  }

}


function spawnObstaclesBottom(){
  if(World.frameCount%100=== 0){
    obstaclesBottom=createSprite(1200,480,2,2)
    obstaclesBottom.scale= 0.1
    obstaclesBottom.velocityX= -4
    
    var r= Math.round(random(1,3)) 
    switch (r){
      case 1: obstaclesBottom.addImage(obsBottom1)
      break;
      case 2: obstaclesBottom.addImage(obsBottom2)
      break;
      case 3: obstaclesBottom.addImage(obsBottom3)
      break;
      default:break;
    }
    obstaclesBottom.lifetime= 350
    balloon.depth= balloon.depth+1
    bottomObstacleGroup.add(obstaclesBottom)
  }

}

function bar(){
  if(World.frameCount%60===0){
    var bar = createSprite(400,200,10,570)
    bar.velocityX= -5
    bar.depth= balloon.depth
    bar.lifetime= 70
    barGroup.add(bar)
    bar.visible= false
  }

}

function Score (){
  if(balloon.isTouching(barGroup)){
    score+=1
  }
  textSize(30)
  fill("green")
  text("score "+score,250,50)
}

async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJson = await response.json()
  var dt = responseJson.datetime
  var hour = dt.slice(11,13)
  if(hour>=06 && hour<=16){
    bg.addImage(bgImage)
    bg.scale= 1
  

  }

  else{
    bg.addImage(bgNight)
    bg.scale= 3
    bg.x = 700
    bg.y = 200
  }
}
