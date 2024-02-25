import { useCallback, useEffect, useState } from "react";

type Sounds = {
	[key: string]: string;
};

const sounds: Sounds = {
	"tictactoe": "sounds/place-sound.mp3",
	"countSound": "sounds/ttt-countdown.mp3",
	"disconnect": "sounds/door-slam-172171.mp3",
	"end": "sounds/copper-bell-ding-1-172685.mp3",
	"finish": "sounds/game-finish.mp3",
	"win0": "sounds/game-level-complete-143022.mp3",
	"win1": "sounds/ambient-flute-notification-3-185275.mp3",
	"pongCountdown": "sounds/happy-pop-2-185287.mp3",
	"losing0": "sounds/violin-lose-1-175615.mp3",
	"losing1": "sounds/violin-lose-3-180434.mp3",
	"losing2": "sounds/brass-fail-1-c-185076.mp3",
	"timer" : "sounds/timer.mp3",
	"notify": "sounds/notify.mp3",
	"leave": "sounds/open-and-closed-door.mp3",
	"unavailable": "sounds/out-of-service_europe-105771.mp3",
	"silly": "sounds/silly-trumpet-11-187806.mp3",
	"rematchSend": "sounds/steel-blade-slice-1-188213.mp3",
	"rematchAccept": "sounds/steel-blade-slice-6-188218.mp3",
	"pay": "sounds/small-metal-object-drop-3-189816.mp3"
}

export function useSound() {
	const [soundElement, setSoundElement] = useState<HTMLAudioElement | undefined>(undefined);

	const newSound = () => {
		const audio = new Audio();
		audio.volume = 0.1;
		return ( audio );
	};

	const playSound = useCallback((sound: string) => {
		if (sound === 'losing') {
			const randomNum = Math.floor(Math.random() * 3);
			sound = `losing${randomNum}`
		} else if (sound === 'win') {
			const randomNum = Math.floor(Math.random() * 2);
			sound = `win${randomNum}`
		} else if (!(sound in sounds) || !soundElement) {
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