import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

export default class PongScene extends THREE.Scene {
	private readonly keyDown = new Set<string>();
	private leftPaddle!: THREE.Mesh;
	private rightPaddle!: THREE.Mesh;
	private borderPositionY!: number;
	private paddleGeometry!: THREE.BoxGeometry;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;

	constructor(private canvas: HTMLCanvasElement) {
		super();
	}

	initialize() {
		this.setupCamera();
		this.setupRenderer();
		this.setupScene();
		this.setupLighting();
		this.setupInputHandlers();
	}

	private setupCamera() {
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 0, 90);
		this.camera.lookAt(0, 0, 0);
	}

	public render() {
		this.renderer.render(this, this.camera);
	}

	private setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setClearColor(0x000000, 1); // Set clear color to black
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	private setupScene() {
		const borderGeometry = new THREE.BoxGeometry(153, 2, 2);
		this.paddleGeometry = new THREE.BoxGeometry(1, 15, 1);
		const ballGeometry = new THREE.BoxGeometry(2, 2, 2);

		const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

		const ceiling = new THREE.Mesh(borderGeometry, ceilingMaterial);
		const floor = new THREE.Mesh(borderGeometry, ceilingMaterial);
		const ball = new THREE.Mesh(ballGeometry, ballMaterial);
		this.leftPaddle = new THREE.Mesh(this.paddleGeometry, paddleMaterial);
		this.rightPaddle = new THREE.Mesh(this.paddleGeometry, paddleMaterial);
		this.add(this.rightPaddle, ceiling, this.leftPaddle, ball, floor);
		this.borderPositionY = 43;
		const paddlePositionX = 76;

		this.leftPaddle.position.x = -paddlePositionX;
		this.rightPaddle.position.x = paddlePositionX;

		ceiling.position.y = this.borderPositionY;
		floor.position.y = -this.borderPositionY;
		
		// Center line creation
		const cubeGeometry = new THREE.BoxGeometry(1, 1, 0.25);
		const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

		const numberOfCubes = 20;

		for (let i = 0; i < numberOfCubes; i++) {
			const cubeLine = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cubeLine.position.y = i * (this.borderPositionY * 2) / numberOfCubes - this.borderPositionY;
			cubeLine.position.z = -1;
			this.add(cubeLine);
		}
	
	this.setGroundReflection();
	}

	private setupLighting() {
		const ambientLight = new THREE.AmbientLight(0x404040, 5);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(1, 1, 1).normalize();

		this.add(ambientLight, directionalLight);
	}

	private setupInputHandlers() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	private setGroundReflection() {
		let geometry = new THREE.PlaneGeometry(180, 100);
		let groundMirror = new Reflector(geometry, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0xb5b5b5,
	});

	this.add(groundMirror);
	groundMirror.position.z = -1;
	}

	private onKeyDown(event: KeyboardEvent): void {
		this.keyDown.add(event.key.toLowerCase());
		if (['arrowup', 'arrowdown'].includes(event.key.toLowerCase())) {
			event.preventDefault();
		}
	}

	private onKeyUp(event: KeyboardEvent): void {
		this.keyDown.delete(event.key.toLowerCase());
		if (['arrowup', 'arrowdown'].includes(event.key.toLowerCase())) {
			event.preventDefault();
		}
	}

	private updateInput() {
		const speedMultiplier = 1;

		if (this.keyDown.has('arrowup')) {
			if (this.leftPaddle.position.y < this.borderPositionY - this.paddleGeometry.parameters.height / 2) {
				this.leftPaddle.position.y += speedMultiplier;
			}
		} else if (this.keyDown.has('arrowdown')) {
			if (this.leftPaddle.position.y > -this.borderPositionY + this.paddleGeometry.parameters.height / 2) {
				this.leftPaddle.position.y -= speedMultiplier;
			}
		}
		if (this.keyDown.has('w')) {
			if (this.rightPaddle.position.y < this.borderPositionY - this.paddleGeometry.parameters.height / 2) {
				this.rightPaddle.position.y += speedMultiplier;
			}
		} else if (this.keyDown.has('s')) {
			if (this.rightPaddle.position.y > -this.borderPositionY + this.paddleGeometry.parameters.height / 2) {
				this.rightPaddle.position.y -= speedMultiplier;
			}
		}
	}

	update() {
		this.updateInput();
	}

	handleResize() {
		const { clientWidth, clientHeight } = this.canvas;
		this.camera.aspect = clientWidth / clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(clientWidth, clientHeight);
	}
}
