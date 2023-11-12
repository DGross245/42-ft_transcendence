import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const borderGeometry = new THREE.BoxGeometry(153, 2, 2);
const paddleGeometry = new THREE.BoxGeometry(1, 15, 1);
const ballGeometry = new THREE.BoxGeometry(2, 2, 2);

const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

const ceiling = new THREE.Mesh(borderGeometry, ceilingMaterial);
const floor = new THREE.Mesh(borderGeometry, ceilingMaterial);
const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const ball = new THREE.Mesh(ballGeometry, ballMaterial);

const ambientLight = new THREE.AmbientLight(0x404040);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();

scene.add(rightPaddle, ceiling, leftPaddle, ball, floor, ambientLight, directionalLight);

const borderPositionY = 43;
const paddlePositionX = 76;

leftPaddle.position.x = -paddlePositionX;
rightPaddle.position.x = paddlePositionX;

ceiling.position.y = borderPositionY;
floor.position.y = -borderPositionY;

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  KeyW: false,
  KeyS: false,
};

function onKeyDown(event: KeyboardEvent): void {
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'KeyW' || event.code === 'KeyS') {
    keys[event.code] = true;
    event.preventDefault();
  }
}

function onKeyUp(event: KeyboardEvent): void {
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'KeyW' || event.code === 'KeyS') {
    keys[event.code] = false;
    event.preventDefault();
  }
}

const animate = (): void => {
  if (keys.ArrowUp) {
    if (leftPaddle.position.y < borderPositionY - paddleGeometry.parameters.height / 2) {
      leftPaddle.position.y += 0.5;
    }
  } else if (keys.ArrowDown) {
    if (leftPaddle.position.y > -borderPositionY + paddleGeometry.parameters.height / 2) {
      leftPaddle.position.y -= 0.5;
    }
  }
  if (keys.KeyW) {
    if (rightPaddle.position.y < borderPositionY - paddleGeometry.parameters.height / 2) {
      rightPaddle.position.y += 0.5;
    }
  } else if (keys.KeyS) {
    if (rightPaddle.position.y > -borderPositionY + paddleGeometry.parameters.height / 2) {
      rightPaddle.position.y -= 0.5;
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};


animate();
