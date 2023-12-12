// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Scores is Ownable {
    mapping (uint256 => mapping (uint256 => uint256)) tournaments;
    mapping (uint256 => uint256[]) tournament_players;

    constructor(address owner) Ownable(owner) {}

    function addScore(uint256 tournament_id, uint256 player_id, uint256 score) external onlyOwner {
        tournaments[tournament_id][player_id] += score;

        uint256 player_amount = tournament_players[tournament_id].length;
        for (uint256 i = 0; i < player_amount; i++) {
            if (tournament_players[tournament_id][i] == player_id)
                return;
        }

        tournament_players[tournament_id].push(player_id);
    }

    function getScores(uint256 tournament_id) external view returns (uint256[] memory) {
        uint256 player_amount = tournament_players[tournament_id].length;
        uint256[] memory scoreboard = new uint256[](player_amount);

        for (uint256 i = 0; i < player_amount; i++) {
            uint256 player_id = tournament_players[tournament_id][i];
            scoreboard[i] = tournaments[tournament_id][player_id];
        }

        return scoreboard;
    }
}

