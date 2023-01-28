import * as THREE from '../node_modules/three/src/Three.js';

class Figure{
  constructor(params){
    this.params = {
      x: 0,
      y: 0,
      z: 0,
      ry: 0,
      ...params
    }

    this.group = new THREE.Group();
    scene.add(this.group);
  }

  createBody(){
    const geometry = new THREE.CylinderGeometry();
    const body = new THREE.Mesh(geometry, material);
    this.group.add(body);
  }

  init(){
    this.createBody();
  }
}

export default Figure;