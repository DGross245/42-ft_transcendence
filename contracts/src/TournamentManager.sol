// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// @todo add events
contract TournamentManager is Ownable {
	struct Player {
		address addr;
		string name;
		uint256 color;
		uint256 total_score;
	}
	mapping(address => Player) players;

	struct Tournament {
		uint256 start_block;
		uint256 end_block;
		Player[] players;
	}
	mapping (uint256 => Tournament) tournaments;
	uint256 next_tournament_id = 0;

	mapping (uint256 => mapping (address => uint256)) tournament_player_scores;

	constructor(address owner) Ownable(owner) {}

	function setNameAndColor(string memory name, uint256 color) external {
		require (bytes(name).length > 0, "Name must not be empty");
		require (color > 0, "Color must not be empty");
		require (color <= 0xFFFFFF, "Color must be a valid hex color");

		Player memory player = Player(msg.sender, name, color, 0);
		if (players[msg.sender].addr == address(0)) {
			players[msg.sender] = player;
		}
		else {
			players[msg.sender].name = name;
			players[msg.sender].color = color;
		}
	}

	function startTournament(uint256 duration_in_blocks) external {
		require (duration_in_blocks > 0, "Duration must be greater than 0");

		Tournament memory tournament;
		tournament.start_block = block.number;
		tournament.end_block = block.number + duration_in_blocks;
		tournaments[next_tournament_id] = tournament;
		next_tournament_id++;
	}

	function addScoreToTournament(uint256 tournament_id, address player_addr, uint256 score) external onlyOwner {
		require (tournament_id < next_tournament_id, "Tournament does not exist");
		require (block.number >= tournaments[tournament_id].start_block, "Tournament not started");
		require (block.number <= tournaments[tournament_id].end_block, "Tournament already ended");

		bool player_found = false;
		for (uint256 i = 0; i < tournaments[tournament_id].players.length; i++) {
			if (tournaments[tournament_id].players[i].addr == players[player_addr].addr) {
				player_found = true;
				return;
			}
		}
		if (!player_found)
			tournaments[tournament_id].players.push(players[player_addr]);
		tournament_player_scores[tournament_id][player_addr] += score;
		players[player_addr].total_score += score;
	}

	struct PlayerScore {
		address addr;
		string name;
		uint256 score;
	}

	function getScoresForTournament(uint256 tournament_id) external view returns (PlayerScore[] memory) {
		require (tournament_id < next_tournament_id, "Tournament does not exist");

		uint256 player_amount = tournaments[tournament_id].players.length;
		PlayerScore[] memory scoreboard = new PlayerScore[](player_amount);

		for (uint256 i = 0; i < player_amount; i++) {
			address player_addr = tournaments[tournament_id].players[i].addr;
			scoreboard[i].addr = player_addr;
			scoreboard[i].name = tournaments[tournament_id].players[i].name;
			scoreboard[i].score = tournament_player_scores[tournament_id][player_addr];
		}

		return scoreboard;
	}
}

