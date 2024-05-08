let web3;
let isConnected = false;
let role;
let contract;    

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_certificateId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_addAddress",
				"type": "address"
			}
		],
		"name": "AddPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "certificateId",
				"type": "bytes32"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_studentAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_grade",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_roll",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_year",
				"type": "uint256"
			}
		],
		"name": "IssueCertificate",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_role",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "RegisterPage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "UserName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_collegeAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_studentAddress",
				"type": "address"
			}
		],
		"name": "View_AllCertificates",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "View_AllStudentAddress",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_certificateId",
				"type": "bytes32"
			}
		],
		"name": "View_CertificateDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
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
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_certificateId",
				"type": "bytes32"
			}
		],
		"name": "View_CertificateIssuer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_certificateId",
				"type": "bytes32"
			}
		],
		"name": "View_CertificateLegit",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "View_RoleFromAddress",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "View_Roles",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xf22ed0af6f2ef1ef920f51a9f6d8f25a85b138e1'; // Replace with your contract address

async function init() {
    // Connect to MetaMask
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        // Add event listener for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            const userAddress = accounts[0];
            console.log("Account changed:", userAddress);
			checkRole();
        });
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
            console.log("Connected account:", userAddress);
			checkRole();
        } 
        catch (error) {
            console.error(error);
        }
    } 
    else {
        console.error("MetaMask not detected!");
        alert("MetaMask not detected!");
        //window.location.replace('login.html');
    }
    // Load contract
    contract = new web3.eth.Contract(contractABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];    
    role = await contract.methods.View_Roles().call({from: userAddress }); 
	const statusElement = document.getElementById('status');
	const loginButton = document.getElementById('loginButton');
	const registerButton = document.getElementById('registerButton');
	if (isConnected) {		
		if(role === 'Student' || role === 'Authority') {
			loginButton.style.display = 'block';
			registerButton.style.display = 'none';
		}
		else {
			registerButton.style.display = 'block';
			loginButton.style.display = 'none';		
		}
	}
	else {
		statusElement.innerHTML = 'Not Connected';
		registerButton.style.display = 'none';
		loginButton.style.display = 'none';
	}	   
}

window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {		
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			checkRole();
            if (accounts.length > 0) {
                // MetaMask is connected
                isConnected = true;
                updateUI(accounts[0]);
            }
        } 
        catch (error) {
            console.error(error);
        }
    } 
    else {
        console.error('MetaMask not detected');
        alert("MetaMask not detected!");
    }
    window.ethereum.on('accountsChanged', (accounts) => {		
        if (accounts.length > 0) {
            isConnected = true;   
			checkRole();         
            updateUI(accounts[0]); 
        } else {
            isConnected = false;
			checkRole();
            updateUI('');
        }
    });
});

async function connectToMetamaskButton() {
    if (isConnected) {
        // Disconnect
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        isConnected = false;
        updateUI('');
    } else {
        // Connect
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = true;
            updateUI(accounts[0]);
        } catch (error) {
            console.error('User denied account access');    
        }
    }
}

async function checkRole() {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];    
    // Call the checkRole function
    role = await contract.methods.View_Roles().call({from: userAddress });    
	const statusElement = document.getElementById('status');
	const loginButton = document.getElementById('loginButton');
	const registerButton = document.getElementById('registerButton');
	if (isConnected) {		
		if(role === 'Student' || role === 'Authority') {
			loginButton.style.display = 'block';
			registerButton.style.display = 'none';
		}
		else {
			registerButton.style.display = 'block';
			loginButton.style.display = 'none';		
		}
	}
	else {
		statusElement.innerHTML = 'Not Connected';
		registerButton.style.display = 'none';
		loginButton.style.display = 'none';
	}  
}

function updateUI(address) {
    const statusElement = document.getElementById('status');
    const connectToMetamaskButton = document.getElementById('connectToMetamaskButton'); 
    if (isConnected) {
        statusElement.innerHTML = `Connected Address: ${address}`;
		statusElement.style.fontSize = "18pt";
        connectToMetamaskButton.style.display = 'none'; // Hide the connect button when connected  
    }
    else {
        statusElement.innerHTML = 'Not Connected';
        connectToMetamaskButton.style.display = 'block'; // Show the connect button when not connected
    }    
}

function updateUI2() {
    const statusElement = document.getElementById('status');
	const loginButton = document.getElementById('loginButton');
	const registerButton = document.getElementById('registerButton');
	if (isConnected) {		
		if(role === 'Student' || role === 'Authority') {
			loginButton.style.display = 'block';
			registerButton.style.display = 'none';
		}
		else {
			registerButton.style.display = 'block';
			loginButton.style.display = 'none';		
		}
	}
	else {
		statusElement.innerHTML = 'Not Connected';
		registerButton.style.display = 'none';
		loginButton.style.display = 'none';
	}  
}

async function loginButton() {
	checkRole();
	// Redirect based on the role
	if (role === "Student") {
		window.location.href = "student.html";
	} else if (role === "Authority") {
		window.location.href = "authority.html";
	} else {
		alert("You don't have a valid role. Please register first");
	}
}

async function registerButton() {
	window.location.href = "register.html";
}

window.onload = init;