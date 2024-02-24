import { useCallback, useEffect, useState } from "react";

type Sounds = {
	[key: string]: string;
};

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

export function useSound() {
	const [soundElement, setSoundElement] = useState<HTMLAudioElement | undefined>(undefined);

	const newSound = () => {
		const audio = new Audio();
		audio.volume = 0.1;
		return ( audio );
	};

	const playSound = useCallback((sound: string) => {
		if (!(sound in sounds) || !soundElement) {
			return;
		}

		const audio = newSound();
		audio.src = (sounds as any)[sound];
		audio.play();
	}, [soundElement]);

	useEffect(() => {
		setSoundElement(newSound());
	}, []);

	return ( playSound );
}