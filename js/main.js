//import * as THREE from '../node_modules/three/build/three.module.js';
import * as THREE from 'three'
import WebGL from './WebGL.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'
import {PointerLockControls} from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'

let scene, camera, renderer, controls;
let lightDirectional, lightAmbient;

let mixer;
const loader = new GLTFLoader();

init();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
  lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2);
  controls = new PointerLockControls(camera, renderer.domElement);

  /* Determining initial rendering from tutorial */
  camera.position.z = 5;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
  lightDirectional.position.set(0, 10, 5);

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
}

function animate(){
  requestAnimationFrame( animate );
  if (mixer){
    mixer.update(1/60);
  }

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