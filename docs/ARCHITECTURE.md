 # Dubai Real Estate Token V2 — System Architecture                                                                       
                                                                                                                              
     ## Overview                                                                                                              
                                                                                                                              
     This architecture implements a Real World Asset (RWA) real estate tokenization platform targeting the Dubai market, fully
   compliant with the **ERC-3643 (T-REX)** standard for permissioned security tokens. The design enforces strict separation of
   concerns to minimize attack surface and facilitate institutional-grade audits.                                             
                                                                                                                              
     The platform enables fractional ownership of premium Dubai commercial and residential properties, with on-chain identity 
   verification, automated compliance enforcement, real-time property valuation via decentralized oracles, and governance     
   safeguards suitable for regulated institutional deployment.                                                                
                                                                                                                              
     ```mermaid                                                                                                               
     graph TB                                                                                                                 
         subgraph OffChain["Real World Layer"]                                                                                
             INVESTOR["Investor (Off-Chain KYC/AML)"]                                                                         
             REGULATOR["VARA / DLD Regulator"]                                                                                
             CUSTODIAN["Legal Custodian — Property Title"]                                                                    
             CHAINLINK_NODE["Chainlink Nodes — Dubai Property Index"]                                                         
         end                                                                                                                  
                                                                                                                              
         subgraph Blockchain["Blockchain Layer (Polygon / Ethereum L2)"]                                                      
             subgraph GovernanceLayer["Governance & Administration"]                                                          
                 MULTISIG["Gnosis Safe Multisig"]                                                                             
                 TIMELOCK["TimelockController"]                                                                               
             end                                                                                                              
                                                                                                                              
             subgraph TokenCore["Token Core"]                                                                                 
                 TOKEN["DubaiRealEstateToken<br/>ERC-3643 T-REX"]                                                             
             end                                                                                                              
                                                                                                                              
             subgraph ComplianceLayer["Compliance Engine"]                                                                    
                 ID_REGISTRY["IdentityRegistry<br/>KYC/AML Registry"]                                                         
                 ID_STORAGE["IdentityRegistryStorage"]                                                                        
                 CLAIM_TOPICS["ClaimTopicsRegistry"]                                                                          
                 TRUSTED_ISSUERS["TrustedIssuersRegistry"]                                                                    
                 COMPLIANCE["ComplianceEngine<br/>Transfer Hooks"]                                                            
             end                                                                                                              
                                                                                                                              
             subgraph OracleLayer["Oracle & Data Layer"]                                                                      
                 PRICE_ORACLE["DubaiPropertyOracle<br/>Chainlink Price Feed"]                                                 
             end                                                                                                              
                                                                                                                              
             subgraph UtilityLayer["Utility Modules"]                                                                         
                 DIVIDEND["DividendDistributor<br/>Rental Yield Distribution"]                                                
             end                                                                                                              
         end                                                                                                                  
                                                                                                                              
         INVESTOR -->|Submits KYC| ID_REGISTRY                                                                                
         REGULATOR -->|Approves / Freezes| COMPLIANCE                                                                         
         CUSTODIAN -.->|Legal Proof| TOKEN                                                                                    
         CHAINLINK_NODE -->|Price Update| PRICE_ORACLE                                                                        
                                                                                                                              
         MULTISIG -->|Proposes| TIMELOCK                                                                                      
         TIMELOCK -->|Executes after delay| TOKEN                                                                             
         TIMELOCK -->|Executes| ID_REGISTRY                                                                                   
         TIMELOCK -->|Executes| COMPLIANCE                                                                                    
                                                                                                                              
         TOKEN -->|Verifies Identity| ID_REGISTRY                                                                             
         TOKEN -->|Verifies Rules| COMPLIANCE                                                                                 
         TOKEN -->|Valuation| PRICE_ORACLE                                                                                    
         TOKEN -->|Distributes Yield| DIVIDEND                                                                                
                                                                                                                              
         COMPLIANCE -->|Reads Identities| ID_REGISTRY                                                                         
         COMPLIANCE -->|Reads Claim Topics| CLAIM_TOPICS                                                                      
         COMPLIANCE -->|Verifies Issuers| TRUSTED_ISSUERS                                                                     
         ID_REGISTRY -->|Persists| ID_STORAGE                                                                                 
   ```                                                                                                                        
                                                                                                                              
   Module Responsibilities                                                                                                    
                                                                                                                              
   ┌───────────────────────┬───────────────────────────────────────┬─────────────────────────────────────────────────────────┐
   │ Module                │ Source File(s)                        │ Responsibility                                          │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Token Core            │ src/core/DubaiRealEstateToken.sol     │ ERC-3643 security token representing fractional         │
   │                       │                                       │ property ownership                                      │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Identity Registry     │ src/compliance/IdentityRegistry.sol   │ On-chain validation of investor identities and          │
   │                       │                                       │ accreditation status                                    │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Compliance Engine     │ src/compliance/ComplianceEngine.sol   │ Pre- and post-transfer hooks enforcing jurisdictional   │
   │                       │                                       │ and regulatory rules                                    │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Claim Topics Registry │ src/compliance/ClaimTopicsRegistry.so │ Defines required credential topics (e.g., KYC, AML,     │
   │                       │ l                                     │ Accredited Investor)                                    │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Trusted Issuers       │ src/compliance/TrustedIssuersRegistry │ Whitelist of authorized identity claim issuers          │
   │ Registry              │ .sol                                  │                                                         │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Oracles               │ src/oracles/DubaiPropertyOracle.sol   │ Fresh, medianized property valuations with staleness    │
   │                       │                                       │ validation and fallback                                 │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Governance            │ src/governance/                       │ Timelock + Multisig for all administrative and upgrade  │
   │                       │                                       │ actions                                                 │
   ├───────────────────────┼───────────────────────────────────────┼─────────────────────────────────────────────────────────┤
   │ Dividend Distribution │ src/core/DividendDistributor.sol      │ Automated rental yield distribution to token holders    │
   └───────────────────────┴───────────────────────────────────────┴─────────────────────────────────────────────────────────┘
                                                                                                                              
   Transfer Flow (Buy / Sell / Transfer)                                                                                      
                                                                                                                              
   1. Investor A initiates a transfer to Investor B                                                                           
   2. The token calls ComplianceEngine.canTransfer(A, B, amount)                                                              
   3. The compliance layer validates:                                                                                         
       • Both A and B hold valid on-chain identities via IdentityRegistry                                                     
       • Neither party is subject to regulatory freeze                                                                        
       • Investor limits and holding caps are respected                                                                       
       • Jurisdictional requirements are satisfied (VARA / DLD / UAE compliance)                                              
   4. Upon clearance, the transfer executes atomically                                                                        
   5. Unclaimed dividends are auto-synchronized for both parties                                                              
                                                                                                                              
   Upgrade Path                                                                                                               
                                                                                                                              
   The system utilizes a UUPS Proxy Pattern with the following safeguards:                                                    
   • All implementation upgrades are routed through TimelockController                                                        
   • A mandatory delay period allows stakeholders to review and potentially exit before changes take effect                   
   • The multisig requires M-of-N signatures for any governance action                                                        
                                                                                                                              
   Security Posture — OWASP Smart Contract Top 10 Mapping                                                                     
                                                                                                                              
   ┌──────────────────────┬─────────────────────────────────┬────────────────────────────────────────────────────────────────┐
   │ Component            │ Primary Risk                    │ Mitigation Strategy                                            │
   ├──────────────────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────┤
   │ Token Core           │ Access Control (SC01)           │ OpenZeppelin RBAC + Timelock + Multisig                        │
   ├──────────────────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────┤
   │ Compliance Engine    │ Business Logic (SC02)           │ Extensive fuzzing + invariant testing + manual audit           │
   ├──────────────────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────┤
   │ Oracle Layer         │ Price Oracle Manipulation       │ Medianization + staleness threshold + fallback oracle          │
   │                      │ (SC03)                          │                                                                │
   ├──────────────────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────┤
   │ Transfer Mechanics   │ Reentrancy / Flash Loan (SC04)  │ Checks-Effects-Interactions + ReentrancyGuard + Pull-over-Push │
   ├──────────────────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────┤
   │ Proxy Administration │ Proxy Vulnerabilities (SC09)    │ UUPS + upgrade delay + event emission                          │
   ├──────────────────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────┤
   │ Input Validation     │ Lack of Input Validation (SC05) │ Custom errors + strict parameter bounds on all external        │
   │                      │                                 │ functions                                                      │
   └──────────────────────┴─────────────────────────────────┴────────────────────────────────────────────────────────────────┘
                                                                                                                              
   Regulatory Alignment                                                                                                       
                                                                                                                              
   ┌─────────────────────┬───────────────────────────────────────────────────────────────────────────┐                        
   │ Requirement         │ Implementation                                                            │                        
   ├─────────────────────┼───────────────────────────────────────────────────────────────────────────┤                        
   │ VARA Compliance     │ On-chain identity verification via ERC-3643 identity registries           │                        
   ├─────────────────────┼───────────────────────────────────────────────────────────────────────────┤                        
   │ DLD Registration    │ Property title linkage through custodian attestation (off-chain bridge)   │                        
   ├─────────────────────┼───────────────────────────────────────────────────────────────────────────┤                        
   │ KYC/AML             │ Continuous verification through claim-based identity credentials          │                        
   ├─────────────────────┼───────────────────────────────────────────────────────────────────────────┤                        
   │ Investor Protection │ Transfer freezing, forced transfers for legal enforcement, holding caps   │                        
   ├─────────────────────┼───────────────────────────────────────────────────────────────────────────┤                        
   │ Transparency        │ Full event emission for all governance, compliance, and financial actions │                        
   └─────────────────────┴───────────────────────────────────────────────────────────────────────────┘                        
                                                                                                                              
   Roadmap                                                                                                                    
                                                                                                                              
   ┌───────┬─────────────────────────────────────────────────────────────────────┐                                            
   │ Phase │ Deliverable                                                         │                                            
   ├───────┼─────────────────────────────────────────────────────────────────────┤                                            
   │ MVP   │ Core token, identity registry, basic compliance, oracle integration │                                            
   ├───────┼─────────────────────────────────────────────────────────────────────┤                                            
   │ V1.1  │ Automated dividend distribution, enhanced governance voting         │                                            
   ├───────┼─────────────────────────────────────────────────────────────────────┤                                            
   │ V1.2  │ Multi-property portfolio support, cross-jurisdiction compliance     │                                            
   ├───────┼─────────────────────────────────────────────────────────────────────┤                                            
   │ V2.0  │ DAO governance transition, secondary market liquidity mechanisms    │                                            
   └───────┴─────────────────────────────────────────────────────────────────────┘   