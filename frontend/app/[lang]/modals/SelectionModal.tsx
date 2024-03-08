import { Button, Card, CardBody, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider, Snippet, Spinner, Switch, Tab, Tabs } from "@nextui-org/react";
import SearchableGamesTable, { GameState } from "./components/SearchableGamesTable";
import ModalButton from "./components/ModalButton";
import { randInt } from "three/src/math/MathUtils";
import pongGameImage from "@/assets/pongGame.png";
import BackButton from "./components/BackButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Modals.module.css";
import Image from "next/image";
import clsx from "clsx";
import { toast } from 'react-toastify';

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import useContract from "@/components/hooks/useContract";
import { useJoinEvents } from "@/components/JoinGame";
import useWSClient, { WSClientType } from "@/helpers/wsclient";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
enum GameMode {
	Pong,
	TTT,
	Qubic,
	OneForAll
}

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
	gameType: string;
	setGameOptions: React.Dispatch<React.SetStateAction<GameOptions>>;
}

interface ModalContentProps {
	onClose?: () => void;
	closeMain: () => void;
	gameType: string;
	setGameOptions: React.Dispatch<React.SetStateAction<GameOptions>>;
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
const TournamentContent: React.FC<ModalContentProps> = ({ onClose, gameType, closeMain, setGameOptions }) => {
	const [selectedTournament, setSelectedTournament] = useState("");
	const [tournament, setTournament] = useState(false);
	const [tournamentID, setTournamentID] = useState(0);
	const [data, setData] = useState<{[key: string]: string | GameState}[]>([]);
	const [tournamentData, setTournamentData] = useState<{[key: string]: string | GameState}[]>([]);
	const { getTournaments, getTournament, tmContract, getTournamentTree } = useContract();
	const { onCreateTournament, onJoinTournament, onStartTournament } = useJoinEvents()
	const wsclient = useWSClient();
	const { address } = useWeb3ModalAccount();

	const _gameMode = useRef("");

	useEffect(() => {
		const getSocketNumber = async (index: number) => {
			if (wsclient) {
				const number = await wsclient.getNumberOfSocketsInTournament(index);
				return (number);
			}
			return (0);
		}

		const fetchData = async () => {
			if (tmContract) {
				const tournaments = await getTournaments();
				console.log(tournaments)
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

					if ((finished === tournament.games.length && Number(tournament.start_block) !== 0 )|| gameType !== tournament.game_type) {
						return (null);
					} else {
						const registered = String(tournament.players.length);
						const connected = String((await getSocketNumber(index)));

						return {
							id: String(index),
							players: connected + " / " + registered,
							state: tournament.start_block != 0 ? GameState.Running : GameState.Waiting
						}
					}
				})

				const resolvedData = await Promise.all(formattedData);
				const filteredData = resolvedData.filter(data => data !== null) as {[key: string]: string | GameState}[];
				setData(filteredData);
			}
		};

		if (tmContract && wsclient) {
			fetchData();
		}
	}, [tmContract, wsclient, gameType, getTournaments]);

	useEffect(() => {
		const fetchTournamentData = async () => {
			const tournametInfo = [];

			if (selectedTournament) {
				const players = (await getTournament(Number(selectedTournament))).players;
				for (let i = 0; i < players.length; i++) {
					tournametInfo.push(
						{
							id: players[i],
							score: ""
						}
					)
				}

				const games = await getTournamentTree(Number(selectedTournament));

				for (let i = 0; i < games.length; i++ ) {
					if (games[i].finished) {
						for (let j = 0; j < 2; j++) {
							const index = tournametInfo.findIndex(info => info.id === games[i].player_scores[j].addr)

							if (index) {
								tournametInfo[index].score += games[i].player_scores[j].score;
							}
						}
					}
				}

				setTournamentData(tournametInfo);
			}
		}

		fetchTournamentData();
	}, [selectedTournament, getTournament, getTournamentTree]);

	const onGameCreate = async () => {
		// search for already created tournaments
		const tournaments = await getTournaments();

		for (let i = 0; i < tournaments.length; i++) {
			if (tournaments[i].master === address) {
				toast.info("You already have an tournament running")
				return ;
			}
		}

		await onCreateTournament(gameType);
		joinTournament(String((await getTournaments()).length - 1));
		setTournament((last) => !last);
	}

	const joinTournament = async (id: string) => {
		const tournaments = await getTournaments();
		let skip = false;

		// Join prevention
		for (let i = 0; i < tournaments.length; i++) {
			const player = tournaments[i].players.find(player => player === String(address));

			if (player) {
				if (Number(tournaments[i].start_block) !== 0) {
					let finsihed = 0;

					for (let j = 0; j < tournaments[i].games.length; j++ ) {
						if (tournaments[i].games[j].finished) {
							finsihed++;
						}
					}

					if (finsihed !== tournaments[i].games.length && Number(id) !== i) {
						toast.info("You already joined a tournament")
						return ;
					}

					if (i === Number(id)) {
						skip = true;
					}
				} else if (i === Number(id)) {
					skip = true;
				}
			}
		}
	
		let isGameMode = undefined;

		if (gameType === 'TTT') {
			isGameMode = _gameMode.current === 'TTT' ? false : true; 
		} else {
			isGameMode = _gameMode.current === 'Pong' ? false : true; 
		}
		setGameOptions({ gameMode: isGameMode, botStrength: 0, isBotActive: false });
		onJoinTournament(Number(id), skip);
		setGameOptions({ gameMode: false, botStrength: 0, isBotActive: false });
		// Joining back after leaving
		if (Number(tournaments[Number(id)].start_block) !== 0) {
			wsclient?.requestTournament(Number(id), gameType);
			closeMain();
		}


		if (tournaments[Number(id)].master === String(address)) {
			setTournament(true);
		} else {
			closeMain();
		}

		setTournamentID(Number(id));
	}

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
						rows={tournamentData}
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

	// FIXME: onClose should leave room
	return (
		<ModalContentsWrapper
			onBack={onClose}
			title="Select Your Game"
		>
			<div className="flex items-end gap-2 justify-between">
				<Snippet className="w-64 h-unit-10" symbol="ID" disableCopy={!tournament}> 0 </Snippet>
				<Button className="w-full" color="primary" onClick={async () => {
					if (tournament) {
						onStartTournament(tournamentID, gameType);
						closeMain();
					} else {
						onGameCreate();
					}
				}}>
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
				rows={data}
				onJoin={(row) => joinTournament(row.id)}
				highlightedRows={[rows[0]]}
				onRowClick={(row) => setSelectedTournament(row.id)}
			/>
		</ModalContentsWrapper>
	)
}

const CustomGamesContent: React.FC<ModalContentProps> = ({ onClose, closeMain, gameType, setGameOptions }) => {
	const [game, setGame] = useState<undefined | number>(undefined);
	const [botEnabled, setBotEnabled] = useState(false);
	const [strength, setStrength] = useState(0.5);
	const { onCreateCustom, onJoinCustom } = useJoinEvents();
	const wsclient = useWSClient();
	const [customGames, setCustomGames] = useState<{[key: string]: string}[]>([]);
	
	const _gameMode = useRef("");
	const [gameMode, setGameMode] = useState<GameMode>(gameType === 'TTT' ? GameMode.TTT : GameMode.Pong);

	useEffect(() => {
		const getAllCustomGame = async () => {
			if (gameType === 'TTT') {
				_gameMode.current = gameMode === GameMode.TTT ? "TTT" : "Qubic";
			} else {
				_gameMode.current = gameMode === GameMode.Pong ? "Pong" : "OneForAll";
			}

			const games = await wsclient?.getCustomGames(_gameMode.current);
			setCustomGames(games);
		}

		if (wsclient) {
			getAllCustomGame();
		}
	}, [wsclient, gameType, gameMode]);

	const onGameCreate = () => {
		let isGameMode = undefined;

		if (gameType === 'TTT') {
			isGameMode = _gameMode.current === 'TTT' ? false : true; 
		} else {
			isGameMode = _gameMode.current === 'Pong' ? false : true; 
		}
		setGameOptions({ gameMode: isGameMode, botStrength: strength, isBotActive: botEnabled });
		onCreateCustom(_gameMode.current);
		closeMain();
	}

	const onJoinGame = (id: number) => {
		let isGameMode = undefined;

		if (gameType === 'TTT') {
			isGameMode = _gameMode.current === 'TTT' ? false : true; 
		} else {
			isGameMode = _gameMode.current === 'Pong' ? false : true; 
		}
		setGameOptions({ gameMode: isGameMode, botStrength: strength, isBotActive: botEnabled });
		onJoinCustom(id);
		closeMain();
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
					value={strength}
					onChange={setStrength}
				/>
			</div>
			<Tabs aria-label="Playermode" fullWidth isDisabled={(game ?? -1) >= 0} onSelectionChange={(value) => {
				if (gameType === 'TTT') {
					setGameMode(value === 'single' ? GameMode.TTT : GameMode.Pong);
				} else {
					setGameMode(value === 'multi' ? GameMode.Qubic: GameMode.OneForAll);
				}
			}}>
				<Tab key="single" title="Single Opponent" />
				<Tab key="multi" title="Multiple Opponents" />
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
					id: "Tournament ID",
				}}
				onJoin={(row) => onJoinGame(row.id)}
				rows={customGames}
			/>
		</ModalContentsWrapper>
	)
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */
// TODO:  Add a function that pulls an image based on selected modus for the gameType
// TODO:  Tournament end sequence missing, a mechnaic that displays maybe a winner of the tournament, and away to exit the game after tournament is finished.
//		  also reset tournament state
// TODO:  Add a block for not connected users to access pages other then home

// FIXME: Add a handler for each contract call when an  error happens (when null is returned)
const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, loading, gameType, setGameOptions }) => {
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
	const { onJoinTournament, onCreateTournament, onJoinQueue } = useJoinEvents();

	useEffect(() => {
		if (!isOpen) {
			setOpenSubModal(false);
			setSelected(Object.keys(modalData)[0] as keyof typeof modalData);
		}
	  }, [isOpen, modalData, setSelected]);

	  const onButtonClick = () => {
		if (selected == "matchmaking") {
			onJoinQueue();
			onClose();
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
				{openSubModal && selected == "tournament-modes" && <TournamentContent setGameOptions={setGameOptions} gameType={gameType} closeMain={onClose} onClose={() => setOpenSubModal(false)}/>}
				{openSubModal && selected == "custom-games" && <CustomGamesContent setGameOptions={setGameOptions} gameType={gameType} closeMain={onClose} onClose={() => setOpenSubModal(false)}/>}
			</ModalContent>
		</Modal>
	)
}
export default SelectionModal;
