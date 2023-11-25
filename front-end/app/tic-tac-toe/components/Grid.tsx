import Fields from "./Fields";

export const Grids = (props) => {
	const fields = [];

	for (let level = 0; level < 3; level++) {
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let x = 6 * i;
				let y = 6 * level;
				let z = 6 * j;

				let b=level;
				let n=b + 1;
				let m=n + 1;
			
				console.log(k,l,m);
				fields.push(
					<>
						<Fields
							rotation={[0, 0, Math.PI / 2]}
							clicked={props.clicked}
							click={props.click}
							turn={props.currentTurn}
							board={props.board}
							setCurrentBoardState={props.setCurrentBoardState}
							sceneCords={props.sceneCords}
							setSceneCords={props.setSceneCords}
							i={0}
							j={0}
							k={0}
						 />
					</>
				)
			}
		}
 	}
}
