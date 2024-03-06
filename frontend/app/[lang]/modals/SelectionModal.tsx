import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider, Snippet, Spinner, Switch, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, getKeyValue } from "@nextui-org/react";
import styles from "./Modals.module.css";
import ModalButton from "./components/ModalButton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import pongGameImage from "@/assets/pongGame.png";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BackButton from "./components/BackButton";
import SearchableGamesTable, { GameState } from "./components/SearchableGamesTable";
import TextButton from "./components/TextButton";

const modalData = {
	"custom-games": {
		img: "",
		title: "Custom Games",
		description: "Custom Games Description",
		button: "Create/Join Game 🎮"
	},
	"matchmaking": {
		img: "",
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
}

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface SelectionModalProps {
	isOpen: boolean,
	onClose: () => void,
	loading?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
const ModalContentsWrapper: React.FC<{children?: React.ReactNode, loading?: boolean, onBack?: () => void, title: string}> = ({ children, loading, onBack, title }) => {
	return (<>
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
const TournamentContent: React.FC<{loading?: boolean, setLoading?: (state: boolean) => void}> = ({ loading, setLoading }) => {
	const [tournament, setTournament] = useState(false);
	const [selectedTournament, setSelectedTournament] = useState("");

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

	if (selectedTournament !== "") {
		return (
			<ModalContentsWrapper
				loading={loading}
				onBack={() => setSelectedTournament("")}
				title={`Game Results of Game ${selectedTournament}`}
			>
				<SearchableGamesTable
					ariaLabel="Tournaments Table"
					columns={{
						id: "Player",
						score: "Score"
					}}
					rows={rows2}
				/>
			</ModalContentsWrapper>
		)
	}

	return (
		<ModalContentsWrapper
			loading={loading}
			title="Select Your Game"
		>
			<div className="flex items-end gap-2 justify-between">
				<Snippet className="w-64 h-unit-10" symbol="ID" disableCopy={!tournament}>100</Snippet>
				<Button className="w-full" color="primary" onClick={() => setTournament((last) => !last)}>
					{tournament ? "Start Tournament" : "Create New Tournament"}
				</Button>
				{/* <Input
					isDisabled={tournament}
					type="number"
					placeholder="0"
					label="Tournament Length"
					labelPlacement="outside"
					endContent={
						<div className="pointer-events-none flex items-center">
							<span className="text-default-400 text-small">Blocks</span>
						</div>
					}
				/> */}
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
				onRowClick={(row) => setSelectedTournament(row.id)}
			/>
		</ModalContentsWrapper>
	)
}

const CustomGamesContent: React.FC<{loading?: boolean, setLoading?: (state: boolean) => void}> = ({ loading, setLoading }) => {
	const [game, setGame] = useState(false);

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

	return (
		<ModalContentsWrapper
			loading={loading}
			title="Select Your Game"
		>
			<Switch size="md">
				Enable Bot Mode
			</Switch>
			<Slider
				className="w-full"
				label="Difficulty"
				step={10}
				defaultValue={50}
			/>
			<Tabs aria-label="Playermode" fullWidth>
				<Tab key="photos" title="Single Opponent"/>
				<Tab key="music" title="Multiple Opponents"/>
			</Tabs>
			<div className="flex items-end gap-2 justify-between">
				<Snippet className="w-64 h-unit-10" symbol="ID" disableCopy={!game}>100</Snippet>
				<Button className="w-full" color="primary" onClick={() => setGame((last) => !last)}>
					Create New Game
				</Button>
			</div>
			<Divider/>
			<Input
				size="sm"
				isClearable
				className="w-full"
				placeholder="Search by ID..."
				startContent={<MagnifyingGlassIcon className="w-4 h-4"/>}
			/>
			<Table aria-label="Games Table">
				<TableHeader>
					<TableColumn key="id">Tournament ID</TableColumn>
					<TableColumn key="state">Status</TableColumn>
					<TableColumn>Actions</TableColumn>
				</TableHeader>
				<TableBody items={rows}>
					{(item) => (
						<TableRow key={item.id}>
							<TableCell>{getKeyValue(item, "id")}</TableCell>
							<TableCell>
								<Chip className="capitalize" color="success" size="sm" variant="flat">{getKeyValue(item, "state")}</Chip>
							</TableCell>
							<TableCell>
								<TextButton>Join Tournament</TextButton>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</ModalContentsWrapper>
	)
}

const MainContent: React.FC<{loading: boolean, selected: keyof typeof modalData, setSelected: Dispatch<SetStateAction<"custom-games" | "matchmaking" | "tournament-modes">>, onClick?: () => void}> = ({ loading, selected, setSelected, onClick }) => {
	return (<>
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
			<ModalButton onClick={onClick}>{modalData[selected].button}</ModalButton>
		</ModalFooter>
	</>)
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */
const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, loading }) => {
	const [selected, setSelected] = useState(Object.keys(modalData)[0] as keyof typeof modalData);
	const [openSubModal, setOpenSubModal] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setOpenSubModal(false);
			setSelected(Object.keys(modalData)[0] as keyof typeof modalData);
		}
	}, [isOpen]);

	const onButtonClick = () => {
		setOpenSubModal(true);
	}

	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			backdrop="blur"
			onClose={onClose}
			placement="center"
			closeButton={
				<button>
					<XMarkIcon className="w-6 h-6"/>
				</button>
			}
		>
			<ModalContent>
				{/* Loading Spinner */}
				{loading && <div className=" absolute flex justify-center items-center h-full w-full">
					<Spinner size="lg"/>
				</div>}

				{/* Back Button */}
				{openSubModal && (<BackButton onClick={() => setOpenSubModal(false)}/>)}

				{/* Modal Contents */}
				{!openSubModal && (
					<MainContent loading={loading || false} selected={selected} setSelected={setSelected} onClick={onButtonClick}/>
				)}
				{openSubModal && selected == "tournament-modes" && <TournamentContent loading={loading}/>}
				{openSubModal && selected == "custom-games" && <CustomGamesContent loading={loading}/>}
			</ModalContent>
		</Modal>
	)
}

export default SelectionModal;
