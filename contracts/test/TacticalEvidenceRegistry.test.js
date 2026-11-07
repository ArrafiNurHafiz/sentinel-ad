const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TacticalEvidenceRegistry (Production Grade)", function () {
  let registry;
  let admin;
  let officer;
  let unauthorizedAccount;

  const sampleMediaHash = ethers.keccak256(ethers.toUtf8Bytes("real_world_deepfake_evidence_stream"));
  const sampleIpfsCID = "QmZtmD2qtWbpPyDaJcwTDd8KprNWNJVnhZppRjhgcmEL8z";
  const confidenceScore = 9740; // 97.4%
  const isDeepfake = true;
  const threatRegion = "KODAM_JAYA";

  beforeEach(async function () {
    [admin, officer, unauthorizedAccount] = await ethers.getSigners();
    const TacticalEvidenceRegistry = await ethers.getContractFactory("TacticalEvidenceRegistry");
    registry = await TacticalEvidenceRegistry.deploy();
    await registry.waitForDeployment();

    // Grant OFFICER_ROLE to officer account
    const OFFICER_ROLE = await registry.OFFICER_ROLE();
    await registry.connect(admin).grantRole(OFFICER_ROLE, officer.address);
  });

  it("Should assign ADMIN_ROLE and OFFICER_ROLE to deployer upon construction", async function () {
    const ADMIN_ROLE = await registry.ADMIN_ROLE();
    const OFFICER_ROLE = await registry.OFFICER_ROLE();
    expect(await registry.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
    expect(await registry.hasRole(OFFICER_ROLE, admin.address)).to.be.true;
  });

  it("Should allow an authorized officer to lock evidence and emit events", async function () {
    const tx = await registry.connect(officer).lockEvidence(
      sampleMediaHash,
      sampleIpfsCID,
      confidenceScore,
      isDeepfake,
      threatRegion
    );

    await expect(tx)
      .to.emit(registry, "EvidenceLocked")
      .withArgs(
        sampleMediaHash,
        officer.address,
        isDeepfake,
        confidenceScore,
        sampleIpfsCID,
        threatRegion,
        (val) => val > 0
      );

    await expect(tx)
      .to.emit(registry, "TacticalC2Alert")
      .withArgs(sampleMediaHash, threatRegion, confidenceScore, (val) => val > 0);

    expect(await registry.getTotalEvidenceCount()).to.equal(1);
  });

  it("Should revert if an unauthorized account attempts to lock evidence", async function () {
    const OFFICER_ROLE = await registry.OFFICER_ROLE();
    await expect(
      registry.connect(unauthorizedAccount).lockEvidence(
        sampleMediaHash,
        sampleIpfsCID,
        confidenceScore,
        isDeepfake,
        threatRegion
      )
    ).to.be.revertedWithCustomError(registry, "UnauthorizedCaller")
      .withArgs(unauthorizedAccount.address, OFFICER_ROLE);
  });

  it("Should revert if attempting to lock duplicate evidence hash", async function () {
    await registry.connect(officer).lockEvidence(
      sampleMediaHash,
      sampleIpfsCID,
      confidenceScore,
      isDeepfake,
      threatRegion
    );

    await expect(
      registry.connect(officer).lockEvidence(
        sampleMediaHash,
        "QmAnotherCID",
        9200,
        true,
        "KODAM_I_BB"
      )
    ).to.be.revertedWithCustomError(registry, "EvidenceAlreadyRegistered")
      .withArgs(sampleMediaHash);
  });

  it("Should return correct record via verifyStatus()", async function () {
    await registry.connect(officer).lockEvidence(
      sampleMediaHash,
      sampleIpfsCID,
      confidenceScore,
      isDeepfake,
      threatRegion
    );

    const [isRegistered, isFake, score, registeredBy, timestamp, cid] =
      await registry.verifyStatus(sampleMediaHash);

    expect(isRegistered).to.be.true;
    expect(isFake).to.be.true;
    expect(score).to.equal(confidenceScore);
    expect(registeredBy).to.equal(officer.address);
    expect(timestamp).to.be.greaterThan(0);
    expect(cid).to.equal(sampleIpfsCID);
  });

  it("Should support pausing and unpausing by admin", async function () {
    await registry.connect(admin).setPaused(true);

    await expect(
      registry.connect(officer).lockEvidence(
        sampleMediaHash,
        sampleIpfsCID,
        confidenceScore,
        isDeepfake,
        threatRegion
      )
    ).to.be.revertedWithCustomError(registry, "ContractIsPaused");

    await registry.connect(admin).setPaused(false);

    await expect(
      registry.connect(officer).lockEvidence(
        sampleMediaHash,
        sampleIpfsCID,
        confidenceScore,
        isDeepfake,
        threatRegion
      )
    ).to.emit(registry, "EvidenceLocked");
  });
});
