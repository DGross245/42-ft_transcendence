import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class PongScene extends THREE.Scene {
	private readonly keyDown = new Set<string>();
	private leftPaddle!: THREE.Mesh;
	private rightPaddle!: THREE.Mesh;
	private borderPositionY!: number;
	private paddleGeometry!: THREE.BoxGeometry;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	private ball!: THREE.Mesh;
	private ballGeometry!: THREE.BoxGeometry;
	private ballSpeed = 2;
	private ballDirection = new THREE.Vector3(1, 1, 0).normalize();

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
		this.camera.position.set(0, 0, 300);
		this.camera.lookAt(0, 0, 0);
	}

	public render() {
		this.renderer.render(this, this.camera);
	}

	private setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	private setupScene() {
		const borderGeometry = new THREE.BoxGeometry(306, 4, 4);
		this.paddleGeometry = new THREE.BoxGeometry(4, 30, 4);
		this.ballGeometry = new THREE.BoxGeometry(4, 4, 4);

		const ceilingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })

		const ceiling = new THREE.Mesh(borderGeometry, ceilingMaterial);
		const floor = new THREE.Mesh(borderGeometry, ceilingMaterial);
		this.ball = new THREE.Mesh(this.ballGeometry, ballMaterial);
		this.leftPaddle = new THREE.Mesh(this.paddleGeometry, paddleMaterial);
		this.rightPaddle = new THREE.Mesh(this.paddleGeometry, paddleMaterial);
		this.add(this.rightPaddle, ceiling, this.leftPaddle, this.ball, floor);
		this.borderPositionY = 105;
		const paddlePositionX = 152;

		this.leftPaddle.position.x = -paddlePositionX;
		this.rightPaddle.position.x = paddlePositionX;

		ceiling.position.y = this.borderPositionY;
		floor.position.y = -this.borderPositionY;

		const cubeGeometry = new THREE.BoxGeometry(2, 2, 0.5);
		const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

		const numberOfCubes = 20;

		for (let i = 0; i < numberOfCubes; i++) {
			const cubeLine = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cubeLine.position.y = i * (this.borderPositionY * 2) / numberOfCubes - this.borderPositionY;
			cubeLine.position.z = -3;
			this.add(cubeLine);
		}
	
		this.setGroundReflection();
		let cameraControls = new OrbitControls( this.camera, this.renderer.domElement );
		cameraControls.target.set( 0, 0, 0 );
		cameraControls.maxDistance = 400;
		cameraControls.minDistance = 10;
		cameraControls.update();
	}

	private setupLighting() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(1, 1, 1).normalize();

		this.add(ambientLight, directionalLight);
	}

	private setupInputHandlers() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	private setGroundReflection() {
		let geometry = new THREE.PlaneGeometry(360, 230);
		let groundMirror = new Reflector(geometry, {
			clipBias: 0.003,
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0xb5b5b5 ,
		});
		this.add(groundMirror);
		groundMirror.position.z = -3;
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
		const speedMultiplier = 4;

		if (this.keyDown.has('arrowup')) {
			if (this.rightPaddle.position.y < this.borderPositionY - this.paddleGeometry.parameters.height / 2) {
				this.rightPaddle.position.y += speedMultiplier;
			}
		} else if (this.keyDown.has('arrowdown')) {
			if (this.rightPaddle.position.y > -this.borderPositionY + this.paddleGeometry.parameters.height / 2) {
				this.rightPaddle.position.y -= speedMultiplier;
			}
		}
		if (this.keyDown.has('w')) {
			if (this.leftPaddle.position.y < this.borderPositionY - this.paddleGeometry.parameters.height / 2) {
				this.leftPaddle.position.y += speedMultiplier;
			}
		} else if (this.keyDown.has('s')) {
			if (this.leftPaddle.position.y > -this.borderPositionY + this.paddleGeometry.parameters.height / 2) {
				this.leftPaddle.position.y -= speedMultiplier;
			}
		}
		
	}

	private updateBallPosition() {
		this.ball.position.add(this.ballDirection.clone().multiplyScalar(this.ballSpeed));
		const playAreaWidth = 306;
		const playAreaHeight = 2 * this.borderPositionY

		if (this.ball.position.x <= -playAreaWidth / 2 ||
			this.ball.position.x >= playAreaWidth / 2) {
			this.ballDirection.setX(-this.ballDirection.x);
		 }
		if (this.ball.position.y <= -playAreaHeight / 2 ||
			this.ball.position.y >= playAreaHeight / 2) {
			this.ballDirection.setY(-this.ballDirection.y);
		 }
		if (this.ball.position.x <= -playAreaWidth / 2 ||
			this.ball.position.x >= playAreaWidth / 2) {
			this.ball.position.set(0, 0, 0);
			this.ballDirection.set(Math.random() * 2 - 1, Math.random() * 2 - 1, 0).normalize();
		}
		const leftPaddleBoundingBox = new THREE.Box3().setFromObject(this.leftPaddle);
		const rightPaddleBoundingBox = new THREE.Box3().setFromObject(this.rightPaddle);
		const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
	 
		 if (ballBoundingBox.intersectsBox(leftPaddleBoundingBox) || ballBoundingBox.intersectsBox(rightPaddleBoundingBox)) {
			this.ballDirection.setX(-this.ballDirection.x);
		}
	}

	update() {

		this.updateInput();
		this.updateBallPosition();
	}

	handleResize() {
		const { clientWidth, clientHeight } = this.canvas;
		this.camera.aspect = clientWidth / clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(clientWidth, clientHeight);
	}
}
