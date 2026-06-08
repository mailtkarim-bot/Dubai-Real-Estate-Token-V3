.PHONY: deploy-local deploy-sepolia-dry deploy-sepolia test coverage anvil

anvil:
	anvil --block-time 2

deploy-local:
	forge script script/deploy/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

deploy-sepolia-dry:
	@. ./.env && forge script script/deploy/DeployTestnet.s.sol --rpc-url $${SEPOLIA_RPC_URL} --private-key $${PRIVATE_KEY}

deploy-sepolia:
	@. ./.env && forge script script/deploy/DeployTestnet.s.sol --rpc-url $${SEPOLIA_RPC_URL} --private-key $${PRIVATE_KEY} --broadcast --verify --etherscan-api-key $${ETHERSCAN_API_KEY}

test:
	forge test --summary

coverage:
	forge coverage | sed '/script\//d; /test\//d; /MockUSDC/d; /Total/d'
