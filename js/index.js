import * as THREE from '../node_modules/three/src/Three.js';
import WebGL from './WebGL.js';
//import Figure from './Figure.js';

/* Clases */
class Figure{
  constructor(params){
    this.params = {
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      ...params
    }

    this.arms = [];
    this.group = new THREE.Group();
    this.group.position.set(this.params.x, this.params.y, this.params.z);
    this.group.rotation.x = this.params.rx;
    this.group.rotation.y = this.params.ry;
    this.group.rotation.z = this.params.rz;
    scene.add(this.group);
  }

  createBody(){
    const geometry = new THREE.CylinderGeometry(0.75, 0.75, 2);
    const body = new THREE.Mesh(geometry, material);
    this.group.add(body);
  }

  createHead(){
    const geometry = new THREE.SphereGeometry(1);
    const headMain = new THREE.Mesh(geometry, material);
    this.head = new THREE.Group();
    this.head.add(headMain);
    this.head.position.y = 1.65;
    this.group.add(this.head);
    this.createEyes();
  }

  createArms(){
    const height = 1.5;
    //const geometry = new THREE.CylinderGeometry(0.25, 0.25, 1);
    const geometry2 = new THREE.CylinderGeometry(0.25, 0.25, 2.5);

    // forarm
    /*
    for(let i = 0; i < 2; i++){
      const armGroup = new THREE.Group();
      const arm = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;
      const box = new THREE.BoxHelper(armGroup, 0xffff00);
      this.group.add(armGroup);
      this.group.add(box);
      arm.position.y = height * -0.5;
      armGroup.position.x = m * 0.9;
		  armGroup.position.y = 0.1;
      armGroup.rotation.z = degreesToRadians(10 * m);
      armGroup.add(arm);
      this.arms.push(armGroup);
    }
    */
    // back arm
    for(let i = 0; i < 2; i++){
      const armGroup = new THREE.Group();
      const arm = new THREE.Mesh(geometry2, material);
      const m = i % 2 === 0 ? 1 : -1;
      const box = new THREE.BoxHelper(armGroup, 0xffff00);
      this.group.add(armGroup);
      this.group.add(box);
      arm.position.y = height * 0;
      armGroup.position.x = m * 0.7;
		  armGroup.position.y = 0.1;
      armGroup.rotation.z = degreesToRadians(20 * m);
      armGroup.add(arm);
      this.arms.push(armGroup);
    }
  }

  createEyes(){
    const eyes = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.25, 12, 8);
    const material = new THREE.MeshLambertMaterial({color: 0x44445c});
    for(let i = 0; i < 2; i++){
      const eye = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;
      eyes.add(eye);
      eye.position.x = 0.36 * m;
    }
    this.head.add(eyes);
    eyes.position.y = 0;
    eyes.position.z = 1;
  }

  createLegs(){
    const legs = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(0.25,0.25,2);
    for(let i = 0; i < 2; i++){
      const leg = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;
      legs.add(leg);
      leg.position.x = m * .5;
    }
    this.group.add(legs);
    legs.position.y = -2;
    this.group.add(legs);
  }

  wave(){
    this.armGroup[0].rotation.x += degreesToRadians(30);
  }

  init(){
    this.createBody();
    this.createHead();
    this.createArms();
    this.createLegs();
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.SphereGeometry(1,32,16);
const material = new THREE.MeshLambertMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(geometry, material);
const lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2);
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
}

const figure = new Figure({
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0
});

camera.position.z = 20;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
lightDirectional.position.set(0, 10, 5);
scene.add(camera);
//scene.add(sphere);
scene.add(lightDirectional);
scene.add(lightAmbient);
figure.init();

/* Functions */
function animate(){
  requestAnimationFrame(animate);
  //figure.group.rotation.x += 0.01;
  //figure.group.rotation.y += 0.01;;
  renderer.render(scene, camera);
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


gsap.to(figure.params, {
  ry: degreesToRadians(360),
  repeat: 20,
  duration: 20
})


// Animation
//gsap.to(figure.group.position, {duration: 2, z: 15, delay: 0})
/*
gsap.ticker.add(() => {
  figure.wave();
})
*/

/* WebGL Check */
if (WebGL.isWebGLAvailable()){
  animate();
}
else{
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}

// resizes the window, based on resize event
window.addEventListener('resize', onWindowResize, false);