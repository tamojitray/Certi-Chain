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

        const userAddress = accounts[0];

        // Use web3 to check the user's role
        const web3 = new Web3(window.ethereum);

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
        
        
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const userRole = await contract.methods.View_Roles().call({from: userAddress });
        
        const userName = await contract.methods.View_RoleFromAddress().call({from: userAddress }); 

        // Check if the user has the "Student" role
        if (userRole === 'Student') {
            // Display the page content
            $('#name').show();
            const nameElement = document.getElementById('name');
            nameElement.innerHTML = `Welcome ${userName}`;
            nameElement.style.fontSize = "25pt";
            nameElement.style.color= "#370e7d";
            nameElement.style.fontWeight= "bold";
            nameElement.style.textAlign="Center";
            
           

            $('#buttons').show();            
        } else {
            // Redirect to login page
            alert("This page is for student role only and your dont have student role. Plsease check your address");
            window.location.replace('index.html');
        }

    } 
    catch (error) {
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

async function viewCerti() {
	window.location.href = "view_certificate_s.html";
}

async function approveCerti() {
	window.location.href = "approve_certificate.html";
}


// Connect to MetaMask and check user role when the page loads
$(document).ready(() => {
    checkUserRole();
});

// Reload the page when MetaMask account changes
window.ethereum.on('accountsChanged', () => {
    location.reload();
});