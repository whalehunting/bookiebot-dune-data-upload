import { GraphQLClient } from "graphql-request"
import { getSdk } from "./generated"
import { subgraphEndpoint } from "../../config"

const client = new GraphQLClient(subgraphEndpoint)
const sdk = getSdk(client)

export default sdk
