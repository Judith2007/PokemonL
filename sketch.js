var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pokemon, pokemon_running, pokemon_collided;
var backgroundImage, invisibleGround;

var obstaclesGroup, obstacle1, obstacle2;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var sol,solImage;

function preload(){
  pokemon_running =loadAnimation("pokemon1.png","pokemon2.png");
  pokemon_collided = loadAnimation("pokemon_collided.png");
  
  backgroundImage = loadImage("fondo0.png");
  
    groundImage = loadImage("ground2.png");
 
  solImage=loadImage("sol.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  
  //crea el fondo
  scene = createSprite(600,100);
  scene.addImage(backgroundImage);
 scene.scale = 0.5;
 
   edges= createEdgeSprites();
  

  var message = "This is a message";
 console.log(message)
  
   ground = createSprite(1800,120);
  ground.addImage("ground",groundImage);
 ground.x = ground.width /2;
  
  pokemon = createSprite(50,160,20,50);
  pokemon.addAnimation("running", pokemon_running);
  pokemon.addAnimation("collided", pokemon_collided);
  
  invisibleGround = createSprite(300,195,600,10);
  invisibleGround.visible = false;
  

  pokemon.scale = 0.4;
  
  sol = createSprite(19,25,10,200);
  sol.addImage("sol",solImage);
  sol.scale=0.045
 
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  
  pokemon.setCollider("rectangle",0,0,pokemon.width,pokemon.height-70);
  pokemon.debug = true
  
  score = 0;
  
}

function draw() {
  
    background(0);
  //fondo en movimiento
    scene.velocityX = -6
    ground.velocityX=-6;
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
  
    scene.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
       if (scene.x < 100){
      scene.x = scene. width/4;
          
    }
    
    if(ground.x < 100){
      ground.x =  ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& pokemon.y >= 100) {
        pokemon.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    pokemon.velocityY = pokemon.velocityY + 0.8
  
   
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(pokemon)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     scene.velocityX=0;
     ground.velocityX=0;
      
      //change the trex animation
      pokemon.changeAnimation("collided", pokemon_collided);
    
  if(mousePressedOver(restart)) {
      reset();
   }
    
      pokemon.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
   
     obstaclesGroup.setVelocityXEach(0);
       
     
   }
  
 
  //stop trex from falling down
  pokemon.collide(invisibleGround);
console.log(gameState)
  drawSprites();
   //displaying score
  text("Score: "+ score, 500,50);
}

function reset(){
 gameState=PLAY;
 gameOver.visible=false
 restart.visible=false
  obstaclesGroup.destroyEach();
  pokemon.changeAnimation("running",pokemon_running);
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6+ score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=0.14;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=0.18;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
   
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

