// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// @todo add events
// @todo testing
// @todo deploy
contract TournamentManager {

	/* -------------------------------------------------------------------------- */
	/*                               Data Structure                               */
	/* -------------------------------------------------------------------------- */

	// player related
	struct Player {
		address addr;
		string name;
		uint256 color;
	}
	mapping(address => Player) public players;
	struct PlayerScore {
		address addr;
		uint256 score;
	}

	// tournament related
	struct Tournament {
		address master;
		uint256 duration_in_blocks;
		uint256 start_block;
		uint256 end_block;
		address[] players;
		Game[] games;
	}
	Tournament[] public tournaments;

	// game related
	struct Game {
		PlayerScore[] player_scores;
		bool finished;
	}
	Game[] public ranked_games;

	/* -------------------------------------------------------------------------- */
	/*                                  Modifiers                                 */
	/* -------------------------------------------------------------------------- */

	modifier checkTournamentValid(uint256 tournament_id) {
		require (tournament_id < tournaments.length && tournament_id >= 0, "Tournament does not exist");
		_; // represents the body of the function
	}

	modifier checkTournamentOngoing(uint256 tournament_id) {
		require (block.number >= tournaments[tournament_id].start_block
		&& block.number < tournaments[tournament_id].end_block, "Tournament not ongoing");
		_;
	}

	/* -------------------------------------------------------------------------- */
	/*                                  Internal                                  */
	/* -------------------------------------------------------------------------- */

	// @todo randomize game order
	function createTournamentTree(uint256 tournament_id)
	internal checkTournamentValid(tournament_id) {
		uint256 num_players = tournaments[tournament_id].players.length;
		// uint256 num_games = num_players * (num_players - 1) / 2;

		for (uint256 i = 0; i < num_players; i++) {
			for (uint256 j = i + 1; j < num_players; j++) {
				PlayerScore[] memory player_scores = new PlayerScore[](2);
				player_scores[0] = PlayerScore({
					addr: tournaments[tournament_id].players[i],
					score: 0
				});
				player_scores[1] = PlayerScore({
					addr: tournaments[tournament_id].players[j],
					score: 0
				});
				tournaments[tournament_id].games.push(Game({
					player_scores: player_scores,
					finished: false
				}));
			}
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                              Player Functions                              */
	/* -------------------------------------------------------------------------- */

	function setNameAndColor(string memory name, uint256 color)
	external {
		require (bytes(name).length > 0, "Name must not be empty");
		require (color > 0, "Color must not be empty");
		require (color <= 0xFFFFFF, "Color must be a valid hex color");

		if (players[msg.sender].addr == address(0)) {
			players[msg.sender].addr = msg.sender;
			players[msg.sender].name = name;
			players[msg.sender].color = color;
		}
		else {
			players[msg.sender].name = name;
			players[msg.sender].color = color;
		}
	}

	function joinTournament(uint256 tournament_id)
	external checkTournamentValid(tournament_id) checkTournamentOngoing(tournament_id) {
		for (uint256 i = 0; i < tournaments[tournament_id].players.length; i++) {
			if (tournaments[tournament_id].players[i] == players[msg.sender].addr) {
				revert("Player already joined tournament");
			}
		}
		tournaments[tournament_id].players.push(players[msg.sender].addr);
	}

	/* -------------------------------------------------------------------------- */
	/*                            Tournament Functions                            */
	/* -------------------------------------------------------------------------- */

	function createTournament(uint256 duration_in_blocks) external {
		require (duration_in_blocks > 0, "Duration must be greater than 0");

		tournaments.push(Tournament({
			master: msg.sender,
			duration_in_blocks: duration_in_blocks,
			start_block: 0,
			end_block: 0,
			players: new address[](0),
			games: new Game[](0)
		}));
	}

	function startTournament(uint256 tournament_id)
	external checkTournamentValid(tournament_id) {
		require (tournaments[tournament_id].master == msg.sender, "Only master can start tournament");

		createTournamentTree(tournament_id);
		tournaments[tournament_id].start_block = block.number;
		tournaments[tournament_id].end_block = block.number + tournaments[tournament_id].duration_in_blocks;
	}

	function submitGameResultTournament(uint256 tournament_id, uint256 game_id, PlayerScore[] calldata player_scores)
	external checkTournamentValid(tournament_id) checkTournamentOngoing(tournament_id) {
		require (tournaments[tournament_id].games[game_id].finished == false, "Game already finished");
		require (game_id < tournaments[tournament_id].games.length, "Game does not exist");
		require (player_scores.length == 2, "Invalid number of players");

		for (uint256 i = 0; i < player_scores.length; i++) {
			bool player_found = false;
			for (uint256 j = 0; j < tournaments[tournament_id].games[game_id].player_scores.length; j++) {
				if (tournaments[tournament_id].games[game_id].player_scores[j].addr == player_scores[i].addr) {
					player_found = true;
					tournaments[tournament_id].games[game_id].player_scores[j].score == player_scores[i].score;
				}
			}
			require (player_found, "Player not in tournament");
		}
		tournaments[tournament_id].games[game_id].finished = true;
	}

	/* -------------------------------------------------------------------------- */
	/*                              Ranked Functions                              */
	/* -------------------------------------------------------------------------- */

	function submitGameResultRanked(uint256 game_id, PlayerScore[] calldata player_scores)
	external {
		require (ranked_games[game_id].finished == false, "Game already finished");
		require (game_id < ranked_games.length, "Game does not exist");
		require (player_scores.length == ranked_games[game_id].player_scores.length, "Invalid number of players");

		for (uint256 i = 0; i < player_scores.length; i++) {
			bool player_found = false;
			for (uint256 j = 0; j < ranked_games[game_id].player_scores.length; j++) {
				if (ranked_games[game_id].player_scores[j].addr == player_scores[i].addr) {
					player_found = true;
					ranked_games[game_id].player_scores[j].score == player_scores[i].score;
				}
			}
			require (player_found, "Player not in tournament");
		}
		ranked_games[game_id].finished = true;
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Getter                                   */
	/* -------------------------------------------------------------------------- */

	function getTournaments()
	external view
	returns (Tournament[] memory) {
		return tournaments;
	}

	function getTournamentTree(uint256 tournament_id)
	external view checkTournamentValid(tournament_id)
	returns (Game[] memory) {
		return tournaments[tournament_id].games;
	}

	function getPlayer(address addr)
	external view returns (Player memory) {
		require (players[addr].addr != address(0), "Player does not exist");

		return players[addr];
	}

	function getRankedGames()
	external view returns (Game[] memory) {
		return ranked_games;
	}
}