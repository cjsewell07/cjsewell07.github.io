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
let mixer;
const loader = new GLTFLoader();
loader.load('./assets/avatar_waving.glb', function(gltf){
  scene.add(gltf.scene);
  gltf.scene.rotation.y = 3.14;
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
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
  if (mixer){
    mixer.update(1/60);
  }
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