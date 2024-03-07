import { Button, Card, CardBody, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider, Snippet, Spinner, Switch, Tab, Tabs } from "@nextui-org/react";
import SearchableGamesTable, { GameState } from "./components/SearchableGamesTable";
import ModalButton from "./components/ModalButton";
import { randInt } from "three/src/math/MathUtils";
import pongGameImage from "@/assets/pongGame.png";
import BackButton from "./components/BackButton";
import { useEffect, useMemo, useState } from "react";
import styles from "./Modals.module.css";
import Image from "next/image";
import clsx from "clsx";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import useContract from "@/components/hooks/useContract";
import { useJoinEvents } from "@/components/JoinGame";
import useWSClient from "@/helpers/wsclient";
/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
export interface GameOptions {
	gameMode: boolean;
	isBotActive: boolean;
	botStrength: number;
}

export interface TournamentData {
	id: string,
	players: string,
	state: GameState,
}

interface SelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	loading?: boolean;
}

interface ModalContentProps {
	onClose?: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
const ModalContentsWrapper: React.FC<{children?: React.ReactNode, loading?: boolean, onBack?: () => void, title: string}> = ({ children, loading, onBack, title }) => {
	return (<>
		{loading && <div className=" absolute flex justify-center items-center h-full w-full">
			<Spinner size="lg"/>
		</div>}
		{onBack && (<BackButton onClick={onBack}/>)}
		<ModalHeader className={clsx({"opacity-0": loading})}>
			<h1 className={clsx(styles.textWiggle, "text-2xl")}>{title}</h1>
		</ModalHeader>
		<ModalBody className={clsx({"opacity-0": loading})}>
			{children}
		</ModalBody>
	</>)
}

/* -------------------------------------------------------------------------- */
/*                               Modal Contents                               */
/* -------------------------------------------------------------------------- */
const TournamentContent: React.FC<ModalContentProps> = ({ onClose }) => {
	const [selectedTournament, setSelectedTournament] = useState("");
	const [tournament, setTournament] = useState(false);
	const [data, setData] = useState<{[key: string]: string | GameState}[]>([]);
	const { getTournaments, tmContract } = useContract();
	const wsclient = useWSClient();

	const rows = [
		{
		  	id: "1",
		  	players: "1 / 10",
		  	state: GameState.Running
		},
		{
			id: "2",
			players: "5 / 10",
			state: GameState.Waiting
		},
		{
			id: "3",
			players: "3 / 10",
			state: GameState.Running
		},
		{
			id: "4",
			players: "3 / 10",
			state: GameState.Running
		},
		{
			id: "5",
			players: "3 / 10",
			state: GameState.Running
		},
		{
			id: "6",
			players: "3 / 10",
			state: GameState.Running
		},
		{
			id: "7",
			players: "3 / 10",
			state: GameState.Running
		}
	];

	const rows2 = [
		{
		  	id: "0x0123",
		  	score: "2"
		},
		{
			id: "0x0133",
			score: "2"
		},
		{
			id: "0x0423",
			score: "2"
		}
	];

	const rows3 = [
		{
			id: 1,
		  	player: "0x01231231231231231231231231123",
		  	against: "0x01231231231231231231231231123"
		},
		{
			id: 2,
			player: "0x01231231231231231231231231123",
			against: "0x01231231231231231231231231123"
		},
		{
			id: 3,
			player: "0x01231231231231231231231231123",
			against: "0x01231231231231231231231231123"
		}
	];

	// useEffect(() => {
	// 	const getSocketNumber = async (index: number) => {
	// 		if (wsclient) {
	// 			const number = await wsclient.getNumberOfSocketsInTournament(index);
	// 			return (number);
	// 		}
	// 		return (0);
	// 	}

	// 	const fetchData = async () => {
	// 		if (tmContract) {
	// 			const tournaments = await getTournaments();
	// 			if (!tournaments) {
	// 				return ;
	// 			}
	// 			const formattedData = tournaments.map(async (tournament, index) => {
	// 				let finished = 0;
	// 				for (let i = 0; i < tournament.games.length; i++) {
	// 					if (tournament.games[i].finished) {
	// 						finished++;
	// 					}
	// 				}

	// 				if (finished === tournament.games.length) {
	// 					return (null);
	// 				} else {
	// 					const registered = String(tournament.players.length);
	// 					const connected = String((await getSocketNumber(index)));

	// 					return {
	// 						id: String(index),
	// 						players: connected + " / " + registered,
	// 						state: tournament.start_block != 0 ? GameState.Running : GameState.Waiting
	// 					}
	// 				}
	// 			})

	// 			const resolvedData = await Promise.all(formattedData);
	// 			const filteredData = resolvedData.filter(data => data !== null) as {[key: string]: string | GameState}[];
	// 			console.log(filteredData);
	// 			setData(filteredData);
	// 		}
	// 	};

	// 	if (tmContract && wsclient) {
	// 		fetchData
	// 	}
	// }, [tmContract, wsclient, getTournaments]);

	if (selectedTournament !== "") {
		return (
			<ModalContentsWrapper
				onBack={() => setSelectedTournament("")}
				title={`Game Results of Game ${selectedTournament}`}
			>
				<div className="flex gap-4">
					<SearchableGamesTable
						ariaLabel="Tournaments Table"
						columns={{
							id: "Player",
							score: "Score"
						}}
						rows={rows2}
					/>
					<SearchableGamesTable
						ariaLabel="Tournaments Table"
						columns={{
							player: "Player",
							against: "Against"
						}}
						rows={rows3}
					/>
				</div>
			</ModalContentsWrapper>
		)
	}

	return (
		<ModalContentsWrapper
			onBack={onClose}
			title="Select Your Game"
		>
			<div className="flex items-end gap-2 justify-between">
				<Snippet className="w-64 h-unit-10" symbol="ID" disableCopy={!tournament}>100</Snippet>
				<Button className="w-full" color="primary" onClick={() => setTournament((last) => !last)}>
					{tournament ? "Start Tournament" : "Create New Tournament"}
				</Button>
			</div>
			<Divider/>
			<SearchableGamesTable
				ariaLabel="Tournaments Table"
				columns={{
					id: "Tournament ID",
					players: "Number of Players",
					state: "Status"
				}}
				rows={rows}
				highlightedRows={[rows[0]]}
				onJoin={(row) => console.log(row)}
				onRowClick={(row) => setSelectedTournament(row.id)}
			/>
		</ModalContentsWrapper>
	)
}

const CustomGamesContent: React.FC<ModalContentProps> = ({ onClose }) => {
	const [game, setGame] = useState<undefined | number>(undefined);
	const [botEnabled, setBotEnabled] = useState(false);
	const [botSelected, setBotSelected] = useState(false);
	const [strength, setStrength] = useState(0.5);

	const rows = [
		{
			id: "1",
			state: "Running"
		},
		{
			id: "2",
			state: "Running"
		},
		{
			id: "3",
			state: "Waiting..."
		}
	];

	const onGameCreate = () => {
		setGame(randInt(100, 999));
	}

	return (
		<ModalContentsWrapper
			onBack={onClose}
			title="Select Your Game"
		>
			<div className="flex gap-4">
				<Switch size="md" isSelected={botEnabled} onValueChange={setBotEnabled}>
					Enable Bot Mode
				</Switch>
				<Slider
					isDisabled={!botEnabled}
					className="w-full"
					label="Difficulty"
					step={10}
					defaultValue={50}
				/>
			</div>
			<Tabs aria-label="Playermode" fullWidth isDisabled={(game ?? -1) >= 0}>
				<Tab key="photos" title="Single Opponent"/>
				<Tab key="music" title="Multiple Opponents"/>
			</Tabs>
			<div className="flex gap-4">
				<Snippet
					symbol="ID"
					disableCopy={!game}
					className={clsx("w-64 h-unit-10", {"opacity-40 cursor-not-allowed": !game})}
				>
					{game ?? ""}
				</Snippet>
				<Button className="w-full" color="primary" onClick={onGameCreate}>
					Create New Game
				</Button>
			</div>
			<Divider/>
			<SearchableGamesTable
				ariaLabel="Games Table"
				columns={{
					id: "Tournament ID"
				}}
				onJoin={(row) => console.log(row)}
				rows={rows}
			/>
		</ModalContentsWrapper>
	)
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */
// TODO:  Add a refresh button (with a refrech delay)
// TODO:  Add a snippet for sharing GameID (Custom game only) should disapear on match start
// TODO:  similar modal from tournament also for Custome Games
// TODO:  Add a function that pulls an image based on selected modus for the gameType
// TODO:  Tournament end sequence missing, a mechnaic that displays maybe a winner of the tournament, and away to exit the game after tournament is finished.
//		  also reset tournament state
// TODO:  Add a block for not connected users to access pages other then home

// FIXME: If player swtiches pages, he doesnt leave the room
// FIXME: Add a handler for each contract call when an  error happens (when null is returned)
const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, loading }) => {
	const modalData = useMemo(() => ({
		"custom-games": {
			title: "Custom Games",
			description: "Custom Games Description",
			button: "Create/Join Game 🎮"
		},
		"matchmaking": {
			title: "Matchmaking",
			description: "Matchmaking Description",
			button: "Find Match 🎮"
		},
		"tournament-modes": {
			img: "",
			title: "Tournament Modes",
			description: "Tournament Modes Description",
			button: "Play Tournament 🚀"
		}
	}), [])

	const [selected, setSelected] = useState(Object.keys(modalData)[0] as keyof typeof modalData);
	const [openSubModal, setOpenSubModal] = useState(false);
	const router = useRouter();
	const { onJoinTournament, onCreateTournament } = useJoinEvents();

	useEffect(() => {
		if (!isOpen) {
			setOpenSubModal(false);
			setSelected(Object.keys(modalData)[0] as keyof typeof modalData);
		}
	  }, [isOpen, modalData, setSelected]);

	  const onButtonClick = () => {
		if (selected == "matchmaking") {
			return;
		}
		setOpenSubModal(true);
	}

	const returnToHome = () => {
		router.push('/');
		setOpenSubModal(true);
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
				{!openSubModal && (<>
					<ModalHeader className={clsx({"opacity-0": loading})}>
						<h1 className={clsx(styles.textWiggle, "text-2xl")}>Select Your Game</h1>
					</ModalHeader>
					<ModalBody className={clsx({"opacity-0": loading})}>
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
								onSelectionChange={(key) => setSelected(key as keyof typeof modalData)}
							>
								{Object.keys(modalData).map((key: string) => (
									<Tab key={key as keyof typeof modalData} title={modalData[key as keyof typeof modalData].title}>
										<Card className="w-full">
											<CardBody>{modalData[key as keyof typeof modalData].description}</CardBody>
										</Card>
									</Tab>
								))}
							</Tabs>
						</div>
					</ModalBody>
					<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
						<ModalButton onClick={onButtonClick}>{modalData[selected].button}</ModalButton>
					</ModalFooter>
				</>)}
				{openSubModal && selected == "tournament-modes" && <TournamentContent onClose={() => setOpenSubModal(false)}/>}
				{openSubModal && selected == "custom-games" && <CustomGamesContent onClose={() => setOpenSubModal(false)}/>}
			</ModalContent>
		</Modal>
	)
}
export default SelectionModal;
