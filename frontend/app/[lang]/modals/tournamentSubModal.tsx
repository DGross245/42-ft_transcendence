import { Button, Chip, Input, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { TournamentData } from "./SelectionModal";

interface TournamentSubModalProps {
	data: TournamentData[];
	onCreateTournament: () => void;
	onJoinTournament: (tournamentID: number) => void;
}

export const TournamentSubModal : React.FC<TournamentSubModalProps> = ({ data, onCreateTournament, onJoinTournament}) => {
	return (
		<>
			<Input
				type="text"
				label="Tournament ID"
				variant="bordered"
				className="w-full"
				placeholder="Enter Tournament ID"
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
					{data.map((row) => (
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