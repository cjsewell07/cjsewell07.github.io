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
const loader = new GLTFLoader();
let mixer = new THREE.AnimationMixer();
loader.load('./assets/avatar_waving.glb', function(gltf){
  scene.add(gltf.scene);
}, undefined, function(error){
  console.error(error);
});
//mixer.clipAction(mixer).play();
/*
let mesh;
const mixer = new THREE.AnimationMixer(mesh);
const clips = mesh.animations;
const avatar_url = new URL('../assets/avatar_waving.glb', import.meta.url);
const clip = THREE.AnimationClip.findByName(clips, 'waving')
GLTFLoader.animations.forEach(clip)
//const action = mixer.clipAction(clip);
const assetLoader = new GLTFLoader();

assetLoader.load(avatar_url.href, function(gltf){
  const model = gltf.scene;
  scene.add(model);
}, undefined, function(error){
  console.error(error);
});

action.play();
*/

/* Determining initial rendering from tutorial */
camera.position.z = 20;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
lightDirectional.position.set(0, 10, 5);
scene.add(camera);
scene.add(lightDirectional);
scene.add(lightAmbient);

const clock = new THREE.Clock();

/* Functions */
//Animations
function animate(){
  mixer.update(1/60);
  renderer.render(scene, camera);
}
//renderer.setAnimationLoop(animation);

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