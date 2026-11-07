from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ForensicAnalysisDetails(BaseModel):
    facial_blend_inconsistency: float = Field(..., description="Tingkat ketidaksinkronan batas wajah GAN (0-1)")
    eye_blink_anomaly: float = Field(..., description="Anomali ritme kedipan mata/pupil (0-1)")
    audio_vocoder_synthetic: float = Field(..., description="Tingkat kemungkinan sintetis vokal AI (0-1)")
    anomalies_detected: List[str] = Field(default_factory=list, description="Daftar anomali konkret yang terdeteksi")
    raw_metrics: Optional[Dict[str, Any]] = Field(default=None, description="Metrik kalkulasi frekuensi & gradien spasial")

class AnalyzeResponseData(BaseModel):
    file_name: str
    file_size_bytes: int
    media_type: str
    sha256: str
    verdict: str
    is_deepfake: bool
    confidence_score: float
    confidence_percentage: float
    threat_level: str
    threat_region: str
    forensic_analysis: ForensicAnalysisDetails
    xai_heatmap_base64: Optional[str] = None
    processing_ms: Optional[int] = None
    analyzed_at: str

class AnalyzeResponse(BaseModel):
    status: str
    data: AnalyzeResponseData
    message: str
    timestamp: str

class ArchiveVaultRequest(BaseModel):
    sha256: str
    file_name: str
    verdict: str
    confidence_score: float
    threat_region: str = "KODAM_JAYA"
    officer_address: str
    investigator_notes: Optional[str] = "Pemeriksaan taktis unit siber"

class ArchiveVaultResponseData(BaseModel):
    ipfs_cid: str
    vault_url: str
    pinned_at: str

class ArchiveVaultResponse(BaseModel):
    status: str
    data: ArchiveVaultResponseData
    message: str
    timestamp: str

class LockEvidenceRequest(BaseModel):
    sha256: str = Field(..., description="Hash SHA-256 media yang dikunci on-chain")
    tx_hash: str = Field(..., description="Hash transaksi blockchain (EVM)")
    ipfs_cid: Optional[str] = Field(None, description="CID IPFS arsip bukti")
    officer_address: str = Field(..., description="Alamat kunci perwira penandatangan")

class VerifyResponseData(BaseModel):
    sha256: str
    is_registered: bool
    verdict: str
    official_statement: str
    confidence_score: Optional[float] = None
    locked_on_blockchain: bool
    tx_hash: Optional[str] = None
    blockchain_explorer_url: Optional[str] = None
    verified_at: str

class VerifyResponse(BaseModel):
    status: str
    data: VerifyResponseData
    timestamp: str
