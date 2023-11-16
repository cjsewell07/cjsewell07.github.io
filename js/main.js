//import * as THREE from '../node_modules/three/build/three.module.js';
import * as THREE from 'three'
import WebGL from './WebGL.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'
import {PointerLockControls} from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'

let scene, camera, renderer, controls;
let lightDirectional, lightAmbient;
let loader;
let mixer;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let raycaster;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

init();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
  lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2);
  loader = new GLTFLoader();
  controls = new PointerLockControls(camera, document.body);

  /* Determining initial rendering from tutorial */
  camera.position.z = 5;
  lightDirectional.position.set(0, 10, 5);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);


  const blocker = document.getElementById( 'blocker' );
  const instructions = document.getElementById( 'instructions' );
  instructions.addEventListener( 'click', function () {
    controls.lock();
  } );

  controls.addEventListener( 'lock', function(){
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function(){
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  const onKeyDown = function(event){
    switch(event.code){
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;
      
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;
      
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
    
      case 'Space':
        if (canJump === true)
          velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event){
    switch(event.code){
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;
      
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;
      
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  const onMouseMove = function(event){
    controls.onMouseMove(event);
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('mousemove', onMouseMove)

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  addAnimation();
  addScene();
  
}

/* Adding animations */
function addAnimation(){
  loader.load('./assets/avatar_waving.glb', function(gltf){
    scene.add(gltf.scene);
    gltf.scene.rotation.y = 3.14;
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }, undefined, function(error){
    console.error(error);
  });
}

function addScene(){
  scene.add(camera);
  scene.add(lightDirectional);
  scene.add(lightAmbient);
  scene.add(controls.getObject());
}

function animate(){
  requestAnimationFrame(animate);
  const time = performance.now();
  //controls.lock();

  if (mixer){
    mixer.update(1/60);
  }

  if (controls.isLocked === true){
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;
    const delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
    if (true){
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  prevTime = time;
  renderer.render(scene, camera);
}

// resizes the window, based on resize event
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  //controls.handleResize();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// WebGL Check
if (WebGL.isWebGLAvailable()){
  animate();
}
else{
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}