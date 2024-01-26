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

    function testSetNameAndColor() public {
        string memory name = "test";
        uint256 color = 0xFFFFFF;
        tm.setNameAndColor(name, color);
        TournamentManager.Player memory player = tm.getPlayer(address(this));
        assertEq(player.addr, address(this));
        assertEq(player.name, name);
        assertEq(player.color, color);

        // update name and color
        string memory name2 = "test2";
        uint256 color2 = 0x0000FF;
        tm.setNameAndColor(name2, color2);
        player = tm.getPlayer(address(this));
        assertEq(player.addr, address(this));
        assertEq(player.name, name2);
    }

    function testJoinTournament() public {
        tm.setNameAndColor("test1", 0xFFFFFF);
        uint256 tournament_id = tm.createTournament(10);
        tm.joinTournament(tournament_id);
        TournamentManager.Tournament memory tournament = tm.getTournament(tournament_id);
        assertEq(tournament.players.length, 1);
        assertEq(tournament.players[0], address(this));
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

    function testStartTournament() public {
        tm.createTournament(10);
        tm.setNameAndColor("test1", 0xFFFFFF);
        tm.joinTournament(0);
        vm.startPrank(address(1));
        tm.setNameAndColor("test1", 0xFFFFFF);
        tm.joinTournament(0);
        vm.startPrank(address(2));
        tm.setNameAndColor("test1", 0xFFFFFF);
        tm.joinTournament(0);
        vm.startPrank(address(3));
        tm.setNameAndColor("test1", 0xFFFFFF);
        tm.joinTournament(0);
        vm.stopPrank();
        uint256 tournament_id = 0;
        tm.startTournament(tournament_id);
        TournamentManager.Tournament memory tournament = tm.getTournament(tournament_id);
        assertEq(tournament.start_block, block.number);
        assertEq(tournament.end_block, block.number + tournament.duration_in_blocks);
        assertEq(tournament.players.length, 4);
        assertEq(tournament.games.length, 6);
    }

    function testSubmitGameResultTournament() public {
        testStartTournament();
        uint256 tournament_id = 0;
        uint256 game_id = 0;
        TournamentManager.PlayerScore[] memory scores = new TournamentManager.PlayerScore[](2);
        scores[0] = TournamentManager.PlayerScore(address(this), 100);
        scores[1] = TournamentManager.PlayerScore(address(1), 200);
        tm.submitGameResultTournament(tournament_id, game_id, scores);
        TournamentManager.Tournament memory tournament = tm.getTournament(tournament_id);
        assertEq(tournament.games[0].finished, true);
        assertEq(tournament.games[0].player_scores[0].score, scores[0].score);
    }

    function testSubmitGameResultRanked() public {
        TournamentManager.PlayerScore[] memory scores = new TournamentManager.PlayerScore[](2);
        scores[0] = TournamentManager.PlayerScore(address(this), 100);
        scores[1] = TournamentManager.PlayerScore(address(1), 200);
        tm.submitGameResultRanked(scores);
        TournamentManager.Game[] memory games = tm.getRankedGames();
        assertEq(games.length, 1);
        assertEq(games[0].finished, true);
        assertEq(games[0].player_scores[0].score, scores[0].score);
    }

    function testGetTournaments() public {
        tm.createTournament(10);
        tm.createTournament(100);
        TournamentManager.Tournament[] memory tournaments = tm.getTournaments();
        assertEq(tournaments.length, 2);
    }

    function testGetTournamentTree() public {
        testStartTournament();
        uint256 tournament_id = 0;
        TournamentManager.Game[] memory tree = tm.getTournamentTree(tournament_id);
        assertEq(tree.length, 6);
    }

    function testGetPlayerRankedElo() public {
        TournamentManager.PlayerScore[] memory scores = new TournamentManager.PlayerScore[](2);
        scores[0] = TournamentManager.PlayerScore(address(this), 100);
        scores[1] = TournamentManager.PlayerScore(address(1), 200);
        tm.submitGameResultRanked(scores);
        uint256 elo = tm.getPlayerRankedElo(address(this));
        assertEq(elo, 1000);
    }
}
