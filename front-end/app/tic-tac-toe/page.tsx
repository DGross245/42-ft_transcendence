import { title } from "@/components/primitives";
import TTTScene from "./TicTacToeScene";

export default function BlogPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<h1 className={title()}>Tic Tac Toe</h1>
					<TTTScene />
			</div>
		</div>
	);
}

