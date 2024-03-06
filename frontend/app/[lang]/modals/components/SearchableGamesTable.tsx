import { Chip, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import TextButton from "./TextButton";

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */
enum GameState {
	Running,
	Waiting
}
interface SearchableGamesTableProps {
	columns: {
		[key: string]: string,
	},
	rows?: {
		[key: string]: string | GameState;
	}[],
	loading?: boolean,
	onRowClick?: (row: any) => void,
	ariaLabel: string,
	onJoin?: (row: any) => void
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const SearchableGamesTable: React.FC<SearchableGamesTableProps> = ({ columns, rows, loading, onRowClick, ariaLabel, onJoin }) => {
	const [filteredRows, setFilteredRows] = useState(rows ?? []);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (search == "") {
			setFilteredRows(rows ?? []);
		} else {
			setFilteredRows((rows ?? [])?.filter((row) => {
				return Object.values(row).some((value) => {
					if (typeof value == "string") {
						return value.toString().toLowerCase().replace(/ /g, "").includes(search.toLowerCase().replace(/ /g, ""));
					} else {
						return false;
					}
				})
			}));
		}
	}, [search, rows]);

	return (<>
		<Input
			size="sm"
			isClearable
			value={search}
			className="w-full"
			placeholder="Search..."
			onClear={() => setSearch("")}
			onChange={(e) => setSearch(e.target.value)}
			startContent={<MagnifyingGlassIcon className="w-4 h-4"/>}
		/>
		<Table
			layout="fixed"
			isStriped={!onRowClick}
			isHeaderSticky classNames={{
				base: "h-[250px] overflow-scroll",
				wrapper: "h-[250px]"
			}}
			selectionMode={onRowClick ? "single" : "none"}
			selectionBehavior={undefined} aria-label={ariaLabel}
		>
			<TableHeader>
				{Object.entries(columns).map(([key, value]) => (
					<TableColumn key={key}>{value}</TableColumn>
				)).concat(onJoin ? [
					<TableColumn key="actions">Actions</TableColumn>
				] : [])}
			</TableHeader>
			<TableBody
				items={filteredRows}
				emptyContent={typeof rows !== 'undefined' ? "Nothing Found 🔎" : " "}
				loadingContent={<Spinner label="Loading..."/>}
				isLoading={typeof rows === 'undefined'}
			>
				{(item) => (
					<TableRow key={item.id} onClick={() => onRowClick && onRowClick(item)}>
						{Object.entries(columns).map(([key, value]) => {
							if (key == "state") {
								return (
									<TableCell key={key}>
										{getKeyValue(item, key) == GameState.Running && <Chip className="capitalize" color="success" size="sm" variant="flat">Running</Chip>}
										{getKeyValue(item, key) == GameState.Waiting && <Chip className="capitalize" color="warning" size="sm" variant="flat">Waiting...</Chip>}
									</TableCell>
								)
							} else {
								return (<TableCell key={key}>{getKeyValue(item, key)}</TableCell>)
							}
						}).concat(onJoin ? [
							<TableCell key="actions">
								<TextButton>Join</TextButton>
							</TableCell>
						] : [])}
					</TableRow>
				)}
			</TableBody>
		</Table>
	</>)
}
export default SearchableGamesTable;
export { GameState };
