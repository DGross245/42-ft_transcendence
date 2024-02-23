import { useEffect, useState } from "react";

type Sounds = {
	[key: string]: string;
};

interface SoundEngineTypes {
	soundElement: HTMLAudioElement;
	playSound(sound: string): void;
}

const sounds: Sounds = {
	"tictactoe": "sounds/place-sound.mp3",
	"countSound": "sounds/ttt-countdown.mp3",
	"door": "sounds/door-slam-172171.mp3",
	"end": "sounds/copper-bell-ding-1-172685.mp3",
	"finish": "sounds/game-finish.mp3",
	"win": "sounds/game-level-complete-143022.mp3",
	"pongCountdown": "sounds/happy-pop-2-185287.mp3",
	"losing1": "sounds/violin-lose-1-175615.mp3",
	"losing2": "sounds/violin-lose-3-180434.mp3",
	"timer" : "sounds/timer.mp3",
	"notify": "sounds/notify.mp3",
	"leave": "sounds/open-and-closed-door.mp3"
}

class SoundEngine implements SoundEngineTypes {
	soundElement: HTMLAudioElement;

	constructor() {
		this.soundElement = new Audio();
		document.body.appendChild(this.soundElement);
		this.soundElement.volume = 0.5;
	}

	playSound(sound: string) {
		console.log(sound)
		if (sound === 'losing') {
			const randomNum = Math.floor(Math.random() * 2);
			sound = randomNum === 0 ? "losing1" : "losing2";
		}

		if (!this.soundElement || !(sound in sounds)) {
			return;
		}

		this.soundElement.src = sounds[sound];
		this.soundElement.play();
	}
}

export function useSound() {
	const [soundEngine, setSoundEngine] = useState<SoundEngine | undefined>(undefined);

	useEffect(() => {
		setSoundEngine(new SoundEngine());
	}, []);

	return soundEngine;
}
