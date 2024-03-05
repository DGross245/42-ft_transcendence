import { Button, Chip, Input, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { TournamentData } from "./SelectionModal";
import { useState } from "react";

interface TournamentSubModalProps {
	data: TournamentData[];
	onCreateTournament: () => void;
	onJoinTournament: (tournamentID: number) => void;
}

export const TournamentSubModal : React.FC<TournamentSubModalProps> = ({ data, onCreateTournament, onJoinTournament}) => {
	const [input, setInput] = useState<number | ''>(''); 

	const filteredData = input === '' ? data : data.filter((row) => 
		row.tournamentID === input
	);

	return (
		<>
			<Input
				type="number"
				label="Tournament ID"
				variant="bordered"
				className="w-full"
				placeholder="Enter Tournament ID"
				value={input !== '' ? String(input) : ''}
				onChange={(e) => setInput(e.target.value !== '' ? Number(e.target.value) : '')}
			/>
			<Button onClick={() => onCreateTournament()}>Create New Tournament</Button>
			<Table aria-label="Tournaments Table">
				<TableHeader>
					<TableColumn>Tournament ID</TableColumn>
					<TableColumn>Number of Players</TableColumn>
					<TableColumn>Status</TableColumn>
					<TableColumn>Actions</TableColumn>
				</TableHeader>
				<TableBody>
					{filteredData.map((row) => (
						<TableRow key={row.tournamentID}>
							<TableCell>{row.tournamentID}</TableCell>
							<TableCell> {row.connected} / {row.numberOfPlayers} </TableCell>
							<TableCell>
								<Chip className="capitalize" color={row.isStarted ? "success" : "warning"} size="sm" variant="flat">
									{row.isStarted ? "Running" : "Waiting..."}
								</Chip>
							</TableCell>
							<TableCell>
								<Link isDisabled={row.isStarted} onClick={() => onJoinTournament(row.tournamentID)}>Join Tournament</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	)
}