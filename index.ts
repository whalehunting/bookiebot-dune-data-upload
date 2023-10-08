import fs from "fs/promises"
import { Parser } from "@json2csv/plainjs"

import client from "./utils/graphql/client"
import fetchChunkedResource from "./utils/fetchChunkedResource"

import { BookieBotBetsQuery } from "./utils/graphql/generated"

const totalNumberOfBets = 10000 // Update this number to the total number of bets in the subgraph
const chunkSize = 1000

const fetchBookieBotBets = async () => {
	const fetchBetsChunk = async (chunkNumber: number) => {
		const offset = chunkNumber * chunkSize - chunkSize

		const { bets: betsChunk } = await client.bookieBotBets({
			skip: offset,
		})

		return betsChunk
	}

	const bets = await fetchChunkedResource(
		totalNumberOfBets,
		chunkSize,
		(chunkNumber: number) => fetchBetsChunk(chunkNumber),
		(chunkNumber: number, numberOfChunks: number) => {
			console.info(`Fetching chunk ${chunkNumber} of ${numberOfChunks}`)
		},
	)

	return bets
}

interface Game {
	id: string
	title: string
	sport: string
	league: string
	leagueCountry: string
}

const getUniqueGames = (bets: BookieBotBetsQuery["bets"]) => {
	const games = bets
		.flatMap((bet) => bet._games)
		.map((_game) => {
			const {
				gameId: id,
				title,
				sport: { name: sport },
				league: {
					name: league,
					country: { name: leagueCountry },
				},
			} = _game

			const game = {
				id,
				title: title ?? "",
				sport,
				league,
				leagueCountry,
			}

			return game
		})

	const gamesById = games.reduce(
		(gamesById, game) => {
			gamesById[game.id] = game
			return gamesById
		},
		{} as Record<string, Game>,
	)

	const uniqueGames = Object.values(gamesById)

	return uniqueGames
}

const main = async () => {
	const bets = await fetchBookieBotBets()
	console.info(`Fetched ${bets.length} bets from subgraph`)
	const games = getUniqueGames(bets)
	console.info(`Found ${games.length} unique games`)

	const gamesCsv = new Parser().parse(games)
	await fs.writeFile("./bookiebot_azuro_games.csv", gamesCsv)
	console.info("Succesfully wrote games to bookiebot_azuro_games.csv.")
}

main()
	.then(() => {
		process.exit(0)
	})
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
