// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// @todo add events
// @todo add elo score function for matchmaking
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

	// helper data to evade memory to storage assignment errors
	Game[] _games;
	PlayerScore[] _player_scores;
	Game _game;
	PlayerScore _player_score;
	Tournament _tournament;

	event TournamentCreated(uint256 tournament_id);
	event GameResultSubmitted(bool success);

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

		for (uint256 i = 0; i < num_players; i++) {
			for (uint256 j = i + 1; j < num_players; j++) {
				Game storage newGame = tournaments[tournament_id].games.push();

				newGame.player_scores.push(PlayerScore({
					addr: tournaments[tournament_id].players[i],
					score: 0
				}));
				newGame.player_scores.push(PlayerScore({
					addr: tournaments[tournament_id].players[j],
					score: 0
				}));

				newGame.finished = false;
			}
		}
	}

	// function createTournamentTree(uint256 tournament_id)
	// internal checkTournamentValid(tournament_id) {
	// 	uint256 num_players = tournaments[tournament_id].players.length;
	// 	// uint256 num_games = num_players * (num_players - 1) / 2;

	// 	Game[] storage games = _games;
	// 	for (uint256 i = 0; i < num_players; i++) {
	// 		for (uint256 j = i + 1; j < num_players; j++) {
	// 			PlayerScore[] storage player_scores = _player_scores;
	// 			PlayerScore storage first_player_score = _player_score;
	// 			first_player_score.addr = tournaments[tournament_id].players[i];
	// 			first_player_score.score = 0;
	// 			player_scores.push(first_player_score);
	// 			PlayerScore storage second_player_score = _player_score;
	// 			second_player_score.addr = tournaments[tournament_id].players[j];
	// 			second_player_score.score = 0;
	// 			player_scores.push(second_player_score);
	// 			Game storage game = _game;
	// 			game.player_scores = player_scores;
	// 			game.finished = false;
	// 			games.push(game);
	// 		}
	// 	}
	// 	tournaments[tournament_id].games = games;
	// }


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
	external checkTournamentValid(tournament_id) {
		require (players[msg.sender].addr != address(0), "Player does not exist");
		require (tournaments[tournament_id].start_block == 0, "Tournament already started");

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

	function createTournament(uint256 duration_in_blocks)
	external
	returns (uint256) {
		require (duration_in_blocks > 0, "Duration must be greater than 0");

		Tournament storage tournament = _tournament;
		tournament.master = msg.sender;
		tournament.duration_in_blocks = duration_in_blocks;
		tournaments.push(tournament);

		emit TournamentCreated(tournaments.length - 1);
		return tournaments.length - 1;
	}

	function startTournament(uint256 tournament_id)
	external checkTournamentValid(tournament_id) {
		require (tournaments[tournament_id].master == msg.sender, "Only master can start tournament");
		require (tournaments[tournament_id].players.length > 1, "Not enough players");
		require (tournaments[tournament_id].start_block == 0, "Tournament already started");

		createTournamentTree(tournament_id);
		tournaments[tournament_id].start_block = block.number;
		tournaments[tournament_id].end_block = block.number + tournaments[tournament_id].duration_in_blocks;
	}

	// function submitGameResultTournament(uint256 tournament_id, uint256 game_id, PlayerScore[] calldata player_scores)
	// external checkTournamentValid(tournament_id) checkTournamentOngoing(tournament_id) {
	// 	require(game_id < tournaments[tournament_id].games.length, "Game does not exist");
	// 	require(tournaments[tournament_id].games[game_id].finished == false, "Game already finished");
	// 	require(player_scores.length == 2, "Invalid number of players");

	// 	address player1 = tournaments[tournament_id].games[game_id].player_scores[0].addr;
	// 	address player2 = tournaments[tournament_id].games[game_id].player_scores[1].addr;

	// 	bool player1Found = (player_scores[0].addr == player1 || player_scores[1].addr == player1);
	// 	bool player2Found = (player_scores[0].addr == player2 || player_scores[1].addr == player2);

	// 	require(player1Found && player2Found, "Player not in game");

	// 	if (player_scores[0].addr == player1) {
	// 		tournaments[tournament_id].games[game_id].player_scores[0].score = player_scores[0].score;
	// 		tournaments[tournament_id].games[game_id].player_scores[1].score = player_scores[1].score;
	// 	} else {
	// 		tournaments[tournament_id].games[game_id].player_scores[0].score = player_scores[1].score;
	// 		tournaments[tournament_id].games[game_id].player_scores[1].score = player_scores[0].score;
	// 	}

	// 	tournaments[tournament_id].games[game_id].finished = true;
	// }


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
					tournaments[tournament_id].games[game_id].player_scores[j].score = player_scores[i].score;
				}
			}
			require (player_found, "Player not in game");
		}
		tournaments[tournament_id].games[game_id].finished = true;

		emit GameResultSubmitted(true);
	}

	/* -------------------------------------------------------------------------- */
	/*                              Ranked Functions                              */
	/* -------------------------------------------------------------------------- */

	function submitGameResultRanked(PlayerScore[] calldata player_scores)
	external {
		Game storage game = _game;
		PlayerScore[] storage scores = _player_scores;
		for (uint256 i = 0; i < player_scores.length; i++) {
			PlayerScore storage score = _player_score;
			score.addr = player_scores[i].addr;
			score.score = player_scores[i].score;
			scores.push(score);
		}
		game.player_scores = scores;
		game.finished = true;
		ranked_games.push(game);

		emit GameResultSubmitted(true);
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Getter                                   */
	/* -------------------------------------------------------------------------- */

	function getTournament(uint256 tournament_id)
	external view checkTournamentValid(tournament_id)
	returns (Tournament memory) {
		return tournaments[tournament_id];
	}

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
	external view
	returns (Player memory) {
		require (players[addr].addr != address(0), "Player does not exist");

		return players[addr];
	}

	function getRankedGames()
	external view
	returns (Game[] memory) {
		return ranked_games;
	}

	function getPlayerRankedElo(address addr)
	external view
	returns (uint256) {
		require (players[addr].addr != address(0), "Player does not exist");

		uint256 total_score = 0;
		uint256 played_games = 0;
		for (uint256 i = 0; i < ranked_games.length; i++) {
			for (uint256 j = 0; j < ranked_games[i].player_scores.length; j++) {
				if (ranked_games[i].player_scores[j].addr == addr) {
					total_score += ranked_games[i].player_scores[j].score;
					played_games++;
				}
			}
		}
		return total_score / played_games;
	}
}