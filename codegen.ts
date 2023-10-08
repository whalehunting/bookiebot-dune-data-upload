import type { CodegenConfig } from "@graphql-codegen/cli"
import { subgraphEndpoint } from "./config"

const config: CodegenConfig = {
	overwrite: true,
	schema: subgraphEndpoint,
	documents: "utils/graphql/queries",
	generates: {
		"utils/graphql/generated/index.ts": {
			plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
		},
	},
}

export default config
