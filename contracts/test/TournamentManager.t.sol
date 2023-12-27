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
}
