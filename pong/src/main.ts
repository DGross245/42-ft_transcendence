import * as THREE from 'three';

// Set up scene
const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const leftPaddleGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 40, 1);
const leftPaddleMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const leftPaddle: THREE.Mesh = new THREE.Mesh(leftPaddleGeometry, leftPaddleMaterial);
scene.add(leftPaddle);

const rightPaddleGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 40, 1);
const rightPaddleMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const rightPaddle: THREE.Mesh = new THREE.Mesh(rightPaddleGeometry, rightPaddleMaterial);
scene.add(rightPaddle);

// Position the camera
camera.position.z = 80;
leftPaddle.position.x = -50;
rightPaddle.position.x = 50;

const animate = (): void => {

  renderer.render(scene, camera);


  requestAnimationFrame(animate);
};

animate();
