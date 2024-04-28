import { getEndedAuctions } from "../services";

async function processAuction(command, ctx) {
  try {
    console.log("Processing auction! ");
    const endedAuctions = await getEndedAuctions();
  } catch (error) {}
}

export const handler = processAuction;
