/**
 *
 * 
 * 
 * 
 *
 */
var Colors = {
	cherry: 0xe35d6a,
	blue: 0x1560bd,
	white: 0xd8d0d1,
	black: 0x000000,
	brown: 0x59332e,
	peach: 0xffdab9,
	yellow: 0xffff00,
	olive: 0x556b2f,
	grey: 0x696969,
	sand: 0xc2b280,
	brownDark: 0x23190f,
	green: 0x669900,
};

var arrObstacle = ["Rocks.glb", "Rocks.glb"];
var goldenballObject = [];
const clock = new THREE.Clock();
mixers = [];
var deg2Rad = Math.PI / 180;
var charX = 0,
	charY,
	charZ,
	charObject = [],
	ballPObject = [],
	ballPObjectTrash = [],
	pupObjectTrash = [],
	pupRefineTrash = [],
	pupSmoothTrash = [],
		pupCigarTrash = [],
		pupBottleTrash = [],
	pupStylishTrash = [],
	chevronObject = [],
	refinedObject =[],
	smoothObject =[],
	cigarObject =[],
	bottleObject =[],
	stylishObject =[],
	powerUpsObject = [],
	pupCigarObject = [],
	pupBottleObject = [],
	pupRefineObject = [],
	pupSmoothObject = [],
	pupStylishObject = [],
	mgPackObject = [],
	sceneryObject = [],
	gameSpeed = 180,
	charSize = 200,
	mixer,
	mixerScenery,
	shield = false,
	myGreenScreenMaterial,
	times2 = 1,
	currentPosZ,
	magnetCount = 0;
	iOSadj = 0,
	bbObject = [];
	bbRoad = [];
	

var url_string = window.location.href;
var url = new URL(url_string);
var color = url.searchParams.get("color");

// Check if OS of mobile device for accelerometer issue
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if(iOS == true){
	//iOSadj = -1000;
}
// Make a new world when the page is loaded.
window.addEventListener('load', function(){
	new World();
});


/** 
 *
 * THE WORLD
 * 
 * 
 *
 */

/** 
  * A class of which the world is an instance. Initializes the game
  * and contains the main game loop.
  *
  */
function World() {

	// Explicit binding of this even in changing contexts.
	var self = this;

	// Scoped variables in this world.
	var element, scene, camera, character, renderer, light,
		objects, paused, keysAllowed, score, difficulty,lightHolder_R,
		treePresenceProb, maxTreeSize, fogDistance, gameOver, timer, gltfObject,character1, countdown,countdownSFX,
		splashSFX,pointsEarnSFX,buttonClickSFX,powerUpSFX,obstacleBumpSFX,gameOverSFX,goldSplashSFX;
	//var left_right = event.accelerationIncludingGravity.x;
	// Initialize the world.
	// Locate where the world is to be located on the screen.
	element = document.getElementById('world');

	// Initialize the renderer.
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});
	//renderer.gammaFactor = 2.2;
	renderer.setSize(element.clientWidth, element.clientHeight);
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.gammaOutput = true;
	element.appendChild(renderer.domElement);

	// Initialize the scene.
	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0xffffff);
	fogDistance = 80000;
	scene.fog = new THREE.Fog(0xffffff, 1, fogDistance);//0xbadbe4 0xd8d0d1

	// Initialize the camera with field of view, aspect ratio,
	// near plane, and far plane.
	camera = new THREE.PerspectiveCamera(
		60, element.clientWidth / element.clientHeight, 1, 120000);
	camera.position.set(0, 1500, -1500);//0,1500, -1500
	camera.lookAt(new THREE.Vector3(0, 600, -5000));//0,600,-5000
	window.camera = camera;

	// Set up resizing capabilities.
	window.addEventListener('resize', handleWindowResize, false);

	//Inititialize SFX
	splashSFX = new splashPage();
	countdownSFX = new countDown();
	pointsEarnSFX = new pointsEarn();
	powerUpSFX = new powerUpSound();
	obstacleBumpSFX = new obstacleBump();
	goldSplashSFX = new goldSplash();
	// Initialize the lights.
	light = new THREE.HemisphereLight(0xffffff, 0x080820,0.2);
	scene.add(light);
	var ambLight = new THREE.AmbientLight( 0xffffff); //0x404040 soft white light//0xffffff
	scene.add( ambLight );
	// Add a point light that will cast shadows
	var pointLight = new THREE.PointLight( 0xffffff, 1 );//0.2,
	pointLight.position.set( 0, 0, -2000 );//-8000
	pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 2048;
	pointLight.shadow.mapSize.height = 2048;
	scene.add( pointLight );

	// Initialize the character and add it to the scene.
	character = new Character();
	scene.add(character);

	const manager = new THREE.LoadingManager();
	manager.onLoad = init;
	const progressbarElem = document.querySelector('#progressbar');

	manager.onProgress = (url, itemsLoaded, itemsTotal) => {
	progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
	};

	const models = {
		redBall: { url:'models/Ball-Red.glb' },
		yellowBall: { url:'models/Yellow-New.glb' },
		greenBall: { url:'models/Ball-Green-.glb' },
		blueBall: { url:'models/Blue-New.glb' },
		
	
		rocks: { url:'models/Rocks.glb' },
		bb1908: {url:'models/1908_v2.glb'},
		bb1920: {url:'models/1908_v2.glb'},
		bb1954: {url:'models/1908_v2.glb'},
		bb1956: {url:'models/1908_v2.glb'},
		bb1988: {url:'models/1908_v2.glb'},
		bb2020: {url:'models/1908_v2.glb'},
		bbroad: {url:'models/Road-long-v4.glb'},
		
	}
	{
		const gltfLoader = new THREE.GLTFLoader(manager);
		for (const model of Object.values(models)) {
		  gltfLoader.load(model.url, (gltf) => {
			model.gltf = gltf;
		  });
		}
		
	}
	function prepModelsAndAnimations() {
		Object.values(models).forEach(model => {
		  const animsByName = {};
		  model.gltf.animations.forEach((clip) => {
			animsByName[clip.name] = clip;
		  });
		  model.animations = animsByName;
		});
	}
	/**
	  * Builds the renderer, scene, lights, camera, and the character,
	  * then begins the rendering loop.
	  */
	function init() {

		const loadingElem = document.querySelector('#loading');
  		loadingElem.style.display = 'none';
		//prepModelsAndAnimations();
		
		//goldenBallWebm();
		//console.log(character);

		//Initiate Avatar
		if(color == "red"){
			createAvatar(models.redBall, -50, (-4000 + iOSadj));
		}
		else if(color == "gold"){
			createAvatar(models.yellowBall, -450,(-4000 + iOSadj));
		}
		else if(color == "green"){
			createAvatar(models.greenBall, -1250, (-4000 + iOSadj));
		}
		else if(color == "blue"){
			createAvatar(models.blueBall, -850, (-4000 + iOSadj));
		}
		//Initialize buildings
		var roadXYZ = -264000;//-7300,-43800
		for (var i = 0; i<1; i++){
			//createRoad(models.road,roadXYZ);
			createBuildings(roadXYZ);
			//roadXYZ = roadXYZ - 12000;
			//console.log(sceneryObject)
		}
		
		//Initiate Billboard - Finish line
		//billBoard1908(97, models.bb1908);
		billBoardRoad(0, models.bbroad);
		billBoardRight(5, models.bb1908);
		billBoardLeft(11, models.bb1920);
		billBoardRight(40, models.bb1954);
		billBoardLeft(70, models.bb1956);
		billBoardRight(90, models.bb1988);
		billBoardLeft(100, models.bb2020);
		//Load the Orbitcontroller
		//var controls = new THREE.OrbitControls( camera, renderer.domElement );
		//var ground = createGround(3000, 20, 120000, Colors.white, 0, -700, -60000);//createGround(3000, 20, 120000, Colors.white, 0, -700, -60000)
		//scene.add(ground);
		//controls.target.set(0, 5, 0);
		//controls.update();

		objects = [];
		gltfObject = [];
		treePresenceProb = 0.29;//0.2
		maxTreeSize = 1;
		for (var i = 5; i<168; i++) {
			//createRowOfTrees(i * -3000, treePresenceProb, 0.5, maxTreeSize);
			switch(i) {
				case 1:
					createRowOfTrees(1 * -1000, treePresenceProb, 0.5, maxTreeSize);
					break;
					
				
				
				case 11:
					createOrbs(11 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				/*case 12:
					createOrbs(12 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;*/
				case 13:
					bottlePU(13);
					break;
				case 15:
					createOrbs(15 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				/*case 15:
					createOrbs(15 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;*/
				case 17:
					bottlePU(17);
					break;
				case 19:
					createOrbs(19 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 21:
					createRowOfTrees(21 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 22:
					createOrbs(15 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 23:
					bottlePU(23);
					break;
					case 24:
					createOrbs(24 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;

				case 26:
					createRowOfTrees(26 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 28:
					createOrbs(28 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 29:
					createOrbs(29 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 31:
					cigarPU(31);
					break;
				case 33:
					createOrbs(33 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 35:
					createOrbs(35 * -3000, treePresenceProb, 0.5, maxTreeSize);
					
					break;
				case 36:
					createOrbs(36 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 37:
					createRowOfTrees(37 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 38:
					cigarPU(38);
					break;
				case 39:
					stylishPU(39);
					break;
				case 40:
                    stylishPU(40);
					break;
				case 42:
					createRowOfTrees(42 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 44:
					createOrbs(44 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 46:
					createOrbs(46 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 48:
					bottlePU(48);
					break;
				case 50:
					createRowOfTrees(50 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 53:
					createOrbs(53 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 55:
					createOrbs(55 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 58:
					refinedPU(58);
					break;
					case 59:
					createOrbs(59 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 59:
					createOrbs(59 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 60:
					createRowOfTrees(60 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 63:
					bottlePU(63);
					break;
				case 64:
					smoothPU(64);
					break;
				case 65:
					createOrbs(65 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 66:
					cigarPU(66);
					break;
				case 68:
					createRowOfTrees(68 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 71:
					createOrbs(71 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 73:
				bottlePU(13);
					break;
				case 75:
					createOrbs(75 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 80:
					createOrbs(80 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 85:
					createRowOfTrees(85 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 87:
					bottlePU(87);
					break;
				case 89:
					createOrbs(89 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 91:
						cigarPU(91);
					break;
				case 93:
					createRowOfTrees(93 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 95:
					createOrbs(95 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 97:
					createOrbs(97 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				
				case 100:
					createRowOfTrees(100 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 102:
					createOrbs(102 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 104:
					createOrbs(104 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 106:
					cigarPU(106);
					break;
				case 108:
					createRowOfTrees(108 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 110:
					createOrbs(110 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 112:
					createRowOfTrees(112 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 114:
					createOrbs(114 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 117:
					createRowOfTrees(117 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 120:
					createOrbs(120 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 123:
					createRowOfTrees(123 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 125:
					createOrbs(125 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 130:
					createOrbs(130 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 135:
					createRowOfTrees(135 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 140:
					createOrbs(140 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
					
					case 141:
					createOrbs(141 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 142:
					createOrbs(142 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 143:
					createRowOfTrees(143 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;

	               case 145:
					createRowOfTrees(145 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 146:
					createOrbs(146 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
				case 147:
					createOrbs(147 * -3000, treePresenceProb, 0.5, maxTreeSize);
					break;
			
				

			}
			/*if(i == 22){
				refinedPU();
			}
			else if(i == 40){
				smoothPU();
			}

			else if(i == 55){
				
			}*/

		}
		
		// The game is paused to begin with and the game is not over.
		gameOver = false;
		paused = true;//true
		//Initialize timer
		timer = 45;
		document.getElementById("timer").innerHTML = "00:"+pad(timer,"2");

		//Countdown 3 seconds
		countdown = 3;

		document.getElementById("countdown").innerHTML = countdown;

		var countdownInterval = setInterval(function(){

			countdownSFX.play();
			countdown -=1;
			document.getElementById("countdown").innerHTML = countdown;
			if(countdown==0){
				document.getElementById("countdown").innerHTML = "";
				clearInterval(countdownInterval);
				paused = false;

				
				var timeInterval = setInterval(function(){
					if(timer == -3){
						gameOverTimer = 2;
						//clearInterval(timeInterval);
						window.removeEventListener("devicemotion", handleAccelerationEvent);
						/*charObject.forEach(function(object){
							object.position.z -= 7000;
						})*/

						setInterval(function(){
							if(gameOverTimer == 1){
								gameOver = true;
								paused = true;
								if(score >= 50){
									/*sendMessage({
									    action: 'goToNextStep'
									});*/
									location.href="won.html?score="+score;
								}
								else if(score <= 49){
									location.href="won.html?score=0"
								}
								;
							}
		
							gameOverTimer -= 1;
						},1000)

						
					}
								
					
					timer -= 1;
					if(timer >= 0){
						document.getElementById("timer").innerHTML = "00:"+pad(timer,"2");
					}

					if(timer == 24){
						gameSpeed = 190;
					}
					else if(timer == 18){
						gameSpeed = 200;
					}
					else if(timer == 12
						){
						gameSpeed = 200;
					}
					/*else if (timer == 10) { 
						createWall(1400, -200, 99*-3000);

					}*/
					else if(timer == 05) {
						shield = true;
						gltfObject.forEach(object => {
							object.visible = false;
						})
						chevronObject.forEach(object => {
							object.visible = false;
						})
						pupRefineObject.forEach(object => {
							object.visible = false;
						})
						pupCigarObject.forEach(object => {
							object.visible = false;
						})
							pupBottleObject.forEach(object => {
							object.visible = false;
						})
						pupSmoothObject.forEach(object => {
							object.visible = false;
						})
						pupStylishObject.forEach(object => {
							object.visible = false;
						})
						
							
					}
					else if(timer == -1){
						charObject.visible = false;
						$("#lm-red").fadeIn();
						if(charX <0){
							character.onRightKeyPressed();
						}
						else if(charX>0){
							character.onLeftKeyPressed();
						}
						
					}
					else if(timer == -2){
						$("#lm-red-old").fadeOut();
						$("#lm-red").fadeIn();
					}
					
				}, 1000);
			}
			
		}, 1000);

		function uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			  return v.toString(16);
			});
		  }

		// Start receiving feedback from the player.
		var left = 37;
		var up = 38;
		var right = 39;
		var p = 80;
		
		keysAllowed = {};
		document.addEventListener(
			'keydown',
			function(e) {
				if (!gameOver) {
					var key = e.keyCode;
					if (keysAllowed[key] === false) return;
					keysAllowed[key] = false;
					if (paused && !collisionsDetected() && key > 18) {
						paused = false;
						character.onUnpause();
						/*document.getElementById(
							"variable-content").style.visibility = "hidden";
						document.getElementById(
							"controls").style.display = "none";*/
					} else {
						if (key == p) {
							paused = true;
							character.onPause();
							/*document.getElementById(
								"variable-content").style.visibility = "visible";
							document.getElementById(
								"variable-content").innerHTML = 
								"Game is paused. Press any key to resume.";*/
						}
						if (key == up && !paused) {
							character.onUpKeyPressed();
						}
						if (key == left && !paused) {
							character.onLeftKeyPressed();
						}
						if (key == right && !paused) {
							character.onRightKeyPressed();
						}
					}
				}
			}
		);
		document.addEventListener(
			'keyup',
			function(e) {
				keysAllowed[e.keyCode] = true;
			}
		);
		document.addEventListener(
			'focus',
			function(e) {
				keysAllowed = {};
			}
		);
		
		/*window.addEventListener(
			'devicemotion',
			handleAccelerationEvent
		);*/
		/*document.addEventListener(
			'mousedown',
			onMouseDown,
			false
		);

		document.addEventListener(
			'touchstart',
			onMouseDown,
			false
		);*/
		// Initialize the scores and difficulty.
		score = 0;
		//difficulty = 0;
		document.getElementById("score").innerHTML = pad(score, '4');

		// Begin the rendering loop.
		loop();

	}
	//Device Motion
	function handleAccelerationEvent(e){
		localStorage.clear();
		var tiltControls = e.accelerationIncludingGravity.x;
		var top_bottom = e.accelerationIncludingGravity.y;

			if(tiltControls > 6 ){
				//Adjust the accelerometer if OS is Android or iOS
				if(iOS==true){
					character.onRightKeyPressed();
				}
				else{
					character.onLeftKeyPressed();
				}
			}
			else if(tiltControls < -6){
				if(iOS==true){
					character.onLeftKeyPressed();
				}
				else{
					character.onRightKeyPressed();
				}
			}
	}

	/**
	  * Alternative Controller
	  */
	// Fix for iOS issue on touch event
	$(document).on('touchstart', function(e){
	  	var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	  	console.log(touch.clientX);
	    if(touch.clientX > 160){
	    	character.onRightKeyPressed();
	    }
	    else if(touch.clientX < 160){
	    	character.onLeftKeyPressed();
	    }

	});
	// Issues on iOS
	function onMouseDown(e) {
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
	    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	    if(mouse.x > 0){
	    	character.onRightKeyPressed();
	    }
	    else if(mouse.x < 0){
	    	character.onLeftKeyPressed();
	    }
	}
	
	/**
	  * The main animation loop.
	  */
	function loop() {

		// Update the game.
		if (!paused) {

			// Add more trees and increase the difficulty.
			/*if ((objects[objects.length - 1].mesh.position.z) % 3000 == 0) {
				difficulty += 1;
				var levelLength = 30;
				if (difficulty % levelLength == 0) {
					var level = difficulty / levelLength;
					switch (level) {
						case 1:
							console.log(level);
							treePresenceProb = 0.35;
							maxTreeSize = 0.5;
							break;
						case 2:
							console.log(level);
							treePresenceProb = 0.35;
							maxTreeSize = 0.85;
							break;
						case 3:
							treePresenceProb = 0.5;
							maxTreeSize = 0.85;
							break;
						case 4:
							treePresenceProb = 0.5;
							maxTreeSize = 1.1;
							break;
						case 5:
							treePresenceProb = 0.5;
							maxTreeSize = 1.1;
							break;
						case 6:
							treePresenceProb = 0.55;
							maxTreeSize = 1.1;
							break;
						default:
							treePresenceProb = 0.55;
							maxTreeSize = 1.25;
					}
				}
				if ((difficulty >= 5 * levelLength && difficulty < 6 * levelLength)) {
					fogDistance -= (25000 / levelLength);
				} else if (difficulty >= 8 * levelLength && difficulty < 9 * levelLength) {
					fogDistance -= (5000 / levelLength);
				}
				createRowOfTrees(-120000, treePresenceProb, 0.5, maxTreeSize);
				scene.fog.far = fogDistance;
			}*/

			// Move the objects closer to the character.
			/*
			objects.forEach(function(object) {
				object.mesh.position.z += gameSpeed;
			});
			sceneryObject.forEach(function(object) {
				object.position.z += gameSpeed;

			});
			ballPObject.forEach(function(object) {
				object.mesh.position.z += gameSpeed;
			});

			chevronObject.forEach(function(object) {
				object.position.z += gameSpeed;
			});

			gltfObject.forEach(function(object) {
				object.position.z += gameSpeed;
			});


			powerUpsObject.forEach(function(object) {
				object.position.z += gameSpeed;
			});
			
			refinedObject.forEach(function(object) {
				object.mesh.position.z += gameSpeed;
			});
			smoothObject.forEach(function(object) {
				object.mesh.position.z += gameSpeed;
			});
			stylishObject.forEach(function(object) {
				object.mesh.position.z += gameSpeed;
			});
			
			mgPackObject.forEach(function(object) {
				object.mesh.position.z += gameSpeed;
			});
			*/
			charObject.forEach(function(object){
				currentPosZ = object.position.z -= gameSpeed;

			});
			if(timer > -1){
				character.element.position.z -= gameSpeed;
				camera.position.z -= gameSpeed;
			}
			
			/*
			gltfObject = gltfObject.filter(function(object) {
				return object.position.z < 0;
			});*/


			// Remove objects that are outside of the world.
			objects = objects.filter(function(object) {
				return object.mesh.position.z < 0;
			});

			ballPObject = ballPObject.filter(function(object) {
				return object.mesh.position.z < 0;
			});	

			// Make the character move according to the controls.
			character.update();

			// Check for collisions between the character and objects.
			if(collisionsDetectedBall()){
				pointsEarnSFX.play();
				score += 2*times2;
				document.getElementById("score").innerHTML = pad(score, '4');
			}
			if(collisionsDetectedRefined()){
				powerUpSFX.play();
				times2 = 2;
				var powerUpsTimer = 3;
				//$('#power-ups1').addClass('visible');
				//$('#power-ups1').removeClass('hidden');
				var powerUpsInterval = setInterval(function(){
					if(powerUpsTimer==0){
						times2 = 1; //Return the pointing system in to normal
						//document.getElementById("power-ups").src = "";
						//document.getElementById("power-ups1").style.display = "none";
						//$('#power-ups1').addClass('hidden');
						//$('#power-ups1').removeClass('visible');
						clearInterval(powerUpsInterval);
					}
					powerUpsTimer -=1;
				},1000);
			}
			
			if(collisionsDetectedCigar()){
					pointsEarnSFX.play();
				score += 2*times2;
				document.getElementById("score").innerHTML = pad(score, '4');
			}
			
				if(collisionsDetectedBottle()){
					pointsEarnSFX.play();
				score += 2*times2;
				document.getElementById("score").innerHTML = pad(score, '4');
			}
			if(collisionsDetectedSmooth()){
				powerUpSFX.play();
				shield = true;
				var powerUpsTimer = 3;
				//$('#power-ups2').addClass('visible');
				//$('#power-ups2').removeClass('hidden');
				var powerUpsInterval = setInterval(function(){
					if(powerUpsTimer==0){
						shield = false;
						//$('#power-ups2').addClass('hidden');
						//$('#power-ups2').removeClass('visible');
						clearInterval(powerUpsInterval);
					}
					powerUpsTimer -=1;
				},1000);
			}

			if(collisionsDetectedStylish()){
				powerUpSFX.play();
				var powerUpsTimer = 5;
				//$('#power-ups3').addClass('visible');
				//$('#power-ups3').removeClass('hidden');
				var powerUpsInterval = setInterval(function(){
					chevronObject.forEach(function(object) {
		
						
						//object.mesh.position.z += gameSpeed;
					});
					if(powerUpsTimer==0){
						shield = false;
						//$('#power-ups3').addClass('hidden');
						//$('#power-ups3').removeClass('visible');
						clearInterval(powerUpsInterval);
					}
					powerUpsTimer -=1;
				},1000);
			}
			/*if(collisionsDetectedMGPack()){
				//splashSFX.stop();
				//goldSplashSFX.play();
				detailerTimer =6;
				gameOver = true;
				paused = true;
				//flowDown();
				
				charObject.forEach(function(object) {
					object.position.z = -4100;
					object.visible	= false;
				});
				setInterval(function(){
					if(detailerTimer==0){
						location.href="detailer_1.php?score="+score;
					}
					detailerTimer -=1;
				}, 1000)
			}*/
			if (collisionsDetected()) {
				obstacleBumpSFX.play();
				gameOver = true;
				paused = true;
				gameOverTimer = 1;
				setInterval(function(){
					if(gameOverTimer==0){
						location.href="game-over.html?color="+color;
					}
					gameOverTimer -=1;
				}, 1000)
				
			
				/*document.addEventListener(
        			'keydown',
        			function(e) {
        				if (e.keyCode == 40)
            			document.location.reload(true);
        			}
    			);*/
    			/*var variableContent = document.getElementById("variable-content");
    			variableContent.style.visibility = "visible";
    			variableContent.innerHTML = 
    				"Game over! Press the down arrow to try again.";
    			var table = document.getElementById("ranks");
    			var rankNames = ["Typical Engineer", "Couch Potato", "Weekend Jogger", "Daily Runner",
    				"Local Prospect", "Regional Star", "National Champ", "Second Mo Farah"];
    			var rankIndex = Math.floor(score / 15000);*/

				// If applicable, display the next achievable rank.
				/*if (score < 124000) {
					var nextRankRow = table.insertRow(0);
					nextRankRow.insertCell(0).innerHTML = (rankIndex <= 5)
						? "".concat((rankIndex + 1) * 15, "k-", (rankIndex + 2) * 15, "k")
						: (rankIndex == 6)
							? "105k-124k"
							: "124k+";
					nextRankRow.insertCell(1).innerHTML = "*Score within this range to earn the next rank*";
				}*/

				// Display the achieved rank.
				/*var achievedRankRow = table.insertRow(0);
				achievedRankRow.insertCell(0).innerHTML = (rankIndex <= 6)
					? "".concat(rankIndex * 15, "k-", (rankIndex + 1) * 15, "k").bold()
					: (score < 124000)
						? "105k-124k".bold()
						: "124k+".bold();
				achievedRankRow.insertCell(1).innerHTML = (rankIndex <= 6)
					? "Congrats! You're a ".concat(rankNames[rankIndex], "!").bold()
					: (score < 124000)
						? "Congrats! You're a ".concat(rankNames[7], "!").bold()
						: "Congrats! You exceeded the creator's high score of 123790 and beat the game!".bold();
				*/

    			// Display all ranks lower than the achieved rank.
    			/*if (score >= 120000) {
    				rankIndex = 7;
    			}
    			for (var i = 0; i < rankIndex; i++) {
    				var row = table.insertRow(i);
    				row.insertCell(0).innerHTML = "".concat(i * 15, "k-", (i + 1) * 15, "k");
    				row.insertCell(1).innerHTML = rankNames[i];
    			}
    			if (score > 124000) {
    				var row = table.insertRow(7);
    				row.insertCell(0).innerHTML = "105k-124k";
    				row.insertCell(1).innerHTML = rankNames[7];
    			}*/

			}
			
			
			//Update size of avatar
			/*if(score >=8 && score <=15  ){
				charObject.forEach(function(object) {
					//object.scale.set(1.3,1.3,1.3);
					//object.scale.set(220,220,220);
				});
			}
			else if(score >=16 && score <=19 ){
				charObject.forEach(function(object) {
					//object.scale.set(1.6,1.6,1.6);
					//object.scale.set(230,230,230);
				});
			}
			else if(score >=20){
				charObject.forEach(function(object) {
					//object.scale.set(2,2,2);
					//object.scale.set(240,240,240);
				});
			}*/
			// Update the scores.

			//score += 10;
			// /document.getElementById("score").innerHTML = pad(score, '4');
			var delta = clock.getDelta();
			mixer.update(delta);
			//mixerScenery.update(delta);
			

		}

		// Render the page and repeat.
		renderer.render(scene, camera);
		requestAnimationFrame(loop);

		
	}

	/**
	  * A method called when window is resized.
	  */
	function handleWindowResize() {
		renderer.setSize(element.clientWidth, element.clientHeight);
		camera.aspect = element.clientWidth / element.clientHeight;
		camera.updateProjectionMatrix();
	}

	/**
	 * Creates and returns a row of trees according to the specifications.
	 *
	 * @param {number} POSITION The z-position of the row of trees.
 	 * @param {number} PROBABILITY The probability that a given lane in the row
 	 *                             has a tree.
 	 * @param {number} MINSCALE The minimum size of the trees. The trees have a 
 	 *							uniformly distributed size from minScale to maxScale.
 	 * @param {number} MAXSCALE The maximum size of the trees.
 	 *
	 */


	function createAvatar(model,x,z){
		model.gltf.scene.scale.set(1,1,1);			   
		model.gltf.scene.position.x = x;				    //Position (x = right+ left-) 
		model.gltf.scene.position.y = 0;				    //Position (y = up+, down-)
		model.gltf.scene.position.z = z;				    //Position (z = front +, back-)

		char = model.gltf.scene;
		char.animations;
		charObject.push(char);
		scene.add(char);
		mixer = new THREE.AnimationMixer(char);
		model.gltf.animations.forEach(animation => {
		        mixer
		        .clipAction(animation, char)
		        .play();
		});
	}
	

	function flowDown(){
		var geometry = new THREE.BoxGeometry(2500, 2500, 2500);
	    var video = document.getElementById('flow-down');
	   	var texture = new THREE.VideoTexture(video);
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;
	        texture.format = THREE.RGBFormat;
	    var material = new THREE.ShaderMaterial({
	            uniforms: {
	                texture: { value: texture },
	                color: { value: new THREE.Color(0x000000) }
	            },
	            vertexShader: document.querySelector('#post-vert').textContent.trim(),
	            fragmentShader: document.querySelector('#post-frag').textContent.trim(),
	            transparent: true,
	        });
	    var cube = new THREE.Mesh(geometry, material);
	    cube.position.set(0,1200,-6000);
	    scene.add(cube);
	    //console.log(cube);
	}
	function flowUp(){
		var geometry = new THREE.BoxGeometry(4200, 4200, 4200);
	    var video = document.getElementById('flow-up');
	    video.play();
	   	var texture = new THREE.VideoTexture(video);
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;
	        texture.format = THREE.RGBFormat;
	    var material = new THREE.ShaderMaterial({
	            uniforms: {
	                texture: { value: texture },
	                color: { value: new THREE.Color(0x000000) }
	            },
	            vertexShader: document.querySelector('#post-vert').textContent.trim(),
	            fragmentShader: document.querySelector('#post-frag').textContent.trim(),
	            transparent: true,
	        });
	    var cube = new THREE.Mesh(geometry, material);
	    cube.position.set(0,0,-6000);
	    scene.add(cube);
	    //console.log(cube);
	}
	function goldenBallWebm(){
		var geometry = new THREE.BoxGeometry(600, 800);
	    var video = document.getElementById('golden-ball');
	    video.play();
	   	var texture = new THREE.VideoTexture(video);
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;
	        texture.format = THREE.RGBFormat;
	    var material = new THREE.ShaderMaterial({
	            uniforms: {
	                texture: { value: texture },
	                color: { value: new THREE.Color(0x00FF00) }
	            },
	            vertexShader: document.querySelector('#post-vert').textContent.trim(),
	            fragmentShader: document.querySelector('#post-frag').textContent.trim(),
	            transparent: true,
	        });
	    var cube = new THREE.Mesh(geometry, material);
	    //cube.rotation.y = 400;
	    cube.position.set(0,0,-5000);
	    charObject.push(cube);
	    console.log(cube);
	    scene.add(cube);
	    //console.log(cube);
	}
	function createRowOfTrees(position, probability, minScale, maxScale) {
		/* Use this code if you want row of trees
		for (var lane = -1; lane < 2 ; lane++) {
			if(lane==0){
				continue;
			}
			var randomNumber = Math.random();
			if (randomNumber < probability) {
				var scale = minScale + (maxScale - minScale) * Math.random();
				var tree = new Tree(lane * 800, -400, position, scale);

				objects.push(tree);
				scene.add(tree.mesh);

			}
		}*/
		//var arrLane = [-1,0,1];
		var lane = Math.floor(Math.random()*2);
		var randObs = Math.floor(Math.random()*2);4
		if(arrObstacle[randObs] == 'Rocks.glb'){
			
	var arrLane = [-1,0,1];
			var scale = minScale + (maxScale - minScale) * Math.random();
		}
		else{
			var arrLane = [-1,0,1];
			var scale = minScale + (maxScale - minScale) * Math.random();
		}
		//var randomNumber = Math.random();
			//if (randomNumber < probability) {
				//var scale = minScale + (maxScale - minScale) * Math.random();
				var tree = new Tree(arrLane[lane] * 800, -400, position, scale);	
				//var sphere = new Sphere(arrLane[lane] * 800 , -1000, position+3000, 8);
				
				var loader = new THREE.GLTFLoader();
				/*if(arrLane[lane]== 0){
					loader.load( 'model/Obstacle 3.glb', function ( gltf ) {

						gltf.scene.traverse(function(node) {
						    if (node instanceof THREE.Mesh) {
						      node.castShadow = true;
						    }
						});
						gltf.scene.scale.set( 7, 7, 7 );			   
						gltf.scene.position.x = arrLane[lane] * 800;				    //Position (x = right+ left-) 
						gltf.scene.position.y = -400;				    //Position (y = up+, down-)
						gltf.scene.position.z = position+3000;//deducted 3000	Position (z = front +, back-)
						object = gltf.scene;
					  	gltfObject.push(object);
					  	scene.add(object);
					  	//console.log(gltfObject);
					}, undefined, function ( error ) {

						console.error( error );

					} );
				}*/
				//else{
					loader.load( 'models/'+arrObstacle[randObs], function ( gltf ) {

						gltf.scene.traverse(function(node) {
						    if (node instanceof THREE.Mesh) {
						      node.castShadow = true;
						    }
						});
						if(arrObstacle[randObs] == 'Rocks.glb'){
							gltf.scene.scale.set( 4, 4, 3);//2700
							//deducted 3000	Position (z = front +, back-)	
							
							//Position (x = right+ left-) default 800
							
							if(arrLane[lane] == 1){
								gltf.scene.position.x = 1000; 
								gltf.scene.position.z = position-1000;
							
							}
							else if(arrLane[lane] == 0){
								gltf.scene.position.x = 800; 
								gltf.scene.position.z = position-1000;
								
							
							}
							else if(arrLane[lane] == -1){
								gltf.scene.position.x = arrLane[lane] *2700; 
								gltf.scene.rotation.y = 15;	
								gltf.scene.position.z = position+2000;
								
								
							}
							
							
						}
						// If cactus
						else{
							
						}
							
					
						gltf.scene.position.y = -500;//400				    //Position (y = up+, down-)
						
						object = gltf.scene;
					  	gltfObject.push(object);
					  	scene.add(object);
					  	//console.log(gltfObject);
					}, undefined, function ( error ) {

						console.error( error );

					} );
				//}
				

				//refinedPU();

				objects.push(tree);
				//ballPObject.push(sphere);
				//scene.add(sphere.mesh);	
				scene.add(tree.mesh);

				//console.log(objects);


			//}

	}

	function createOrbs(position, probability, minScale, maxScale) {
		/* Use this code if you want row of trees
		for (var lane = -1; lane < 2 ; lane++) {
			if(lane==0){
				continue;
			}
			var randomNumber = Math.random();
			if (randomNumber < probability) {
				var scale = minScale + (maxScale - minScale) * Math.random();
				var tree = new Tree(lane * 800, -400, position, scale);

				objects.push(tree);
				scene.add(tree.mesh);

			}
		}*/
		var arrLane = [-1,0,1];
		var lane = Math.floor(Math.random()*2);
		var randObs = Math.floor(Math.random()*2);
		//var randomNumber = Math.random();
			//if (randomNumber < probability) {
				var scale = minScale + (maxScale - minScale) * Math.random();
				//var tree = new Tree(arrLane[lane] * 800, -400, position, scale);	
				var sphere = new Sphere(arrLane[lane] * 500 , -1000, position+3000, 8);

				ballPObject.push(sphere);
				scene.add(sphere.mesh);	
				//scene.add(tree.mesh);

				//console.log(objects);


			//}
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/PUP-Chevron.glb', function(gltf){
				gltf.scene.traverse( function( node ) {
					if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
				} );
				
				
				gltf.scene.scale.set(2,2,2);
				gltf.scene.position.x = arrLane[lane] * 800;
				gltf.scene.position.y = -400;
				gltf.scene.position.z = position+3500;
				object = gltf.scene;
				chevronObject.push(object);
				scene.add(object);
	
			}, undefined, function(error){
				console.error(error);
			});

	}
	
	function createBuildings(z){
	 	//Initialize buildings
		var loaderScenery = new THREE.GLTFLoader();

		loaderScenery.load( 'models/Road-long-v4.glb', function ( gltf ) {
			gltf.scene.traverse( function( node ) {

		    	if ( node instanceof THREE.Mesh ) { node.castShadow = true; }

		    } );
			gltf.scene.scale.set( 7000, 7000, 7000);			   
			gltf.scene.position.x = -100;				    //Position (x = right+ left-) -300
			gltf.scene.position.y = -900;				    //Position (y = up+, down-) 800
			gltf.scene.position.z = z;				    //Position (z = front +, back-)
			scenery = gltf.scene;
			scenery.rotation.y =0;	
			// /scenery.animations;
			scene.add(scenery);
			sceneryObject.push(scenery);

			/*mixerScenery = new THREE.AnimationMixer(scenery);
		    gltf.animations.forEach(animation => {
		    	//console.log(animation);
		        mixerScenery
		        	.clipAction(animation, scenery)
		            .play();
		    });*/

		}, undefined, function ( error ) {

			console.error( error );

		} );
	 }
	
	function createOrbs2(position, probability, minScale, maxScale) {
		/* Use this code if you want row of trees
		for (var lane = -1; lane < 2 ; lane++) {
			if(lane==0){
				continue;
			}
			var randomNumber = Math.random();
			if (randomNumber < probability) {
				var scale = minScale + (maxScale - minScale) * Math.random();
				var tree = new Tree(lane * 800, -400, position, scale);

				objects.push(tree);
				scene.add(tree.mesh);

			}
		}*/
		var arrLane = [-1,0,1];
		var lane = Math.floor(Math.random()*2);
		var randObs = Math.floor(Math.random()*2);
		//var randomNumber = Math.random();
			//if (randomNumber < probability) {
				var scale = minScale + (maxScale - minScale) * Math.random();
				//var tree = new Tree(arrLane[lane] * 800, -400, position, scale);	
				var sphere = new Sphere(arrLane[lane] * 500 , -1000, position+3000, 8);

				ballPObject.push(sphere);
				scene.add(sphere.mesh);	
				//scene.add(tree.mesh);

				//console.log(objects);


			//}
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/PUP-Chevron.glb', function(gltf){
				gltf.scene.traverse( function( node ) {
					if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
				} );
				
				
				gltf.scene.scale.set(2,2,2);
				gltf.scene.position.x = arrLane[lane] * 800;
				gltf.scene.position.y = -400;
				gltf.scene.position.z = position+3500;
				object = gltf.scene;
				chevronObject.push(object);
				scene.add(object);
	
			}, undefined, function(error){
				console.error(error);
			});

	}
	

function billBoardRoad(z, billBoard){
		billBoard.gltf.scene.scale.set(5,1,1);
		billBoard.gltf.scene.position.x = -200;
		billBoard.gltf.scene.position.y = -2500;
		billBoard.gltf.scene.position.z = z*-5000;
		object = billBoard.gltf.scene;

		bbRoad.push(object);
		scene.add(object);

	}

	function billBoardRight(z, billBoard){
		billBoard.gltf.scene.scale.set(10,15,15);
		billBoard.gltf.scene.position.x = 800;
		billBoard.gltf.scene.position.y = -6500;
		billBoard.gltf.scene.position.z = z*-5000;
		object = billBoard.gltf.scene;

		bbObject.push(object);
		scene.add(object);

	}

	function billBoardLeft(z, billBoard){
		billBoard.gltf.scene.scale.set(10,15,15);
		billBoard.gltf.scene.position.x = 5000;
		billBoard.gltf.scene.position.y = -6500;
		billBoard.gltf.scene.position.z = z*-5000;
		object = billBoard.gltf.scene;
	
		bbObject.push(object);
		scene.add(object);

	}

	function newMGpack(){
		var loader = new THREE.ImageLoader();

		loader.load(
			'img/lm-red.png',
			function ( image ) {
				// use the image, e.g. draw part of it on a canvas
				var canvas = document.createElement( 'canvas' );
				var context = canvas.getContext( '2d' );
				context.drawImage(image, 469, 500);
				console.log(image);
			},
			// onProgress callback currently not supported
			undefined,

			// onError callback
			function () {
				console.error( 'An error happened.' );
			}
		)
		console.log(loader);
	}

	//Power Ups
	
	
		function cigarPU(z){
		var powerUps = new PowerUps(-500 , -200, z*-3000, 3);
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/cigar.glb', function(gltf){
			gltf.scene.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
			} );
			gltf.scene.scale.set(5,5,5);
			gltf.scene.position.x = -1300;
			gltf.scene.position.y = -3000;
			gltf.scene.position.z = z*-3000;
			object = gltf.scene;
			pupCigarObject.push(object);
			scene.add(object);

		}, undefined, function(error){
			console.error(error);
		});

		cigarObject.push(powerUps);
		scene.add(powerUps.mesh);

	}
	
		function bottlePU(z){
		var powerUps = new PowerUps(-500 , -200, z*-2900, 10);
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/waterbottle.glb', function(gltf){
			gltf.scene.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
			} );
			gltf.scene.scale.set(5,5,5);
			gltf.scene.position.x = 600;
			gltf.scene.position.y = -1500;
			gltf.scene.position.z = z*-3000;
			object = gltf.scene;
			pupBottleObject.push(object);
			scene.add(object);

		}, undefined, function(error){
			console.error(error);
		});

		bottleObject.push(powerUps);
		scene.add(powerUps.mesh);

	}
	
	function refinedPU(z){
		var powerUps = new PowerUps(-500 , -200, z*-3000, 3);
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/PUP-X2.glb', function(gltf){
			gltf.scene.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
			} );
			gltf.scene.scale.set(5,5,5);
			gltf.scene.position.x = -500;
			gltf.scene.position.y = -1400;
			gltf.scene.position.z = z*-3000;
			object = gltf.scene;
			pupRefineObject.push(object);
			scene.add(object);

		}, undefined, function(error){
			console.error(error);
		});

		refinedObject.push(powerUps);
		scene.add(powerUps.mesh);

	}

	function smoothPU(z){
		var powerUps = new PowerUps(-500 , -200, z*-3000, 3);
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/PUP-Shield.glb', function(gltf){
			gltf.scene.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
			} );
			gltf.scene.scale.set(5,5,2);
			gltf.scene.position.x = -500;
			gltf.scene.position.y = -1400;
			gltf.scene.position.z = z*-3000;
			object = gltf.scene;
			pupSmoothObject.push(object);
			scene.add(object);

		}, undefined, function(error){
			console.error(error);
		});

		smoothObject.push(powerUps);
		scene.add(powerUps.mesh);

	}

	function stylishPU(z){
		var powerUps = new PowerUps(-500 , -200, z*-3000, 3);
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/PUP-U.glb', function(gltf){
			gltf.scene.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
			} );
			gltf.scene.scale.set(5,5,5);
			gltf.scene.position.x = -500;
			gltf.scene.position.y = -1200;
			gltf.scene.position.z = z*-3000;
			object = gltf.scene;
			pupStylishObject.push(object);
			scene.add(object);

		}, undefined, function(error){
			console.error(error);
		});

		stylishObject.push(powerUps);
		scene.add(powerUps.mesh);

	}

	function marlboroPack(){
		/*var powerUps = new PowerUps(0 , -200, 40*-3000, 3);
		var loader = new THREE.GLTFLoader();
		var object;
		loader.load('models/oldMG.glb', function(gltf){
			gltf.scene.traverse( function( node ) {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
			} );
			gltf.scene.scale.set(5,5,5);
			gltf.scene.position.x = 1400;
			gltf.scene.position.y = -200;
			gltf.scene.position.z = 99*-3000;
			object = gltf.scene;
			object.rotation.y =300;
			powerUpsObject.push(object);
			scene.add(object);

		}, undefined, function(error){
			console.error(error);
		});

		mgPackObject.push(powerUps);
		scene.add(powerUps.mesh);*/
		var newPackWall = new Wall(0,0,-77000, 3);
		mgPackObject.push(newPackWall);
		scene.add(newPackWall.mesh);

	}

	/**
	 * Returns true if and only if the character is currently colliding with
	 * an object on the map.
	 */
 	function collisionsDetected() {
 		var charMinX = character.element.position.x - 115;//115
 		var charMaxX = character.element.position.x + 105;//115
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;
 		for (var i = 0; i < objects.length; i++) {
 			if (objects[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ) && shield == false) {
 				
 				return true;
 			}
 		}
 		return false;
 	}
 	function collisionsDetectedBall() {
 		var charMinX = character.element.position.x - 115;//115
 		var charMaxX = character.element.position.x + 115;//115
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;
 		for (var i = 0; i < ballPObject.length; i++) {
 			if (ballPObject[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ) && jQuery.inArray(ballPObject[i],ballPObjectTrash)== -1 )  {
				ballPObjectTrash.push(ballPObject[i]);
				
				//ballPObjectTrash.push(chevronObject[i]);
				ballPObject[i].mesh.visible = false;
				chevronObject[i].visible = false;
 				return true;
 			}
 		}
 		return false;
 	}

 	function collisionsDetectedRefined() {
 		var charMinX = character.element.position.x - 115;//115
 		var charMaxX = character.element.position.x + 115;//115
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;
 		for (var i = 0; i < refinedObject.length; i++) {
 			if (refinedObject[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ) && jQuery.inArray(refinedObject[i],pupRefineTrash)== -1 ) {
				pupRefineTrash.push(refinedObject[i]);
 				refinedObject[i].mesh.visible = false;
				pupRefineObject[i].visible=false;
 				console.log(charMinZ+" hit");
 				
 				return true;
 			}
 		}
 		return false;
 	}
	
	function collisionsDetectedCigar() {
			var charMinX = character.element.position.x - 115;//115
			var charMaxX = character.element.position.x + 115;//115
			var charMinY = character.element.position.y - 310;
			var charMaxY = character.element.position.y + 320;
			var charMinZ = character.element.position.z - 40;
			var charMaxZ = character.element.position.z + 40;
			for (var i = 0; i < cigarObject.length; i++) {
				if (cigarObject[i].collides(charMinX, charMaxX, charMinY, 
						charMaxY, charMinZ, charMaxZ) && jQuery.inArray(cigarObject[i],pupCigarTrash)== -1 ) {
					console.log(cigarObject[i].collides(charMinX, charMaxX, charMinY, charMaxY, charMinZ, charMaxZ))
					console.log(jQuery.inArray(cigarObject[i],pupCigarTrash)== -1)
					pupCigarTrash.push(cigarObject[i]);
					cigarObject[i].mesh.visible = false;
					pupCigarObject[i].visible=false;
					console.log(charMinZ+" hit");
					
					return true;
				}
			}
			return false;
 	}
	
	
	
	function collisionsDetectedBottle() {
			var charMinX = character.element.position.x - 115;//115
			var charMaxX = character.element.position.x + 115;//115
			var charMinY = character.element.position.y - 310;
			var charMaxY = character.element.position.y + 320;
			var charMinZ = character.element.position.z - 40;
			var charMaxZ = character.element.position.z + 40;
			for (var i = 0; i < bottleObject.length; i++) {
				if (bottleObject[i].collides(charMinX, charMaxX, charMinY, 
						charMaxY, charMinZ, charMaxZ) && jQuery.inArray(bottleObject[i],pupBottleTrash)== -1 ) {
					console.log(bottleObject[i].collides(charMinX, charMaxX, charMinY, charMaxY, charMinZ, charMaxZ))
					console.log(jQuery.inArray(bottleObject[i],pupBottleTrash)== -1)
					pupBottleTrash.push(bottleObject[i]);
					bottleObject[i].mesh.visible = false;
					pupBottleObject[i].visible=false;
					console.log(charMinZ+" hit");
					
					return true;
				}
			}
			return false;
 	}
	

 	function collisionsDetectedSmooth() {
 		var charMinX = character.element.position.x - 115;//115
 		var charMaxX = character.element.position.x + 115;//115
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;
 		for (var i = 0; i < smoothObject.length; i++) {
 			if (smoothObject[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ) && jQuery.inArray(smoothObject[i],pupSmoothTrash)== -1) {
				pupSmoothTrash.push(smoothObject[i]);
				smoothObject[i].mesh.visible = false;
				pupSmoothObject[i].visible=false;
 				console.log(charMinZ+" hit");
 				
 				return true;
 			}
 		}
 		return false;
 	}

 	function collisionsDetectedStylish() {
 		var charMinX = character.element.position.x - 115;//115
 		var charMaxX = character.element.position.x + 115;//115
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;
 		for (var i = 0; i < stylishObject.length; i++) {
 			if (stylishObject[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ) && jQuery.inArray(stylishObject[i],pupStylishTrash)== -1) {
				pupStylishTrash.push(stylishObject[i]);
				stylishObject[i].mesh.visible = false;
				pupStylishObject[i].visible=false;
 				console.log(charMinZ+" hit");
 				
 				return true;
 			}
 		}
 		return false;
 	}
 	function collisionsDetectedMGPack() {
 		var charMinX = character.element.position.x - 115;//115
 		var charMaxX = character.element.position.x + 115;//115
 		var charMinY = character.element.position.y - 310;
 		var charMaxY = character.element.position.y + 320;
 		var charMinZ = character.element.position.z - 40;
 		var charMaxZ = character.element.position.z + 40;
 		for (var i = 0; i < mgPackObject.length; i++) {
 			if (mgPackObject[i].collides(charMinX, charMaxX, charMinY, 
 					charMaxY, charMinZ, charMaxZ)) {
 				return true;
 			}
 		}
 		return false;
 	}
	
}



/** 
 *
 * IMPORTANT OBJECTS
 * 
 * The character and environmental objects in the game.
 *
 */

/**
 * The player's character in the game.
 */

function GoldenBallChar(){
	var loader = new THREE.GLTFLoader();
	var scene = new THREE.Scene();
		loader.load( 'goldenball/GoldenDrop.glb', function ( gltf ) {

		gltf.scene.scale.set( 200, 200, 200 );			   
		gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
		gltf.scene.position.y = 0;				    //Position (y = up+, down-)
		gltf.scene.position.z = -4000;				    //Position (z = front +, back-)
		char = gltf.scene;
		char.animations;
		//goldenballObject.push(char);
		scene.add(char);

		mixer = new THREE.AnimationMixer(char);
	    gltf.animations.forEach(animation => {
	    	console.log(animation);
	        mixer
	        	.clipAction(animation, char)
	            .play();
	    });

        	

	}, undefined, function ( error ) {

		console.error( error );

	} );
}


function Character() {

	// Explicit binding of this even in changing contexts.
	var self = this;

	// Character defaults that don't change throughout the game.
	this.skinColor = Colors.brown;
	this.hairColor = Colors.black;
	this.shirtColor = Colors.yellow;
	this.shortsColor = Colors.olive;
	this.jumpDuration = 0.6;
	this.jumpHeight = 2000;

	// Initialize the character.
	init();

	/**
	  * Builds the character in depth-first order. The parts of are 
  	  * modelled by the following object hierarchy:
	  *
	  * - character (this.element)
	  *    - head
	  *       - face
	  *       - hair
	  *    - torso
	  *    - leftArm
	  *       - leftLowerArm
	  *    - rightArm
	  *       - rightLowerArm
	  *    - leftLeg
	  *       - rightLowerLeg
	  *    - rightLeg
	  *       - rightLowerLeg
	  *
	  * Also set up the starting values for evolving parameters throughout
	  * the game.
	  * 
	  */
	function init() {

		// Build the character.
		self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
		self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
		self.head = createGroup(0, 260, -25);
		self.head.add(self.face);
		self.head.add(self.hair);

		self.torso = createBox(150, 190, 40, self.shirtColor, 0, 100, 0);

		self.leftLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -170, 0);
		self.leftArm = createLimb(30, 140, 40, self.skinColor, -100, 190, -10);
		self.leftArm.add(self.leftLowerArm);

		self.rightLowerArm = createLimb(
			20, 120, 30, self.skinColor, 0, -170, 0);
		self.rightArm = createLimb(30, 140, 40, self.skinColor, 100, 190, -10);
		self.rightArm.add(self.rightLowerArm);

		self.leftLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -200, 0);
		self.leftLeg = createLimb(50, 170, 50, self.shortsColor, -50, -10, 30);
		self.leftLeg.add(self.leftLowerLeg);

		self.rightLowerLeg = createLimb(
			40, 200, 40, self.skinColor, 0, -200, 0);
		self.rightLeg = createLimb(50, 170, 50, self.shortsColor, 50, -10, 30);
		self.rightLeg.add(self.rightLowerLeg);

		self.element = createGroup(0, 0, -5000);
		self.element.add(self.head);
		self.element.add(self.torso);
		self.element.add(self.leftArm);
		self.element.add(self.rightArm);
		self.element.add(self.leftLeg);
		self.element.add(self.rightLeg);

		// Initialize the player's changing parameters.
		self.isJumping = false;
		self.isSwitchingLeft = false;
		self.isSwitchingRight = false;
		self.currentLane = 0;
		self.runningStartTime = new Date() / 1000;
		self.pauseStartTime = new Date() / 1000;
		self.stepFreq = 2;
		self.queuedActions = [];

	}

	/**
	 * Creates and returns a limb with an axis of rotation at the top.
	 *
	 * @param {number} DX The width of the limb.
	 * @param {number} DY The length of the limb.
	 * @param {number} DZ The depth of the limb.
	 * @param {color} COLOR The color of the limb.
	 * @param {number} X The x-coordinate of the rotation center.
	 * @param {number} Y The y-coordinate of the rotation center.
	 * @param {number} Z The z-coordinate of the rotation center.
	 * @return {THREE.GROUP} A group that includes a box representing
	 *                       the limb, with the specified properties.
	 *
	 */
	function createLimb(dx, dy, dz, color, x, y, z) {
	    var limb = createGroup(x, y, z);
	    var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
		var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
		limb.add(limbBox);
		return limb;
	}
	
	/**
	 * A method called on the character when time moves forward.
	 */
	this.update = function() {

		// Obtain the curren time for future calculations.
		var currentTime = new Date() / 1000;

		// Apply actions to the character if none are currently being
		// carried out.
		if (!self.isJumping &&
			!self.isSwitchingLeft &&
			!self.isSwitchingRight &&
			self.queuedActions.length > 0) {
			switch(self.queuedActions.shift()) {
				case "up":
					self.isJumping = true;
					self.jumpStartTime = new Date() / 1000;
					break;
				case "left":
					if (self.currentLane != -1) {
						self.isSwitchingLeft = true;
					}
					break;
				case "right":
					if (self.currentLane != 1) {
						self.isSwitchingRight = true;
					}
					break;
			}
		}

		// If the character is jumping, update the height of the character.
		// Otherwise, the character continues running.
		if (self.isJumping) {
			var jumpClock = currentTime - self.jumpStartTime;
			self.element.position.y = self.jumpHeight * Math.sin(
				(1 / self.jumpDuration) * Math.PI * jumpClock) +
				sinusoid(2 * self.stepFreq, 0, 20, 0,
					self.jumpStartTime - self.runningStartTime);
			if (jumpClock > self.jumpDuration) {
				self.isJumping = false;
				self.runningStartTime += self.jumpDuration;
			}
		} else {
			var runningClock = currentTime - self.runningStartTime;
			self.element.position.y = sinusoid(
				2 * self.stepFreq, 0, 20, 0, runningClock);
			self.head.rotation.x = sinusoid(
				2 * self.stepFreq, -10, -5, 0, runningClock) * deg2Rad;
			self.torso.rotation.x = sinusoid(
				2 * self.stepFreq, -10, -5, 180, runningClock) * deg2Rad;
			self.leftArm.rotation.x = sinusoid(
				self.stepFreq, -70, 50, 180, runningClock) * deg2Rad;
			self.rightArm.rotation.x = sinusoid(
				self.stepFreq, -70, 50, 0, runningClock) * deg2Rad;
			self.leftLowerArm.rotation.x = sinusoid(
				self.stepFreq, 70, 140, 180, runningClock) * deg2Rad;
			self.rightLowerArm.rotation.x = sinusoid(
				self.stepFreq, 70, 140, 0, runningClock) * deg2Rad;
			self.leftLeg.rotation.x = sinusoid(
				self.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
			self.rightLeg.rotation.x = sinusoid(
				self.stepFreq, -20, 80, 180, runningClock) * deg2Rad;
			self.leftLowerLeg.rotation.x = sinusoid(
				self.stepFreq, -130, 5, 240, runningClock) * deg2Rad;
			self.rightLowerLeg.rotation.x = sinusoid(
				self.stepFreq, -130, 5, 60, runningClock) * deg2Rad;

			// If the character is not jumping, it may be switching lanes.
			if (self.isSwitchingLeft) {			
				self.element.position.x -= 200;
				charObject.forEach(function(object) {
						object.position.x -= 200;
				})
				var offset = self.currentLane * 500 - self.element.position.x;
				if (offset > 500) {
					self.currentLane -= 1;
					self.element.position.x = self.currentLane * 500;
					self.isSwitchingLeft = false;
					charX = self.currentLane * 500;
					/*charObject.forEach(function(object) {
						object.position.x = charX;
						object.rotation.y = -200;
						object.rotation.z = 100;
					});*/
				}
			}
			if (self.isSwitchingRight) {
				self.element.position.x += 200;
				charObject.forEach(function(object) {
						object.position.x += 200;
				})
				var offset = self.element.position.x - self.currentLane * 500;
				if (offset > 500) {
					self.currentLane += 1;
					self.element.position.x = self.currentLane * 500;
					self.isSwitchingRight = false;
					charX = self.currentLane * 500;
					/*charObject.forEach(function(object) {
						object.position.x = charX;
						object.rotation.y = 200;
						object.rotation.z = -100;
					})*/
				}
			}
			if (self.currentLane==0) {
				charObject.forEach(function(object) {
						object.rotation.y = 0;
						object.rotation.z = 0;
				})
			}
		}
	}

	/**
	  * Handles character activity when the left key is pressed.
	  */
	this.onLeftKeyPressed = function() {
		self.queuedActions.push("left");
	}

	/**
	  * Handles character activity when the up key is pressed.
	  */
	this.onUpKeyPressed = function() {
		self.queuedActions.push("up");
	}

	/**
	  * Handles character activity when the right key is pressed.
	  */
	this.onRightKeyPressed = function() {
		self.queuedActions.push("right");
	}

	/**
	  * Handles character activity when the game is paused.
	  */
	this.onPause = function() {
		self.pauseStartTime = new Date() / 1000;
	}

	/**
	  * Handles character activity when the game is unpaused.
	  */
	this.onUnpause = function() {
		var currentTime = new Date() / 1000;
		var pauseDuration = currentTime - self.pauseStartTime;
		self.runningStartTime += pauseDuration;
		if (self.isJumping) {
			self.jumpStartTime += pauseDuration;
		}
	}

}

/**
  * A collidable tree in the game positioned at X, Y, Z in the scene and with
  * scale S.
  */
function Tree(x, y, z, s) {

	// Explicit binding.
	var self = this;

	// The object portrayed in the scene.
	this.mesh = new THREE.Object3D();
   // var top = createCylinder(1, 300, 300, 4, Colors.green, 0, 1000, 0);
    //var mid = createCylinder(1, 400, 400, 4, Colors.green, 0, 800, 0);
    //var bottom = createCylinder(1, 500, 500, 4, Colors.green, 0, 500, 0);
    var trunk = createCylinder(450, 600, 500, 32, Colors.white, 0, 125, 0);
    //var obstacle = obstacleCylinder(9.4,17.7,9,9,1,false,0,3.5,0, 125, 0);
    //this.mesh.add(top);
   	//this.mesh.add(mid);
    //this.mesh.add(bottom);
    //this.mesh.add(trunk);
    this.mesh.add(trunk);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;

	/**
	 * A method that detects whether this tree is colliding with the character,
	 * which is modelled as a box bounded by the given coordinate space.
	 */
    this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    	var treeMinX = self.mesh.position.x - this.scale * 300;//250
    	var treeMaxX = self.mesh.position.x + this.scale * 300;//250
    	var treeMinY = self.mesh.position.y;
    	var treeMaxY = self.mesh.position.y + this.scale * 600;//1150
    	var treeMinZ = self.mesh.position.z - this.scale * 250;
    	var treeMaxZ = self.mesh.position.z + this.scale * 250;
    	return treeMinX <= maxX && treeMaxX >= minX
    		&& treeMinY <= maxY && treeMaxY >= minY
    		&& treeMinZ <= maxZ && treeMaxZ >= minZ;
    }

}

function Wall(x, y, z, s){
	// Explicit binding.
	var self = this;

	// The object portrayed in the scene.
	this.mesh = new THREE.Object3D();
	var wall = createWall(x, y, z);
	
	this.mesh.add(wall);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;
	this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    	var treeMinX = self.mesh.position.x - this.scale * 15;
    	var treeMaxX = self.mesh.position.x + this.scale * 15;
    	var treeMinY = self.mesh.position.y;
    	var treeMaxY = self.mesh.position.y + this.scale * 100;//1150
    	var treeMinZ = self.mesh.position.z - this.scale * 15;
    	var treeMaxZ = self.mesh.position.z + this.scale * 15;
    	return treeMinX <= maxX && treeMaxX >= minX
    		&& treeMinY <= maxY && treeMaxY >= minY
    		&& treeMinZ <= maxZ && treeMaxZ >= minZ;
	}

}


function Sphere(x, y, z, s){
	// Explicit binding.
	var self = this;

	// The object portrayed in the scene.
	this.mesh = new THREE.Object3D();
	var sphere = createSphere(20, 20, 20, Colors.black, 0, 125, 0);
	

	this.mesh.add(sphere);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;
	this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    	var treeMinX = self.mesh.position.x - this.scale * 15;
    	var treeMaxX = self.mesh.position.x + this.scale * 15;
    	var treeMinY = self.mesh.position.y;
    	var treeMaxY = self.mesh.position.y + this.scale * 100;//1150
    	var treeMinZ = self.mesh.position.z - this.scale * 15;
    	var treeMaxZ = self.mesh.position.z + this.scale * 15;
    	return treeMinX <= maxX && treeMaxX >= minX
    		&& treeMinY <= maxY && treeMaxY >= minY
    		&& treeMinZ <= maxZ && treeMaxZ >= minZ;
    }
    
}

function PowerUps(x, y, z, s){
	// Explicit binding.
	var self = this;

	// The object portrayed in the scene.
	this.mesh = new THREE.Object3D();
	var sphere = createPUps(50, 50, 50, Colors.black, 0, 125, 0);
	

	this.mesh.add(sphere);
    this.mesh.position.set(x, y, z);
	this.mesh.scale.set(s, s, s);
	this.scale = s;
	this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
    	var treeMinX = self.mesh.position.x - this.scale * 15;
    	var treeMaxX = self.mesh.position.x + this.scale * 15;
    	var treeMinY = self.mesh.position.y;
    	var treeMaxY = self.mesh.position.y + this.scale * 100;//1150
    	var treeMinZ = self.mesh.position.z - this.scale * 15;
    	var treeMaxZ = self.mesh.position.z + this.scale * 15;
    	return treeMinX <= maxX && treeMaxX >= minX
    		&& treeMinY <= maxY && treeMaxY >= minY
    		&& treeMinZ <= maxZ && treeMaxZ >= minZ;
    }
    
}



/** 
 *
 * UTILITY FUNCTIONS
 * 
 * Functions that simplify and minimize repeated code.
 *
 */

/**
 * Utility function for generating current values of sinusoidally
 * varying variables.
 *
 * @param {number} FREQUENCY The number of oscillations per second.
 * @param {number} MINIMUM The minimum value of the sinusoid.
 * @param {number} MAXIMUM The maximum value of the sinusoid.
 * @param {number} PHASE The phase offset in degrees.
 * @param {number} TIME The time, in seconds, in the sinusoid's scope.
 * @return {number} The value of the sinusoid.
 *
 */
function sinusoid(frequency, minimum, maximum, phase, time) {
	var amplitude = 0.5 * (maximum - minimum);
	var angularFrequency = 2 * Math.PI * frequency;
	var phaseRadians = phase * Math.PI / 180;
	var offset = amplitude * Math.sin(
		angularFrequency * time + phaseRadians);
	var average = (minimum + maximum) / 2;
	return average + offset;
}

/**
 * Creates an empty group of objects at a specified location.
 *
 * @param {number} X The x-coordinate of the group.
 * @param {number} Y The y-coordinate of the group.
 * @param {number} Z The z-coordinate of the group.
 * @return {Three.Group} An empty group at the specified coordinates.
 *
 */
function createGroup(x, y, z) {
	var group = new THREE.Group();
	group.position.set(x, y, z);
	return group;
}

/**
 * Creates and returns a simple box with the specified properties.
 *
 * @param {number} DX The width of the box.
 * @param {number} DY The height of the box.
 * @param {number} DZ The depth of the box.
 * @param {color} COLOR The color of the box.
 * @param {number} X The x-coordinate of the center of the box.
 * @param {number} Y The y-coordinate of the center of the box.
 * @param {number} Z The z-coordinate of the center of the box.
 * @param {boolean} NOTFLATSHADING True iff the flatShading is false.
 * @return {THREE.Mesh} A box with the specified properties.
 *
 */
function createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var mat = new THREE.MeshPhongMaterial({
		color:color, 
    	flatShading: notFlatShading != true
    });
    var box = new THREE.Mesh(geom, mat);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
}

function createGround(dx, dy, dz, color, x, y, z, notFlatShading) {
	var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
	shadowMaterial.opacity = 1;
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var ground = new THREE.TextureLoader().load( "img/ground.png" );
    var mat = new THREE.MeshBasicMaterial({
		//color:0x6C6C6C 
    	flatShading:  true,
    	map : ground

    });
    var box = new THREE.Mesh(geom, mat, shadowMaterial);
    ///box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
    /*var groundMaterial = new THREE.MeshPhongMaterial({
	  color: 0x6C6C6C
	});
	ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 20,120000), groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	ground.position.set(x, y, z);
	//scene.add(ground);
	return ground;*/
}

/**
 * Creates and returns a (possibly asymmetrical) cyinder with the 
 * specified properties.
 *
 * @param {number} RADIUSTOP The radius of the cylinder at the top.
 * @param {number} RADIUSBOTTOM The radius of the cylinder at the bottom.
 * @param {number} HEIGHT The height of the cylinder.
 * @param {number} RADIALSEGMENTS The number of segmented faces around 
 *                                the circumference of the cylinder.
 * @param {color} COLOR The color of the cylinder.
 * @param {number} X The x-coordinate of the center of the cylinder.
 * @param {number} Y The y-coordinate of the center of the cylinder.
 * @param {number} Z The z-coordinate of the center of the cylinder.
 * @return {THREE.Mesh} A box with the specified properties.
 */
function createCylinder(radiusTop, radiusBottom, height, radialSegments, 
						color, x, y, z) {
    var geom = new THREE.CylinderGeometry(
    	radiusTop, radiusBottom, height, radialSegments);
    var mat = new THREE.MeshPhongMaterial({
    	color: Colors.brownDark	,
    	flatShading: true
    });
    var cylinder = new THREE.Mesh(geom, mat);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.visible = false;
    cylinder.position.set(x, y, z);
    return cylinder;
}


function createSphere(radius, widthSegments, height, 
						color, x, y, z) {
    var geom = new THREE.SphereGeometry(
    	radius, widthSegments, height);
    //var splash = new THREE.TextureLoader().load( "img/splash-small.png" );
    var mat = new THREE.MeshBasicMaterial({
    	color: 0xffff00	,
    	flatShading: true,
    	//map : splash
    });
    var sphere = new THREE.Mesh(geom, mat);
    sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.visible = false;
    sphere.position.set(x, y, z);
    return sphere;
}

function createPUps(radius, widthSegments, height, 
						color, x, y, z) {
    var geom = new THREE.SphereGeometry(
    	radius, widthSegments, height);
    //var splash = new THREE.TextureLoader().load( "img/splash.png" );
    var mat = new THREE.MeshBasicMaterial({
    	color: Colors.black	,
    	flatShading: true
    });
    var sphere = new THREE.Mesh(geom, mat);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.visible = false;
    sphere.position.set(x, y, z);
    return sphere;
}


function obstacleCylinder(radiusTop, radiusBottom, height, radialSegments, 
						heightSegments, openEnded, thetaStart, thetaLength,x,y,z){

	var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, 
						heightSegments, openEnded, thetaStart, thetaLength);
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var cylinder = new THREE.Mesh( geometry, material );
	cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.position.set(x, y, z);
	//scene.add( cylinder );
	return cylinder;
}


function createWall(x, y, z){
	var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
	shadowMaterial.opacity = 1;
    var geometry = new THREE.BoxGeometry(300, 400, 1);
    var mgPack = new THREE.TextureLoader().load( "img/lm-red.png" );
    var material = new THREE.MeshBasicMaterial({
		color:0x00FFFFFF,
    	flatShading:  true,
    	map : mgPack

    });
	var cube = new THREE.Mesh( geometry, material );
	cube.visible = true;
	cube.position.set(x, y, z);
	return cube;
}
function splashPage() {
  this.sound = document.createElement("audio");
  this.sound.src = "sfx/Sound Bed.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.setAttribute("loop", "");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
function countDown() {
  this.sound = document.createElement("audio");
  this.sound.src = "sfx/Countdown.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function pointsEarn() {
  this.sound = document.createElement("audio");
  this.sound.src = "sfx/Points Earn.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function obstacleBump() {
  this.sound = document.createElement("audio");
  this.sound.src = "sfx/Obstacle Bump.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function powerUpSound() {
  this.sound = document.createElement("audio");
  this.sound.src = "sfx/Power Up.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
function goldSplash() {
  this.sound = document.createElement("audio");
  this.sound.src = "sfx/Gold Splash.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function sendMessage(msg) {
	window.parent.postMessage(msg, '*');
	console.log(msg);
}