import * as THREE from 'three';
import PongScene from './PongScene.js';
// Scene creation
const scene = new PongScene();
scene.initialize();
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('pong')
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Main camera creation and configuration
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 90);
camera.lookAt(0, 0, 0);
// Animation loop including handling events
const tick = () => {
    scene.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
