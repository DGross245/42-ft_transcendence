"use client";

import React, { useEffect, useRef } from 'react';
import PongScene from '../app/pong/PongScene';

const ThreeScene: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) {
			console.error("Canvas element not found");
		return;
	}

	const pongScene = new PongScene(canvasRef.current);
	pongScene.initialize();

	const handleResize = () => {
		pongScene.handleResize();
	};

	window.addEventListener('resize', handleResize);

	const animate = () => {
		pongScene.update();
		pongScene.handleResize();
		pongScene.render();
		requestAnimationFrame(animate);
	};

	animate();

	return () => {
		window.removeEventListener('resize', handleResize);
	};
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<canvas ref={canvasRef} />
		</div>
	);
};

export default ThreeScene;
