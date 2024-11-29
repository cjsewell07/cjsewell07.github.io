//import * as THREE from '../node_modules/three/build/three.module.js';
import * as THREE from 'three';
import WebGL from './WebGL.js';
import {GLTFLoader} from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockControls} from 'https://unpkg.com/three/examples/jsm/controls/PointerLockControls.js';
//import RAPIER from 'rapier';

let scene, camera, renderer, controls;
let lightDirectional, lightAmbient;
let loader;
let mixer;
let gravity, world;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let raycaster;
let prevTime = performance.now();
let onMobile = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

/*
RAPIER.init().then(() => {
  gravity = {x: 0.0, y: -9.81, z: 0.0};
  world = new RAPIER.World(gravity);
});
*/
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
  const instructions2 = document.getElementById( 'instructions2' );

  /* Checks if on a mobile device */
  window.mobileCheck = function() {
    onMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) onMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  instructions.addEventListener( 'click', function () {
    controls.lock();
  } );

  instructions.addEventListener('touchStart', function(){
    controls.lock();
  });

  controls.addEventListener( 'lock', function(){
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function(){
    blocker.style.display = 'block';
    //instructions.style.display = '';
    if (onMobile){
      instructions2.style.display = '';
    }
    else{
      instructions.style.display = '';
    }
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

  const onTouchMove = function(event){
    //event.preventDefault();

    var touch = event.touches[0] || event.changedTouches[0];
    let x = touch.pageX;
    let y = touch.pageY;

    switch(true){
      case (x < 0):
        moveLeft = true;
        break;
      case (x < 0):
        moveRight = true;
        break;
      case (y < 0):
        moveBackward = true;
        break;
      case (y < 0):
        moveForward = true;
        break;
    }

  }

  // desktop controls
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  // mobile controls
  //document.addEventListener("touchstart", onTouchStart);
  document.addEventListener("touchmove", onTouchMove);
  //document.addEventListener("touchend", onTouchEnd);
  //document.addEventListener("touchcancel", onTouchCancel);

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  addEnvironment();
  addAnimation();
  addScene();
  
}

function addEnvironment(){
  loader.load('../../assets/environment.glb', function(gltf){
    scene.add(gltf.scene);
    gltf.scene.position.y = -2;
    gltf.scene.rotation.y = 3.14;
  }, undefined, function(error){
    console.error(error);
  });
}

/* Adding animations */
function addAnimation(){
  loader.load('../../assets/avatar_waving.glb', function(gltf){
    scene.add(gltf.scene);
    gltf.scene.rotation.y = 3.14;
    gltf.scene.position.y = -2;
    //world.createCollider(gltf.scene)
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
    console.log(gltf.scene.getSize());
  }, undefined, function(error){
    console.error(error);
  });
  //let avatarCollider = RAPIER.ColliderDesc.capsule();
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

    if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;
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

// Resizes the window, based on resize event
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