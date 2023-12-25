// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Scores} from "../src/Scores.sol";

contract ScoresTest is Test {
    Scores public scores;

    function setUp() public {
        scores = new Scores(address(this));
    }

    function test_addScore() public {
        scores.addScore(0, 0, 42);
        assertEq(scores.getScores(0)[0], 42);
    }
}
