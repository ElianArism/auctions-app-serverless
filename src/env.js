const ENV = Object.freeze({
  AUTH_KEY: process.env.AUTH_KEY,
  AUCTIONS_TABLE_NAME: process.env.AUCTIONS_TABLE_NAME,
  GSI_STATUS_AND_ENDING_AT: "STATUS_AND_ENDING_AT",
  MAIL_QUEUE_URL: process.env.MAIL_QUEUE_URL,
  REGION: process.env.REGION,
});

export default ENV;
