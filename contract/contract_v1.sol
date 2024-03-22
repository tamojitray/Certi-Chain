// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract v1 {
    mapping (address => string) roles; //mapping each address to the roles selected.
    mapping (address => string) names; //mapping each address to their names.

    mapping (bytes32 => address) certificateID_college;
    mapping (bytes32 => address) certificateID_student;

    mapping (address => student) certificatesList;
    mapping (bytes32 => details) certificateDetails;

    mapping (bytes32 => permission) permissionChecker;

    struct permission {
        address[] allowedAddress;
    }

    struct certi {
        bytes32[] certificateID;
    }

    struct student {
        address[] studentAddress;
        mapping (address => certi) IDs;
    }

    struct details {
        string studentName;
        string collegeName;
        string roll;
        string course;
        string grade;
        uint256 year;
    }

    //function to assign role and name
    function RegisterPage(string memory _role, string memory _name) public {
        require( keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(names[msg.sender])) == keccak256(abi.encodePacked("")), "Role and Name already assigned");
        require( keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Student")) || keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Authority")), "Invalid role");
        roles[msg.sender] = _role;
        names[msg.sender] = _name;
    }

    function UserName (address _user) public view returns (string memory) {
        return (names[_user]);
    }

    //Returns the name of the address
    function View_RoleFromAddress() public view returns (string memory) {
        return (names[msg.sender]);
    }
    
    //Returns the role of the address
    function View_Roles () public view returns (string memory) {
        return (roles[msg.sender]);
    }

    event CertificateIssued(bytes32 indexed certificateId);

    function IssueCertificate (address _studentAddress, string memory _course, string memory _grade, string memory _roll, uint256 _year) public returns (bytes32) {
        require( keccak256(abi.encodePacked(roles[msg.sender])) != keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(names[msg.sender])) != keccak256(abi.encodePacked("")), "Role and Name not assigned");
        require( keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Authority")), "Not authorised for this action");
        require( keccak256(abi.encodePacked(names[_studentAddress])) != keccak256(abi.encodePacked("")), "Student not registered");
        bytes32 certificateId = keccak256(abi.encodePacked(_studentAddress, _course, _grade, _roll, _year));
        require( keccak256(abi.encodePacked(certificateID_college[certificateId])) == keccak256(abi.encodePacked(0x0000000000000000000000000000000000000000)), "Same Details already exists");
        certificateID_college[certificateId] = msg.sender;
        certificateID_student[certificateId] = _studentAddress;

        certificateDetails[certificateId].studentName = names[_studentAddress];
        certificateDetails[certificateId].collegeName = names[msg.sender];
        certificateDetails[certificateId].roll = _roll;
        certificateDetails[certificateId].course = _course;
        certificateDetails[certificateId].grade = _grade;
        certificateDetails[certificateId].year = _year;

        if((certificatesList[msg.sender].studentAddress).length == 0) {
            certificatesList[msg.sender].studentAddress.push(_studentAddress);
        }
        else {
            for (uint i=0; i<(certificatesList[msg.sender].studentAddress).length; i++)
            {
                if(certificatesList[msg.sender].studentAddress[i] != _studentAddress) {
                    certificatesList[msg.sender].studentAddress.push(_studentAddress);
                }
            }
        }       
        
        certificatesList[msg.sender].IDs[_studentAddress].certificateID.push(certificateId);

        permissionChecker[certificateId].allowedAddress.push(msg.sender);
        permissionChecker[certificateId].allowedAddress.push(_studentAddress);

        emit CertificateIssued(certificateId);
        
        return (certificateId);
    }

    function AddPermission (bytes32 _certificateId, address _addAddress) public {
        require( keccak256(abi.encodePacked(roles[msg.sender])) != keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(names[msg.sender])) != keccak256(abi.encodePacked("")), "Role and Name not assigned");
        require( keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Student")), "Not authorised for this action");
        require( keccak256(abi.encodePacked(certificateID_student[_certificateId])) == keccak256(abi.encodePacked(msg.sender)), "Certificate is invalid or this certificate is not yours");
        require( keccak256(abi.encodePacked(roles[_addAddress])) == keccak256(abi.encodePacked("Authority")), "Only Authority Can be added");

        for(uint i=0; i < (permissionChecker[_certificateId].allowedAddress).length; i++) {
            if (permissionChecker[_certificateId].allowedAddress[i] == _addAddress) {
                revert("Address already Exists");
            }
        }
        permissionChecker[_certificateId].allowedAddress.push(_addAddress);
    }

    function View_CertificateLegit (bytes32 _certificateId) public view returns (bool) {
        if (certificateID_college[_certificateId] != 0x0000000000000000000000000000000000000000 && certificateID_student[_certificateId] != 0x0000000000000000000000000000000000000000) {
            return (true);
        }
        else {
            return (false);
        }
    }

    function View_CertificateIssuer (bytes32 _certificateId) public view returns (address, address) {
        return (certificateID_college[_certificateId], certificateID_student[_certificateId]);
    }

    function View_CertificateDetails (bytes32 _certificateId) public view returns (string memory, string memory, string memory, string memory, string memory, uint256) {
        for(uint i=0; i < (permissionChecker[_certificateId].allowedAddress).length; i++) {
            if (permissionChecker[_certificateId].allowedAddress[i] == msg.sender) {
                return (
                    certificateDetails[_certificateId].studentName,
                    certificateDetails[_certificateId].collegeName,
                    certificateDetails[_certificateId].roll,
                    certificateDetails[_certificateId].course,                 
                    certificateDetails[_certificateId].grade,                
                    certificateDetails[_certificateId].year
                );
            }
        }
        revert("Certificate ID Not Valid");
    }

    function View_AllCertificates (address _collegeAddress, address _studentAddress) public view returns (bytes32[] memory) {
        return (
            certificatesList[_collegeAddress].IDs[_studentAddress].certificateID
        );
    }

    function View_AllStudentAddress () public view returns (address[] memory) {
        return (certificatesList[msg.sender].studentAddress);
    }
}