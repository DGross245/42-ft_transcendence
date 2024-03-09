import { Chip, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, getKeyValue } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import TextButton from "./TextButton";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */
enum GameState {
	Running,
	Waiting,
	Finished
}
interface SearchableGamesTableProps {
	columns: {
		[key: string]: string,
	},
	rows?: {
		[key: string]: string | GameState;
	}[],
	highlightedRows?: {
		[key: string]: string | GameState;
	}[],
	onRowClick?: (row: any) => void,
	ariaLabel: string,
	onJoin?: (row: any) => void,
	tooltipEnabled?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const SearchableGamesTable: React.FC<SearchableGamesTableProps> = ({ columns, rows, highlightedRows, onRowClick, ariaLabel, onJoin, tooltipEnabled }) => {
	const [filteredRows, setFilteredRows] = useState(rows ?? []);
	const [search, setSearch] = useState("");
	const { t } = useTranslation("modals");

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

	return (<div className="flex flex-col gap-2">
		<Input
			size="sm"
			isClearable
			value={search}
			className="w-full"
			placeholder={t("searchtable.search")}
			onClear={() => setSearch("")}
			onChange={(e) => setSearch(e.target.value)}
			startContent={<MagnifyingGlassIcon className="w-4 h-4"/>}
		/>
		<Table
			layout="fixed"
			isStriped={!onRowClick}
			isHeaderSticky classNames={{
				base: "h-[250px] overflow-scroll",
				wrapper: "h-[250px]",
				td: clsx({"cursor-pointer": onRowClick})
			}}
			selectionMode={onRowClick ? "single" : "none"}
			selectionBehavior={undefined} aria-label={ariaLabel}
		>
			<TableHeader>
				{Object.entries(columns).map(([key, value]) => (
					<TableColumn key={key} align="center">{value}</TableColumn>
				)).concat(onJoin ? [
					<TableColumn key="actions" align="center">{t("searchtable.actions")}</TableColumn>
				] : [])}
			</TableHeader>
			<TableBody
				items={filteredRows}
				emptyContent={typeof rows !== 'undefined' ? t("searchtable.nothingfound") : " "}
				loadingContent={<Spinner label={t("searchtable.loading")}/>}
				isLoading={typeof rows === 'undefined'}
			>
				{(item) => {
					const classes = clsx({"before:!bg-green-100 before:!bg-opacity-25 before:opacity-100 group-aria-[selected=true]:before:!bg-opacity-50 group-aria-[selected=true]:before:!bg-green-100 data-[selected=true]:!text-default": highlightedRows?.includes(item)});
					return (
						<TableRow key={item.id} onClick={() => onRowClick && onRowClick(item)}>
							{Object.entries(columns).map(([key, value]) => {
								if (key == "state") {
									return (
										<TableCell key={key} className={classes}>
											{getKeyValue(item, key) == GameState.Running && <Chip className="capitalize" color="success" size="sm" variant="flat">{t("searchtable.running")}</Chip>}
											{getKeyValue(item, key) == GameState.Waiting && <Chip className="capitalize" color="warning" size="sm" variant="flat">{t("searchtable.waiting")}</Chip>}
											{getKeyValue(item, key) == GameState.Finished && <Chip className="capitalize" color="primary" size="sm" variant="flat">{t("searchtable.finished")}</Chip>}
										</TableCell>
									)
								} else {
									return (
										<TableCell key={key} className={classes}>
											<Tooltip showArrow={true} content={getKeyValue(item, key)} isDisabled={!tooltipEnabled}>
												<div className="overflow-hidden :">{getKeyValue(item, key)}</div>
											</Tooltip>
										</TableCell>
									)
								}
							}).concat(onJoin ? [
								<TableCell key="actions" className={classes}>
									<TextButton  onClick={() => {onJoin(item)}}>{t("searchtable.join")}</TextButton>
								</TableCell>
							] : [])}
						</TableRow>
					)
				}}
			</TableBody>
		</Table>
	</div>)
}
export default SearchableGamesTable;
export { GameState };
