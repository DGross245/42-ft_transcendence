import { Button, Card, CardBody, Chip, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Switch, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@nextui-org/react";
import styles from "./Modals.module.css";
import ModalButton from "./ModalButton";
import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import pongGameImage from "@/assets/pongGame.png";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface SelectionModalProps {
	isOpen: boolean,
	onClose: () => void,
	loading?: boolean
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

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, loading }) => {
	const [tournamentMode, setTournamentMode] = useState(false);
	const [selected, setSelected] = useState("singleplayer");

	useEffect(() => {
		if (!isOpen) {
			setTournamentMode(false);
			setSelected("singleplayer");
		}
	}, [isOpen]);

	const onButtonClick = () => {
		if (selected == "tournament-modes") {
			setTournamentMode(true);
		}
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
						<Switch size="md" className="p-3" isDisabled={selected !== "singleplayer"}>
							Enable Bot Mode
						</Switch>
					</>)}
					{tournamentMode && (<>
						<Input
							type="text"
							label="Tournament ID"
							variant="bordered"
							className="w-full"
							placeholder="Enter Tournament ID"
						/>
						<Button>Create New Tournament</Button>
						<Table aria-label="Tournaments Table">
							<TableHeader>
								<TableColumn>Tournament ID</TableColumn>
								<TableColumn>Number of Players</TableColumn>
								<TableColumn>Status</TableColumn>
								<TableColumn>Actions</TableColumn>
							</TableHeader>
							<TableBody>
								<TableRow key="1">
									<TableCell>1</TableCell>
									<TableCell>1 / 10</TableCell>
									<TableCell>
										<Chip className="capitalize" color="success" size="sm" variant="flat">
											Running
										</Chip>
									</TableCell>
									<TableCell>
										<Link>Join Tournament</Link>
									</TableCell>
								</TableRow>
								<TableRow key="2">
									<TableCell>2</TableCell>
									<TableCell>1 / 10</TableCell>
									<TableCell>
										<Chip className="capitalize" color="success" size="sm" variant="flat">
											Running
										</Chip>
									</TableCell>
									<TableCell>
										<Link>Join Tournament</Link>
									</TableCell>
								</TableRow>
								<TableRow key="3">
									<TableCell>3</TableCell>
									<TableCell>1 / 10</TableCell>
									<TableCell>
										<Chip className="capitalize" color="warning" size="sm" variant="flat">
											Waiting...
										</Chip>
									</TableCell>
									<TableCell>
										<Link>Join Tournament</Link>
									</TableCell>
								</TableRow>
								<TableRow key="4">
									<TableCell>4</TableCell>
									<TableCell>1 / 10</TableCell>
									<TableCell>
										<Chip className="capitalize" color="success" size="sm" variant="flat">
											Running
										</Chip>
									</TableCell>
									<TableCell>
										<Link>Join Tournament</Link>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</>)}
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					{!tournamentMode && (<ModalButton onClick={onButtonClick}>{selected != "tournament-modes" ? "Create/Join Game 🎮" : "Play Tournament 🚀"}</ModalButton>)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default SelectionModal;
