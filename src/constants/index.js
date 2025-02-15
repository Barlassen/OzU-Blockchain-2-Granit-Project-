export const CONTRACT_ADDRESS = "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47";

export const CONTRACT_ABI = [
	
    [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "ConstructionUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "NFTRegistered",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "PostConstructionUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "excavationAndFoundation",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "roughConstruction",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "roofConstruction",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "finishingWorks",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "doorWindowInsulation",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "securityAndCommonAreas",
                    "type": "bool"
                }
            ],
            "name": "registerHouseNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "excavationAndFoundation",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "roughConstruction",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "roofConstruction",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "finishingWorks",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "doorWindowInsulation",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "securityAndCommonAreas",
                    "type": "bool"
                }
            ],
            "name": "updateConstructionPhase",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "inspection",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "finalApproval",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "interiorWorksCompleted",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "exteriorWorksCompleted",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "legalPaperwork",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "finalHandover",
                    "type": "bool"
                }
            ],
            "name": "updatePostConstructionPhase",
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
            "name": "houses",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "internalType": "bool",
                            "name": "excavationAndFoundation",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "roughConstruction",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "roofConstruction",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "finishingWorks",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "doorWindowInsulation",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "securityAndCommonAreas",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "constructionCompleted",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct HouseNFTManager.BuildHouse",
                    "name": "build",
                    "type": "tuple"
                },
                {
                    "components": [
                        {
                            "internalType": "bool",
                            "name": "inspection",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "finalApproval",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "interiorWorksCompleted",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "exteriorWorksCompleted",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "legalPaperwork",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "finalHandover",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct HouseNFTManager.PostConstruction",
                    "name": "post",
                    "type": "tuple"
                },
                {
                    "internalType": "bool",
                    "name": "minted",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
]; 