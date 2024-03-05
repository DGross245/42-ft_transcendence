import { Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider, Spinner, Switch, Tab, Tabs } from "@nextui-org/react";
import styles from "./Modals.module.css";
import ModalButton from "./ModalButton";
import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import pongGameImage from "@/assets/pongGame.png";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import useContract from "@/components/hooks/useContract";
import { useJoinEvents } from "@/components/JoinGame";
import { TournamentSubModal } from "./tournamentSubModal";
import useWSClient from "@/helpers/wsclient";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
export interface GameOptions {
	gameMode: boolean;
	isBotActive: boolean;
	botStrength: number;
}

interface SelectionModalProps {
	isOpen: boolean,
	onClose: (selected: string) => void,
	loading?: boolean
	setGameOptions: (options: GameOptions) => void;
}

export interface TournamentData {
	tournamentID: number,
	numberOfPlayers: number,
	connected?: number,
	isStarted: boolean,
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const DescriptionBox: React.FC<{children?: string}> = ({ children }) => {
	return (
		<Card className="w-full">
			<CardBody>
				{children}
			</CardBody>
		</Card>
	)
}

// TODO: Add a refresh button (with a refrech delay)
// TODO: Add a snippet for sharing GameID (Custom game only) should disapear on match start
// TODO: similar modal from tournament also for Custome Games
// TODO: Add a function that pulls an image based on selected modus for the gameType
// FIXME: Fix switch, maybe due to the setter, its movement or interaction with it seems laggy unsmooth
// TODO: Tournament end sequence missing, a mechnaic that displays maybe a winner of the tournament, and away to exit the game after tournament is finished.
//		 also reset tournament state
// TODO: Add a block for not connected users to access pages other then home

// TODO: setColorAndName still has a delay and isnt set after the modal disappears

// FIXME: Fix Timer positioning in Scene
// FIXME: Add a handler for each contract call when an  error happens (when null is returned)
// TODO: check if JSON is needed in socket events

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, loading, setGameOptions }) => {
	const [tournamentMode, setTournamentMode] = useState(false);
	const [selected, setSelected] = useState("singleplayer");
	const [botSelected, setBotSelected] = useState(false);
	const [strength, setStrength] = useState(0.5);
	const router = useRouter();
	const [data, setData] = useState<TournamentData[]>([]);
	const { getTournaments, tmContract } = useContract();
	const { onJoinTournament, onCreateTournament } = useJoinEvents();
	const wsclient = useWSClient();

	useEffect(() => {
		const getSocketNumber = async (index: number) => {
			if (wsclient) {
				const number = await wsclient.getNumberOfSocketsInTournament(index);
				return (number);
			}
			return (0);
		}

		const fetchData = async () => {
			if (tmContract) {
				const tournaments = await getTournaments();
				if (!tournaments) {
					return ;
				}
				const formattedData = tournaments.map(async (tournament, index) => {
					let finished = 0;
					for (let i = 0; i < tournament.games.length; i++) {
						if (tournament.games[i].finished) {
							finished++;
						}
					}

					if (finished === tournament.games.length) {
						return (null);
					} else {
						return {
							tournamentID: index,
							connected: (await getSocketNumber(index)),
							numberOfPlayers: tournament.players.length,
							isStarted: tournament.start_block != 0
						}
					}
				})

				const resolvedData = await Promise.all(formattedData);
				const filteredData = resolvedData.filter(data => data !== null) as TournamentData[];

				setData(filteredData);
			}
		};

		if (isOpen && wsclient) {
			fetchData();
		} else {
			setData([]);
			setTournamentMode(false);
			setSelected("singleplayer");
		}
	  }, [isOpen, tmContract, wsclient, tournamentMode, getTournaments, setData, setTournamentMode, setSelected]);

	useEffect(() => {
		if (selected !== "singleplayer" && selected !== "multiplayer") {
			setBotSelected(false);
		}
	}, [selected, setBotSelected]);

	const onButtonClick = () => {
		if (selected === "tournament-modes") {
			setTournamentMode(true);
		} else if (selected === "singleplayer") {
			setGameOptions({ gameMode: false, isBotActive: botSelected, botStrength: strength });
		} else if (selected === "multiplayer") {
			setGameOptions({ gameMode: true, isBotActive: botSelected, botStrength: strength });
		} else if (selected === "matchmaking"){
			setGameOptions({ gameMode: false, isBotActive: botSelected, botStrength: strength });
		}

		if (selected !== "tournament-modes") {
			onClose(selected);
		}
	}

	const returnToHome = () => {
		router.push('/');
	}

	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			backdrop="blur"
			onClose={returnToHome}
			placement="center"
			isDismissable={false}
			closeButton={
				<button>
					<XMarkIcon className="w-6 h-6"/>
				</button>
			}
		>
			<ModalContent>
				{tournamentMode && (
					<button
						type="button"
						onClick={() => setTournamentMode(false)}
						className="absolute appearance-none select-none top-1 left-1 p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2"
					>
						<ArrowLeftIcon className="w-6 h-6"/>
					</button>
				)}
				{loading && <div className=" absolute flex justify-center items-center h-full w-full">
					<Spinner size="lg"/>
				</div>}
				<ModalHeader className={clsx({"opacity-0": loading})}>
					<h1 className={clsx(styles.textWiggle, "text-2xl")}>Select Your Game</h1>
				</ModalHeader>
				<ModalBody className={clsx({"opacity-0": loading})}>
					{!tournamentMode && (<>
						<div className="flex w-full flex-col gap-4">
							<Image
								alt={"Game Preview"}
								className="object-cover rounded-xl w-auto h-auto mx-10"
								width={525}
								src={pongGameImage}
								priority
							/>
							<Tabs
								selectedKey={selected}
								className="self-center"
								aria-label="Pong GameModes"
								onSelectionChange={(key) => setSelected(key as string)}
							>
								<Tab key="singleplayer" title="Singleplayer">
									<DescriptionBox>Singleplayer Description</DescriptionBox> 
								</Tab>
								<Tab key="multiplayer" title="Multiplayer">
									<DescriptionBox>Multiplayer Description</DescriptionBox> 
								</Tab>
								<Tab key="matchmaking" title="Matchmaking">
									<DescriptionBox>Matchmaking Description</DescriptionBox> 
								</Tab>
								<Tab key="tournament-modes" title="Tournament Modes">
									<DescriptionBox>Tournament Modes Description</DescriptionBox> 
								</Tab>
							</Tabs>
						</div>
						<div className="flex items-center gap-4">
							<Switch isSelected={botSelected} onValueChange={setBotSelected} size="md" className="p-3" isDisabled={selected !== "singleplayer" && selected !== "multiplayer"}>
								Enable Bot Mode
							</Switch>
							<Slider
								label="Strength"
								showTooltip={true}
								formatOptions={{style: 'percent'}}
								tooltipValueFormatOptions={{style: 'percent' }}
								defaultValue={0.5}
								step={0.1}
								maxValue={1}
								minValue={0}
								value={strength}
								onChangeEnd={setStrength}
								style={{ width: '300px' }}
								isDisabled={!botSelected}
							/>
						</div>
					</>)}
					{tournamentMode && (
						<TournamentSubModal data={data} onCreateTournament={onCreateTournament} onJoinTournament={onJoinTournament} />
					)}
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					{!tournamentMode && (<ModalButton onClick={onButtonClick}>{selected != "tournament-modes" ? "Create/Join Game 🎮" : "Play Tournament 🚀"}</ModalButton>)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default SelectionModal;
