var PLAY = 0;
var END = 1;
var START = 2;
var INSTRUCTIONS = 3;

var bgSound;
var gamestate = START;
var energy = 0;

var doorImg, ghostStanding, ghostJumping, towerImg, climbImg;
var tower;
var coin,coinImg,coinGroup;
var edges;
var doorGroup, DestroyerGroup, ClimberGroup;
var score = 0;
var bgSound,deathSound;

function preload() {
  towerImg = loadImage("tower.png")
  doorImg = loadImage("door.png")
  ghostJumping = loadImage("ghost-jumping.png")
  ghostStanding = loadImage("ghost-standing.png")
  coinImg = loadImage("coin.png");
  climbImg = loadImage("climber.png");
  bgSound = loadSound("daedsilence-24784.mp3");
  deathSound = loadSound("death_scream_1.mp3");
 
  
  
}


function setup() {
  createCanvas(500, 500);
  tower = createSprite(250, 250);
  tower.addImage(towerImg);
  ghost = createSprite(250, 250);
  ghost.addImage(ghostJumping);
  ghost.scale = 0.3;
  edges = createEdgeSprites();
  doorGroup = new Group();
  DestroyerGroup = new Group();
  ClimberGroup = new Group();
  coinGroup = new Group();
  bgSound.loop();
  
 
}


function draw() {
  ghost.addImage(ghostJumping)
  ghost.depth += 1;
  background("black");
  drawSprites();
  if (gamestate === START) {
    tower.visible = false;
    ghost.visible = false;
    textSize(35);
    fill("yellow");
    text("GHOST RUNNER", 120, 250);
    textSize(20);
    text("Press enter to start", 170, 300);
    
  }
   
  if (gamestate === START && keyDown("enter")) {
    gamestate = INSTRUCTIONS;
  }
  if (gamestate === INSTRUCTIONS) {
     
    textSize(20);
    fill("yellow");
    text("Welcome to Ghost Runner!", 50, 30);
    text("Jump with space bar", 50, 60);
    text("Move left and right with arrow keys", 50, 90);
    text("You can stand on doors", 50, 120);
    text("Don't touch the bottom of a door or you'll die",50,150);
    text("Energy will decrease after sometime by 2 units.", 50, 180);
    text("If energy goes below 0, you'll die!!", 50, 210);
    text("There are energy potions on  the doors.collect them.", 35, 240);
     text("if you fall from the tower,you'll die", 50, 270);
    text("Good luck!", 50, 300);
    text("Press s to start", 150, 360);
    if (keyDown("s")) {
    gamestate = PLAY;
    gamestate = PLAY;
    ghost.x = 250;
    ghost.y = 250;
    ghost.visible = true;
    tower.visible = true;
    tower.x = 250;
    tower.y = 250;
    score = 0;
  }
    
  }
  
  if (gamestate === PLAY) {
   
    
   
    
    
    ghost.velocityY = ghost.velocityY + 0.8
    tower.velocityY = +(5 + 3* score/20);
    spawnDoors();
    
    
    
   
   
    if (tower.y > 500) {
      tower.y = 250;
    }
    if (keyWentDown("space")) {
      ghost.velocityY = -10;
    }
    if (keyDown("LEFT_ARROW")) {
      ghost.x = ghost.x - 4;
    }
    if (keyDown("RIGHT_ARROW")) {
      ghost.x = ghost.x + 4;
    }
    ghost.collide(edges[1]);
    ghost.collide(edges[0]);
  
    if (ghost.collide(edges[3])) {
        gamestate = END;
        deathSound.play();
      
    }
    if (DestroyerGroup.isTouching(ghost)) {
      gamestate = END;
      deathSound.play();
    }
    
  
    
    ghost.collide(ClimberGroup);
    if (ghost.isTouching(doorGroup)) {
      ghost.addImage(ghostStanding);
    }
    textSize(15);
    fill("yellow");
    text("Score: " + score, 420, 30);
    text("energy:" + energy , 15,30);
    if (World.frameCount % 60 === 0) {
      score += 1;
      
    }
    
    if(World.frameCount % 400===0){
      energy = energy-2;
    }
    
    if(energy<0){
      gamestate = END;
      deathSound.play();
    }
 
    
    if(ghost.isTouching(coinGroup)){
      energy=energy+1;
      coinGroup.destroyEach();
    }
    //console.log(World.frameCount);
  }
  if (gamestate === END) {
    
    tower.visible = false;
    ghost.visible = false;
    DestroyerGroup.destroyEach();
    ClimberGroup.destroyEach();
    doorGroup.destroyEach();
    coinGroup.destroyEach();
    textSize(30);
    fill("yellow");
    text("GAME OVER", 160, 250);
    textSize(25);
    text("Your score was: " + score, 150, 350);
    text("your energy was:" + energy,150,380);
    text("Press r to reset", 160, 150);
  }
  if (gamestate === END && keyDown("r")) {
    gamestate = PLAY;
    ghost.x = 250;
    ghost.y = 250;
    ghost.visible = true;
    tower.visible = true;
    tower.x = 250;
    tower.y = 250;
    score = 0;
    energy = 0;
    frameCount = 0;
  }

 
}

function spawnDoors() {
  if (World.frameCount % 80 === 0) {
    var door = createSprite(random(50, 450), -20);
    var climber = createSprite(door.x, 30);
    climber.velocityY = +(5 + score/20);
    climber.addImage(climbImg);
    ClimberGroup.add(climber);
    var climbDestroyer = createSprite(door.x, 35, 50, 5);
    climbDestroyer.velocityY = +(5+score/20);
    climbDestroyer.visible = false;
    DestroyerGroup.add(climbDestroyer);
    door.addImage(doorImg);
    door.velocityY = +(5+score/20);
    door.lifetime = 200;
    doorGroup.add(door);
    var coin = createSprite(door.x,10);
    coin.velocityY = +(5+score/20);
    coinGroup.add(coin);
    coin.addImage(coinImg);
    coin.scale = 0.07;
    coin.lifetime = 200;
    climber.lifetime = 200;
    climbDestroyer.lifetime = 200;
  }
 
}
