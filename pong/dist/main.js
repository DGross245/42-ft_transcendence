import * as THREE from 'three';
// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const leftPaddleGeometry = new THREE.BoxGeometry(1, 40, 1);
const leftPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const leftPaddle = new THREE.Mesh(leftPaddleGeometry, leftPaddleMaterial);
scene.add(leftPaddle);
const rightPaddleGeometry = new THREE.BoxGeometry(1, 40, 1);
const rightPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const rightPaddle = new THREE.Mesh(rightPaddleGeometry, rightPaddleMaterial);
scene.add(rightPaddle);
// Position the camera
camera.position.z = 80;
leftPaddle.position.x = -50;
rightPaddle.position.x = 50;
const animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
animate();
