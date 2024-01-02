// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {TournamentManager} from "../src/TournamentManager.sol";

contract TournamentManagerTest is Test {
    TournamentManager public tm;

    struct TestPlayerScore {
        address player;
        uint256 score;
    }

    function setUp() public {
        tm = new TournamentManager();
    }

    function testCreateTournament() public {
        uint256 duration_in_blocks = 10;
        uint256 tournament_id = tm.createTournament(duration_in_blocks);
        TournamentManager.Tournament memory tournament = tm.getTournament(tournament_id);
        assertEq(tournament.master, address(this));
        assertEq(tournament.duration_in_blocks, duration_in_blocks);
        assertEq(tournament.start_block, 0);
        assertEq(tournament.end_block, 0);
        assertEq(tournament.players.length, 0);
        assertEq(tournament.games.length, 0);
    }
}
