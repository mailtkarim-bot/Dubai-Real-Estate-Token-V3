.PHONY: deploy-local deploy-sepolia-dry deploy-sepolia deploy-mainnet-dry deploy-mainnet test coverage coverage-core-html anvil upgrade-sepolia

anvil:
	anvil --block-time 2

# Local Anvil deployment uses the public Anvil default key (not a secret).
deploy-local:
	forge script script/deploy/DeployPhase2.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Sepolia / Mainnet targets use PRIVATE_KEY from .env.
# Fill PRIVATE_KEY in your .env file. Never commit the real .env.
deploy-sepolia-dry:
	@. ./.env && forge script script/deploy/DeployPhase2.s.sol --rpc-url $${SEPOLIA_RPC_URL} --private-key $${PRIVATE_KEY}

deploy-sepolia:
	@. ./.env && forge script script/deploy/DeployPhase2.s.sol --rpc-url $${SEPOLIA_RPC_URL} --private-key $${PRIVATE_KEY} --broadcast --verify --etherscan-api-key $${ETHERSCAN_API_KEY}

deploy-mainnet-dry:
	@. ./.env && forge script script/deploy/DeployPhase2.s.sol --rpc-url $${MAINNET_RPC_URL} --private-key $${PRIVATE_KEY}

deploy-mainnet:
	@. ./.env && forge script script/deploy/DeployPhase2.s.sol --rpc-url $${MAINNET_RPC_URL} --private-key $${PRIVATE_KEY} --broadcast --verify --etherscan-api-key $${ETHERSCAN_API_KEY}

upgrade-sepolia:
	@. ./.env && forge script script/upgrade/UpgradeDREIT.s.sol --rpc-url $${SEPOLIA_RPC_URL} --private-key $${PRIVATE_KEY} --broadcast --verify --etherscan-api-key $${ETHERSCAN_API_KEY}

test:
	forge test --summary

coverage:
	@forge coverage --ir-minimum | awk '/^\| File/ { print prev; print; header=1; next } header && /^[+]=/ { print; next } header && /^\| src\// { print; next } header && /^╰/ { print; exit } { prev=$$0 }'

# Generate an official LCOV HTML report showing only core contracts in a single flat table.
coverage-core-html:
	@forge coverage --ir-minimum --report lcov >/dev/null 2>&1
	@awk '/^SF:src\//{flag=1;print;next}/^SF:/{flag=0}flag' lcov.info > lcov-core.info
	@rm -rf /tmp/DREIT coverage-report-core-flat
	@mkdir -p /tmp/DREIT
	@cp src/compliance/*.sol src/core/*.sol /tmp/DREIT/
	@awk '/^SF:/{ match($$0, /[^\/]+$$/); print "SF:/tmp/DREIT/" substr($$0, RSTART, RLENGTH); next } {print}' lcov-core.info > lcov-core-dreit.info
	@genhtml --source-directory /tmp/DREIT -o coverage-report-core-flat lcov-core-dreit.info >/dev/null 2>&1
	@cp coverage-report-core-flat/DREIT/* coverage-report-core-flat/
	@rm -rf coverage-report-core-flat/DREIT
	@echo "Core coverage HTML generated at coverage-report-core-flat/index.html"
