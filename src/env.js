const ENV = Object.freeze({
  AUCTIONS_TABLE_NAME: process.env.AUCTIONS_TABLE_NAME,
  GSI_STATUS_AND_ENDING_AT: "STATUS_AND_ENDING_AT",
});

export default ENV;
