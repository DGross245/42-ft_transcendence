const { ethers } = require('ethers');

// Define your contract address and ABI
const contractAddress = '0x85a8454Ed9255C9Fd22f9741AA5bCc9532c556D2'; // Replace with your contract address
const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "duration_in_blocks",
        "type": "uint256"
      }
    ],
    "name": "createTournament",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getPlayer",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "color",
            "type": "uint256"
          }
        ],
        "internalType": "struct TournamentManager.Player",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getPlayerRankedElo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRankedGames",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "addr",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "score",
                "type": "uint256"
              }
            ],
            "internalType": "struct TournamentManager.PlayerScore[]",
            "name": "player_scores",
            "type": "tuple[]"
          },
          {
            "internalType": "bool",
            "name": "finished",
            "type": "bool"
          }
        ],
        "internalType": "struct TournamentManager.Game[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tournament_id",
        "type": "uint256"
      }
    ],
    "name": "getTournament",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "master",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "duration_in_blocks",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start_block",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "end_block",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "players",
            "type": "address[]"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "addr",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "score",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct TournamentManager.PlayerScore[]",
                "name": "player_scores",
                "type": "tuple[]"
              },
              {
                "internalType": "bool",
                "name": "finished",
                "type": "bool"
              }
            ],
            "internalType": "struct TournamentManager.Game[]",
            "name": "games",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct TournamentManager.Tournament",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tournament_id",
        "type": "uint256"
      }
    ],
    "name": "getTournamentTree",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "addr",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "score",
                "type": "uint256"
              }
            ],
            "internalType": "struct TournamentManager.PlayerScore[]",
            "name": "player_scores",
            "type": "tuple[]"
          },
          {
            "internalType": "bool",
            "name": "finished",
            "type": "bool"
          }
        ],
        "internalType": "struct TournamentManager.Game[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTournaments",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "master",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "duration_in_blocks",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start_block",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "end_block",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "players",
            "type": "address[]"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "addr",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "score",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct TournamentManager.PlayerScore[]",
                "name": "player_scores",
                "type": "tuple[]"
              },
              {
                "internalType": "bool",
                "name": "finished",
                "type": "bool"
              }
            ],
            "internalType": "struct TournamentManager.Game[]",
            "name": "games",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct TournamentManager.Tournament[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tournament_id",
        "type": "uint256"
      }
    ],
    "name": "joinTournament",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "color",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ranked_games",
    "outputs": [
      {
        "internalType": "bool",
        "name": "finished",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "color",
        "type": "uint256"
      }
    ],
    "name": "setNameAndColor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tournament_id",
        "type": "uint256"
      }
    ],
    "name": "startTournament",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "score",
            "type": "uint256"
          }
        ],
        "internalType": "struct TournamentManager.PlayerScore[]",
        "name": "player_scores",
        "type": "tuple[]"
      }
    ],
    "name": "submitGameResultRanked",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tournament_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "score",
            "type": "uint256"
          }
        ],
        "internalType": "struct TournamentManager.PlayerScore[]",
        "name": "player_scores",
        "type": "tuple[]"
      }
    ],
    "name": "submitGameResultTournament",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tournaments",
    "outputs": [
      {
        "internalType": "address",
        "name": "master",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "duration_in_blocks",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "start_block",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end_block",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Define your provider for the Goerli test network
// const providerUrl = 'https://eth-goerli.public.blastapi.io';
const providerUrl = 'https://sepolia.base.org';
const provider = new ethers.JsonRpcProvider(providerUrl);

// Define your wallet with private key (for sending transactions)
const privateKey = '4388cf1e59726bc1f0f66b1f452ce14ac425ef169262c72c3ac75a4c103b17b6';
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

// Define the function you want to call and its parameters
const createTournament = 'createTournament'
const createTournamentParams = [100]; // Replace with actual parameters

const joinTournament = 'joinTournament';
const joinTournamentParams = [0]; // Replace with actual parameters

const getPlayer = 'getPlayer';
const getPlayerParams = ['0x80A9eC86DCD58F657CD3f4b43C9CdaF76D65386D']; // Replace with actual parameters

const setNameAndColor = 'setNameAndColor';
const setNameAndColorParams = ['testPlayer', 1]; // Replace with actual parameters

const getTournamentTree = 'getTournamentTree';
const getTournamentTreeParams = [0]; // Replace with actual parameters

// Call the function and handle the result
async function callContractFunction() {
  try {
    // Make the contract call
    // const tx = await contract[createTournament](...createTournamentParams);
    // const tx = await contract[joinTournament](...joinTournamentParams);
    // const tx = await contract[getPlayer](...getPlayerParams);
    // const tx = await contract[setNameAndColor](...setNameAndColorParams);
    const tx = await contract[getTournamentTree](...getTournamentTreeParams);
    for (let i = 0; i < tx.length; i++) {
      console.log('game ', i, ' players: ', tx[i][0][0][0], ' ', tx[i][0][1][0])
    }

    // Process the result
    console.log('Result:', tx);
  } catch (error) {
    console.error('Error:', error);
  }
}
// Execute the function
callContractFunction();
