import * as THREE from '../node_modules/three/src/Three.js';
import WebGL from './WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.SphereGeometry(1,32,16);
const material = new THREE.MeshLambertMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(geometry, material);
const lightDirectional = new THREE.DirectionalLight(0xffffff, 1);

camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
scene.add(camera);
scene.add(sphere);
scene.add(lightDirectional);
lightDirectional.position.set(5, 5, 5);

// rendering the scene

/* Functions */

function animate(){
  requestAnimationFrame(animate);

  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

/* WebGL Check */
if (WebGL.isWebGLAvailable()){
  animate();
}
else{
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}