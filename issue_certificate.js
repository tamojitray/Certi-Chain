let contract;
let web3;
let userAddress;

async function checkUserRole() {
    // Check if web3 is available
    if (typeof window.ethereum === 'undefined' || typeof window.web3 === 'undefined') {
        alert('Please install MetaMask to access this page.');
        window.location.replace('index.html');
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (!accounts || accounts.length === 0) {
            // No accounts found, prompt the user to log in
            alert('Please log in to your MetaMask account.');
            window.location.replace('index.html');
            return;
        }

        userAddress = accounts[0];

        // Use web3 to check the user's role
        web3 = new Web3(window.ethereum);

        // Replace 'YOUR_CONTRACT_ADDRESS' with your actual contract address
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
        const contractAddress = '0xf22ed0af6f2ef1ef920f51a9f6d8f25a85b138e1';
        
        
        contract = new web3.eth.Contract(contractABI, contractAddress);

        const userRole = await contract.methods.View_Roles().call({from: userAddress });
        
        const userName = await contract.methods.View_RoleFromAddress().call({from: userAddress }); 

        // Check if the user has the "Authority" role
        if (userRole === 'Authority') {
            // Display the page content
            $('#name').show();
            const nameElement = document.getElementById('name');
            nameElement.innerHTML = `Welcome ${userName}`;
            $('#buttons').show();            
        } else {
            // Redirect to login page
            alert("This page is for authority role only and your dont have authority role. Plsease check your address");
            window.location.replace('index.html');
        }

    } catch (error) {
        console.error(error);

        if (error.code === 4001) {
            // User rejected the request
            alert('You need to approve the MetaMask request to access this page.');
            window.location.replace('index.html');
        } else {
            // Other errors
            alert('Error accessing MetaMask account or checking user role. See the console for details.');
            window.location.replace('index.html');
        }
    }
}

async function submit() {
	const student_address = document.getElementById('address').value;
    const course = document.getElementById('course').value;
    const grade = document.getElementById('grade').value;
    const roll = document.getElementById('roll').value;
    const year = document.getElementById('year').value;
    await contract.methods.IssueCertificate(student_address, course, grade, roll, year)
    .send({ from: userAddress })
    .then(function(receipt){
        // The receipt object contains various information about the transaction
        console.log("Transaction receipt:", receipt);
    
        // Get the emitted event logs from the receipt
        const logs = receipt.events;
    
        // Assuming your event is emitted with the name 'CertificateIssued'
        const certificateId = logs.CertificateIssued.returnValues.certificateId;
        alert("Certificate ID: "+certificateId);
        window.location.replace('authority.html');
    })
    .catch(function(error){
        console.error("Error occurred:", error);
        location.reload();
    });
}

// Connect to MetaMask and check user role when the page loads
$(document).ready(() => {
    checkUserRole();
});

// Reload the page when MetaMask account changes
window.ethereum.on('accountsChanged', () => {
    location.reload();
});