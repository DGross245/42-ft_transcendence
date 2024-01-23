import { useEffect, useState } from "react";

const sounds = {
	"pong": "sounds/plinkaphone-164106.mp3",
	"tictactoe": "sounds/chango-clique-164103.mp3",
	"countSound": "sounds/nine-140664.mp3",
	"door": "sounds/door-slam-172171.mp3",
	"end": "sounds/copper-bell-ding-1-172685.mp3",
	"finish": "sounds/success_bell-6776.mp3",
	"win": "sounds/game-level-complete-143022.mp3",
	"pongCountdown": "sounds/happy-pop-2-185287.mp3",
	"losing1": "sounds/violin-lose-1-175615.mp3",
	"losing2": "sounds/violin-lose-3-180434.mp3"
}

class SoundEngine {
	soundEngineDiv: HTMLDivElement;

	constructor() {
		if (document.getElementById("soundEngine")) {
			document.body.removeChild(document.getElementById("soundEngine") as HTMLAudioElement);
		}
		const newDiv = document.createElement("div");
		newDiv.id = "soundEngine";
		document.body.appendChild(newDiv);
		this.soundEngineDiv = newDiv;
	}

	private addAndPlaySoundElement(src: string) {
		const soundElement = new Audio(src);
		soundElement.volume = 0.5;
		soundElement.autoplay = true;
		soundElement.muted = true;
		// const buttonElement = document.createElement("button");
		// buttonElement.style.display = "none";
		// buttonElement.onclick = () => {
		// 	buttonElement.remove();
		// 	soundElement.play();
		// }
		// this.soundEngineDiv.appendChild(buttonElement);
		// buttonElement.click();
	}

	playSound(sound: string) {
		if (!this.soundEngineDiv || !(sound in sounds)) {
			return;
		}
		this.addAndPlaySoundElement((sounds as any)[sound]);
	}
}

export function useSound() {
	const [soundEngine, setSoundEngine] = useState<SoundEngine | undefined>(undefined);

	useEffect(() => {
		setSoundEngine(new SoundEngine());
	}, []);

	return soundEngine;
}
