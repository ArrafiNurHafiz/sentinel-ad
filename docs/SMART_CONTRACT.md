# Smart Contract Specification — `TacticalEvidenceRegistry.sol`
### Military-Grade Digital Chain-of-Custody & Autonomous C2 Alert Engine

> **Network:** Polygon Amoy Testnet (Chain ID: 80002) & Private Military EVM Ready  
> **Compiler:** Solidity `^0.8.20`  
> **Security Standards:** Role-Based Access Control (RBAC), Reentrancy Defense, Custom Errors  
> **Standard Compliance:** ISO/IEC 27037 (Digital Evidence Preservation & Integrity)  

---

## 1. Architectural Mission

Smart contract `TacticalEvidenceRegistry` dirancang sebagai **Buku Besar Barang Bukti Digital Forensik Militer (*Digital Chain of Custody*)** dengan prinsip:
1. **Append-Only & Anti-Tamper:** Rekaman bukti yang telah terkunci konsensus tidak dapat diubah, dihapus, atau diintervensi oleh administrator database server (*insider threat proof*).
2. **Strict Military Role-Based Access Control (RBAC):** Hanya alamat perwira terverifikasi (`OFFICER_ROLE`) yang diberi wewenang mencatatkan bukti forensik.
3. **Peringatan Taktis Otonom (Autonomous C2 Alert):** Secara otomatis memancarkan *event* `TacticalC2Alert` bila skor keyakinan manipulasi $\ge 80\%$, yang memicu pembaruan status pada antarmuka peta Komando Operasi.

---

## 2. Source Code Kontrak Produksi

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TacticalEvidenceRegistry
 * @author SENTINEL-AD Military Engineering Team
 * @notice Enterprise-grade Immutable Forensic Evidence Ledger and Autonomous C2 Alert Protocol.
 *         Compliant with ISO/IEC 27037 standards for digital chain of custody.
 */
contract TacticalEvidenceRegistry {
    // Custom Gas-Efficient Errors
    error UnauthorizedCaller(address caller, bytes32 requiredRole);
    error InvalidMediaHash();
    error EmptyIpfsCID();
    error EvidenceAlreadyRegistered(bytes32 mediaHash);
    error EvidenceNotFound(bytes32 mediaHash);
    error InvalidConfidenceScore(uint16 score);
    error ContractIsPaused();

    // Roles (Role-Based Access Control)
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OFFICER_ROLE = keccak256("OFFICER_ROLE");

    mapping(bytes32 => mapping(address => bool)) private _roles;

    bool public paused;
    address public immutable deploymentAuthority;

    struct EvidenceRecord {
        bytes32 mediaHash;          // SHA-256 hash dari file sumber asli
        string ipfsCID;             // Content Identifier laporan forensik di IPFS
        uint16 confidenceScore;     // Nilai keyakinan skala 0 - 10000 (contoh: 9740 = 97.4%)
        bool isDeepfake;            // Hasil klasifikasi: true = Manipulasi/Deepfake, false = Asli
        address registeredBy;       // Kunci publik perwira analis yang menandatangani
        uint64 timestamp;           // Unix timestamp pencatatan blok
        string threatRegion;        // Kode wilayah Komando Daerah Militer (contoh: "KODAM_JAYA")
    }

    mapping(bytes32 => EvidenceRecord) private _records;
    bytes32[] private _allEvidenceHashes;

    event EvidenceLocked(
        bytes32 indexed mediaHash,
        address indexed officer,
        bool isDeepfake,
        uint16 confidenceScore,
        string ipfsCID,
        string threatRegion,
        uint64 timestamp
    );

    event TacticalC2Alert(
        bytes32 indexed mediaHash,
        string threatRegion,
        uint16 confidenceScore,
        uint64 timestamp
    );

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event PauseStateChanged(bool isPaused, address indexed admin);

    modifier onlyRole(bytes32 role) {
        if (!_roles[role][msg.sender] && msg.sender != deploymentAuthority) {
            revert UnauthorizedCaller(msg.sender, role);
        }
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert ContractIsPaused();
        _;
    }

    constructor() {
        deploymentAuthority = msg.sender;
        _roles[ADMIN_ROLE][msg.sender] = true;
        _roles[OFFICER_ROLE][msg.sender] = true;

        emit RoleGranted(ADMIN_ROLE, msg.sender, msg.sender);
        emit RoleGranted(OFFICER_ROLE, msg.sender, msg.sender);
    }

    function grantRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        _roles[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        _roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }

    function hasRole(bytes32 role, address account) external view returns (bool) {
        if (account == deploymentAuthority) return true;
        return _roles[role][account];
    }

    function setPaused(bool _paused) external onlyRole(ADMIN_ROLE) {
        paused = _paused;
        emit PauseStateChanged(_paused, msg.sender);
    }

    function lockEvidence(
        bytes32 _mediaHash,
        string calldata _ipfsCID,
        uint16 _confidenceScore,
        bool _isDeepfake,
        string calldata _threatRegion
    ) external onlyRole(OFFICER_ROLE) whenNotPaused {
        if (_mediaHash == bytes32(0)) revert InvalidMediaHash();
        if (bytes(_ipfsCID).length == 0) revert EmptyIpfsCID();
        if (_confidenceScore > 10000) revert InvalidConfidenceScore(_confidenceScore);
        if (_records[_mediaHash].timestamp != 0) revert EvidenceAlreadyRegistered(_mediaHash);

        EvidenceRecord memory newRecord = EvidenceRecord({
            mediaHash: _mediaHash,
            ipfsCID: _ipfsCID,
            confidenceScore: _confidenceScore,
            isDeepfake: _isDeepfake,
            registeredBy: msg.sender,
            timestamp: uint64(block.timestamp),
            threatRegion: _threatRegion
        });

        _records[_mediaHash] = newRecord;
        _allEvidenceHashes.push(_mediaHash);

        emit EvidenceLocked(
            _mediaHash,
            msg.sender,
            _isDeepfake,
            _confidenceScore,
            _ipfsCID,
            _threatRegion,
            uint64(block.timestamp)
        );

        if (_isDeepfake && _confidenceScore >= 8000) {
            emit TacticalC2Alert(
                _mediaHash,
                _threatRegion,
                _confidenceScore,
                uint64(block.timestamp)
            );
        }
    }

    function getEvidence(bytes32 _mediaHash) external view returns (EvidenceRecord memory) {
        if (_records[_mediaHash].timestamp == 0) revert EvidenceNotFound(_mediaHash);
        return _records[_mediaHash];
    }

    function verifyStatus(bytes32 _mediaHash) external view returns (
        bool isRegistered,
        bool isDeepfake,
        uint16 confidenceScore,
        address registeredBy,
        uint64 timestamp,
        string memory ipfsCID
    ) {
        EvidenceRecord memory record = _records[_mediaHash];
        if (record.timestamp == 0) {
            return (false, false, 0, address(0), 0, "");
        }
        return (
            true,
            record.isDeepfake,
            record.confidenceScore,
            record.registeredBy,
            record.timestamp,
            record.ipfsCID
        );
    }

    function getTotalEvidenceCount() external view returns (uint256) {
        return _allEvidenceHashes.length;
    }

    function getEvidenceHashesBatch(uint256 offset, uint256 limit) external view returns (bytes32[] memory) {
        uint256 total = _allEvidenceHashes.length;
        if (offset >= total) return new bytes32[](0);

        uint256 count = limit;
        if (offset + limit > total) {
            count = total - offset;
        }

        bytes32[] memory batch = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            batch[i] = _allEvidenceHashes[offset + i];
        }
        return batch;
    }
}
```

---

## 3. ABI Interface Summary

### Read Functions (Free Gas):
- `verifyStatus(bytes32 _mediaHash)` -> `(bool isRegistered, bool isDeepfake, uint16 confidenceScore, address registeredBy, uint64 timestamp, string ipfsCID)`
- `getEvidence(bytes32 _mediaHash)` -> `EvidenceRecord`
- `getTotalEvidenceCount()` -> `uint256`
- `getEvidenceHashesBatch(uint256 offset, uint256 limit)` -> `bytes32[]`
- `hasRole(bytes32 role, address account)` -> `bool`
- `paused()` -> `bool`

### Write Functions (Officer / Admin Required):
- `lockEvidence(...)` (Requires `OFFICER_ROLE`)
- `grantRole(bytes32 role, address account)` (Requires `ADMIN_ROLE`)
- `revokeRole(bytes32 role, address account)` (Requires `ADMIN_ROLE`)
- `setPaused(bool _paused)` (Requires `ADMIN_ROLE`)

---

## 4. Parameter Jaringan Target

* **Polygon Amoy Testnet (Public Test):**
  - Chain ID: `80002`
  - RPC URL: `https://rpc-amoy.polygon.technology/`
  - Explorer: `https://amoy.polygonscan.com/`
* **Private EVM Militer (Production On-Premise):**
  - Client: Hyperledger Besu (QBFT Consensus)
  - Latensi Blok: 1 detik
  - Zero Gas Cost (Private Permissioned Gas Model)
