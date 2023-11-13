import * as THREE from 'three'

export default class PongScene extends THREE.Scene
{
	private readonly keyDown = new Set<string>();

	private leftPaddle!: THREE.Mesh;
	private rightPaddle!: THREE.Mesh;
	private borderPositionY!: number;
	private paddleGeometry!: THREE.BoxGeometry;

	initialize() {
		// Object creation
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
	
		// Light creation
		const ambientLight = new THREE.AmbientLight(0x404040, 2);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(1, 1, 1).normalize();

		this.add(ambientLight, directionalLight);
		
		// Object postion settings
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

		//keyboard input handling
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	private onKeyDown(event: KeyboardEvent): void {
		this.keyDown.add(event.key.toLowerCase());
	}
	
	private onKeyUp(event: KeyboardEvent): void {
		this.keyDown.delete(event.key.toLowerCase());
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
		this.updateInput()
	}
}