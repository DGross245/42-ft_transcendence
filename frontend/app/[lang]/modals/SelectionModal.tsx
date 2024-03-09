import { Button, Card, CardBody, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider, Snippet, Spinner, Switch, Tab, Tabs } from "@nextui-org/react";
import SearchableGamesTable, { GameState } from "./components/SearchableGamesTable";
import ModalButton from "./components/ModalButton";
import pongGameImage from "@/assets/pongGame.png";
import ticTacToeImage from "@/assets/tttGame.png";
import BackButton from "./components/BackButton";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Modals.module.css";
import Image from "next/image";
import clsx from "clsx";
import { toast } from 'react-toastify';

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import useContract from "@/components/hooks/useContract";
import { useJoinEvents } from "@/components/hooks/useJoinGame";
import { WSClientType } from "@/helpers/wsclient";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { useKey } from "@/components/hooks/useKey";
import { useTranslation } from "@/app/i18n";
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
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	tournamentState?: {id: number, index: number},
	wsclient: WSClientType | null;
	setGameID: React.Dispatch<React.SetStateAction<string>>;
}

interface ModalContentProps {
	onClose?: () => void;
	closeMain: () => void;
	gameType: string;
	setGameOptions: React.Dispatch<React.SetStateAction<GameOptions>>;
	tournamentState?: {id: number, index: number};
	wsclient: WSClientType | null;
	setGameID?: React.Dispatch<React.SetStateAction<string>>;
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
const TournamentContent: React.FC<ModalContentProps> = ({ onClose, gameType, closeMain, setGameOptions, tournamentState, wsclient }) => {
	const [selectedTournament, setSelectedTournament] = useState("");
	const [tournament, setTournament] = useState(false);
	const [tournamentID, setTournamentID] = useState(0);
	const [data, setData] = useState<{[key: string]: string | GameState}[]>([]);
	const [tournamentData, setTournamentData] = useState<{[key: string]: string | GameState}[]>([]);
	const { getTournaments, getTournament, tmContract, getTournamentTree, getPlayer } = useContract();
	const { onCreateTournament, onJoinTournament, onStartTournament } = useJoinEvents(wsclient)
	const { address } = useWeb3ModalAccount();
	const [games, setGames] = useState<{[key: string]: string | GameState}[]>([]);
	const { t } = useTranslation("modals");

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

					if (gameType !== tournament.game_type) {
						return (null);
					}
					else if ((finished === tournament.games.length && Number(tournament.start_block) !== 0)) {
						return {
							id: String(index),
							players: "-",
							state: GameState.Finished
						}
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

		const fetchDataInterval = setInterval(fetchData, 5000);

		if (tmContract && wsclient) {
			fetchData();
		}

		return () => clearInterval(fetchDataInterval);
	}, [tmContract, wsclient, gameType, getTournaments]);

	useEffect(() => {
		const fetchTournamentData = async () => {
			let tournametInfo = [];
			const gameStats = [];

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

				for (let i = 0; i < games.length; i++) {
					gameStats.push({
						id: String(i),
						player1: games[i].player_scores[0].addr,
						player2: games[i].player_scores[1].addr
					});
				}
				setGames(gameStats);

				for (let i = 0; i < games.length; i++ ) {
					if (games[i].finished) {
						for (let j = 0; j < 2; j++) {
							const index = tournametInfo.findIndex(info => info.id === games[i].player_scores[j].addr)

							if (index) {
								let currentScore = Number(tournametInfo[index].score);
								let newScore = currentScore + Number(games[i].player_scores[j].score);
								tournametInfo[index].score = String(newScore);
							}
						}
					}
				}

				setTournamentData(tournametInfo);
			}
		}

		const fetchDataInterval = setInterval(fetchTournamentData, 5000);

		if (selectedTournament) {
			fetchTournamentData();
		}

		return () => clearInterval(fetchDataInterval);
	}, [selectedTournament, tournamentState, getTournament, getTournamentTree]);

	const onGameCreate = async () => {
		// search for already created tournaments
		const tournaments = await getTournaments();

		for (let i = 0; i < tournaments.length; i++) {
			if (tournaments[i].master === address) {
				let finished = 0;

				if (Number(tournaments[i].start_block) !== 0) {
					for (let j = 0; j < tournaments[i].games.length; j++ ) {
						if (tournaments[i].games[j].finished) {
							finished++;
						}
					}
					if (finished !== tournaments[i].games.length) {
						toast.info(t("selectionmodal.toast.tournamentrunning"))
						return ;
					}
				} else {
					toast.info(t("selectionmodal.toast.tournamentrunning"))
					return ;
				}

			}
		}

		if (await onCreateTournament(gameType)) {
			return ;
		}
		if (await joinTournament(String((await getTournaments()).length - 1))) {
			return ;
		}
		setTournament(true);
	}

	const joinTournament = async (id: string) => {
		const tournaments = await getTournaments();
		let skip = false;

		// Join prevention
		for (let i = 0; i < tournaments.length; i++) {
			const player = tournaments[i].players.find(player => player === String(address));

			if (player) {
				if (Number(tournaments[i].start_block) !== 0) {
					let finished = 0;

					for (let j = 0; j < tournaments[i].games.length; j++ ) {
						if (tournaments[i].games[j].finished) {
							finished++;
						}
					}

					if (finished !== tournaments[i].games.length && Number(id) !== i) {
						toast.info(t("selectionmodal.toast.alreadyjoined"))
						return (1);
					}

					if (i === Number(id)) {
						skip = true;
					}
				} else if (i === Number(id)) {
					skip = true;
				}
			} else if (Number(tournaments[i].start_block) !== 0 && i === Number(id)) {
				toast.info(t("selectionmodal.toast.cantjoined"))
				return (1);
			}
		}

		setGameOptions({ gameMode: false, botStrength: 0, isBotActive: false });
		if (await onJoinTournament(Number(id), skip)) {
			return (1);
		}

		// Joining back after leaving
		if (Number(tournaments[Number(id)].start_block) !== 0) {
			setSelectedTournament(id);
			wsclient?.requestTournament(Number(id), gameType);
		} else if (tournaments[Number(id)].master === String(address)) {
			setTournament(true);
		} else {
			setSelectedTournament(id);
		}
 
		setTournamentID(Number(id));
	}

	useEffect(() => {
		if (tournamentState?.index !== -1) {
			setSelectedTournament(String(tournamentState?.id));
			setTimeout(() => {
				closeMain();
			}, 2500);
		}
		if (tournamentState?.id !== -1 && tournamentState?.index === -1) {
			setSelectedTournament(String(tournamentState?.id));
		}
	}, [tournamentState, closeMain])

	if (selectedTournament !== "") {
		return (
			<ModalContentsWrapper
				onBack={() => setSelectedTournament("")}
				title={t("selectionmodal.gameresults.title", {gameid: selectedTournament})}
			>
				<div className="flex gap-4">
					<SearchableGamesTable
						ariaLabel="Tournaments Table"
						columns={{
							id: t("selectionmodal.player"),
							score: t("selectionmodal.score")
						}}
						rows={tournamentData}
					/>
					<SearchableGamesTable
						ariaLabel="Tournaments Table"
						columns={{
							player1: t("selectionmodal.player"),
							player2: t("selectionmodal.against")
						}}
						rows={games}
						highlightedRows={tournamentState!.index === -1 ? [] : [games[tournamentState!.index]]}
						tooltipEnabled={true}
					/>
				</div>
			</ModalContentsWrapper>
		)
	}

	return (
		<ModalContentsWrapper
			onBack={onClose}
			title={t("selectionmodal.selectgame.title")}
		>
			<div className="flex items-end gap-2 justify-between">
				<Snippet className="w-64 h-unit-10" symbol="ID" disableCopy={!tournament}> 0 </Snippet>
				<Button className="w-full" color="primary" onClick={async () => {
					if (tournament) {
						if (!(await onStartTournament(tournamentID, gameType))) {
							setSelectedTournament(String(tournamentID));
						}
					} else {
						onGameCreate();
					}
				}}>
					{tournament ? t("selectionmodal.selectgame.start") : t("selectionmodal.selectgame.create")}
				</Button>
			</div>
			<Divider/>
			<SearchableGamesTable
				ariaLabel="Tournaments Table"
				columns={{
					id: t("selectionmodal.selectgame.tournamentid"),
					players: t("selectionmodal.selectgame.numplayers"),
					state: t("selectionmodal.selectgame.status")
				}}
				rows={data}
				onJoin={(row) => joinTournament(row.id)}
				onRowClick={(row) => setSelectedTournament(row.id)}
			/>
		</ModalContentsWrapper>
	)
}

const CustomGamesContent: React.FC<ModalContentProps> = ({ setGameID, onClose, closeMain, gameType, setGameOptions, wsclient }) => {
	const [game, setGame] = useState<undefined | number>(undefined);
	const [botEnabled, setBotEnabled] = useState(false);
	const [strength, setStrength] = useState<number | number[]>(0.5);
	const { onCreateCustom } = useJoinEvents(wsclient);
	const [customGames, setCustomGames] = useState<{[key: string]: string}[]>([]);
	const _gameMode = useRef("");
	const [gameMode, setGameMode] = useState<GameMode>(gameType === 'TTT' ? GameMode.TTT : GameMode.Pong);
	const { t } = useTranslation("modals");

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

		const fetchDataInterval = setInterval(getAllCustomGame, 5000);

		if (wsclient) {
			getAllCustomGame();
		}

		return () => clearInterval(fetchDataInterval);
	}, [wsclient, gameType, gameMode]);

	const onGameCreate = () => {
		let isGameMode = undefined;
		let botStrength = 0;

		if (gameType === 'TTT') {
			isGameMode = _gameMode.current === 'TTT' ? false : true; 
		} else {
			isGameMode = _gameMode.current === 'Pong' ? false : true; 
		}

		if (gameType === 'TTT') {
			botStrength = ((strength as number) / 100);
		} else if (gameType === 'Pong') {
			botStrength = ((strength as number) * 1.5);
		}
		setGameOptions({ gameMode: isGameMode, botStrength: botStrength, isBotActive: botEnabled });
		onCreateCustom(_gameMode.current);
		closeMain();
	}

	const onJoinGame = (id: string) => {
		let isGameMode = undefined;

		if (gameType === 'TTT') {
			isGameMode = _gameMode.current === 'TTT' ? false : true; 
		} else {
			isGameMode = _gameMode.current === 'Pong' ? false : true; 
		}

		setGameOptions({ gameMode: isGameMode, botStrength: 0, isBotActive: false });
		setGameID(id);
		closeMain();
	}

	return (
		<ModalContentsWrapper
			onBack={onClose}
			title={t("selectionmodal.selectgame.title")}
		>
			<div className="flex gap-4">
				<Switch size="md" isSelected={botEnabled} onValueChange={setBotEnabled}>
					Enable Bot Mode
				</Switch>
				<Slider
					isDisabled={!botEnabled}
					className="w-full"
					label={t("selectionmodal.selectgame.difficulty")}
					step={10}
					defaultValue={50}
					value={strength}
					onChange={setStrength}
				/>
			</div>
			<Tabs aria-label="Playermode" fullWidth isDisabled={(game ?? -1) >= 0} onSelectionChange={(value) => {
				if (value === 'single') {
					setGameMode(gameType === 'TTT' ? GameMode.TTT : GameMode.Pong);
				} else {
					setGameMode(gameType === 'TTT' ? GameMode.Qubic: GameMode.OneForAll);
				}
			}}>
				<Tab key="single" title={t("selectionmodal.selectgame.singleopponent")} />
				<Tab key="multi" title={t("selectionmodal.selectgame.multiopponent")} />
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
					{t("selectionmodal.selectgame.creategame")}
				</Button>
			</div>
			<Divider/>
			<SearchableGamesTable
				ariaLabel="Games Table"
				columns={{
					id: t("selectionmodal.selectgame.tournamentid"),
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
const SelectionModal: React.FC<SelectionModalProps> = ({ setGameID, wsclient, isOpen, onClose, loading, gameType, setGameOptions, tournamentState, setOpen}) => {
	const { t } = useTranslation("modals");

	const modalData = useMemo(() => ({
		"custom-games": {
			title: t("selectionmodal.customgames.title"),
			description: t("selectionmodal.customgames.description"),
			button: t("selectionmodal.customgames.createjoin")
		},
		"matchmaking": {
			title: t("selectionmodal.matchmaking.title"),
			description: t("selectionmodal.matchmaking.description"),
			button: t("selectionmodal.matchmaking.find")
		},
		"tournament-modes": {
			title: t("selectionmodal.tournament.title"),
			description: t("selectionmodal.tournament.description"),
			button: t("selectionmodal.tournament.play")
		}
	}), [t])

	const [selected, setSelected] = useState(Object.keys(modalData)[0] as keyof typeof modalData);
	const [openSubModal, setOpenSubModal] = useState(false);
	const router = useRouter();
	const { onJoinQueue } = useJoinEvents(wsclient);
	const tkey = useKey(['T', 't']);

	useEffect(() => {
		if (!isOpen) {
			setOpenSubModal(false);
			setSelected(Object.keys(modalData)[0] as keyof typeof modalData);
		}

		if (isOpen && tournamentState?.index !== -1 && tournamentState?.id !== -1) {
			setOpen(true);
			setOpenSubModal(true);
			setSelected("tournament-modes");
		}

		if (tournamentState?.index === -1 && tournamentState?.id !== -1) {
			setOpen(true);
			setOpenSubModal(true);
			setSelected("tournament-modes");
		}
	}, [isOpen, modalData, tournamentState, setOpen, setSelected]);

	useEffect(() => {
		if (tkey.isKeyDown && tournamentState?.id !== -1) {
			setOpen((prevState) => !prevState);
		}
	}, [tkey.isKeyDown, tournamentState, setOpen]);

	const onButtonClick = () => {
		if (selected == "matchmaking") {
			onJoinQueue(gameType);
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
						<h1 className={clsx(styles.textWiggle, "text-2xl")}>{t("selectionmodal.selectgame.title")}</h1>
					</ModalHeader>
					<ModalBody className={clsx({"opacity-0": loading})}>
						<div className="flex w-full flex-col gap-4">
							<Image
								alt={"Game Preview"}
								className="object-cover rounded-xl w-auto h-auto mx-10"
								width={525}
								src={gameType === "TTT" ? ticTacToeImage : pongGameImage}
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
				{openSubModal && selected == "tournament-modes" && <TournamentContent wsclient={wsclient} tournamentState={tournamentState} setGameOptions={setGameOptions} gameType={gameType} closeMain={onClose} onClose={() => setOpenSubModal(false)}/>}
				{openSubModal && selected == "custom-games" && <CustomGamesContent setGameID={setGameID} wsclient={wsclient} setGameOptions={setGameOptions} gameType={gameType} closeMain={onClose} onClose={() => setOpenSubModal(false)}/>}
			</ModalContent>
		</Modal>
	)
}
export default SelectionModal;
