# Security Advisory

This document outlines known security vulnerabilities in the project's dependencies and the rationale for accepting them.

## Known Vulnerabilities

### 1. uuid (Moderate Severity)
- **Advisory**: [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)
- **Description**: Missing buffer bounds check in v3/v5/v6 when buf is provided.
- **Affected Packages**:
  - `@metamask/sdk`
  - `@metamask/utils`
  - `@wagmi/connectors`
  - `wagmi`
  - `@rainbow-me/rainbowkit`
- **Rationale**: This vulnerability is in a transitive dependency and does not directly affect the application's security. Upgrading to a non-vulnerable version would require major updates to `wagmi` and `@rainbow-me/rainbowkit`, which may introduce breaking changes.

### 2. ws (Moderate Severity)
- **Advisory**: [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx)
- **Description**: Uninitialized memory disclosure.
- **Affected Packages**:
  - `@walletconnect/utils`
  - `viem`
  - `@reown/appkit`
- **Rationale**: Similar to the uuid vulnerability, this is a transitive dependency issue. The risk is mitigated by the fact that the application does not directly use the vulnerable functionality.

## Mitigation

- **Monitoring**: Regularly check for updates to `wagmi` and `@rainbow-me/rainbowkit` that address these vulnerabilities without introducing breaking changes.
- **Testing**: Ensure that any future updates to these dependencies are thoroughly tested to avoid introducing new issues.

## Contact

If you have any questions or concerns about these vulnerabilities, please contact the project maintainers.
