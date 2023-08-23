import * as THREE from 'three';
//import {OrbitControls} from 'orbitcontrols';
import {GLTFLoader} from 'gltfloader';
import WebGL from './WebGL.js';

//const controls = new OrbitControls( camera, renderer.domElement );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2);

/* Adding animations */


// Adding model
const loader = new GLTFLoader();
loader.load('./assets/avatar_waving.glb', function(gltf){
  gltf.scene.rotation.y = 3.14;
  gltf.animations = './assets/avatar_waving.glb'
  // adding model to the scene
  scene.add(gltf.scene);
}, undefined, function(error){
  console.error(error);
});



/* Determining initial rendering from tutorial */
camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
lightDirectional.position.set(0, 10, 5);
scene.add(camera);
scene.add(lightDirectional);
scene.add(lightAmbient);

/* Functions */
//Animations
function animate(){
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
}

// resizes the window, based on resize event
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
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