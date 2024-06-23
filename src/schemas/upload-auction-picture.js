export const UPLOAD_AUCTION_PICTURE_SCHEMA = {
  properties: {
    body: {
      type: "string",
      minLength: 1,
      pattern: "=$",
    },
  },
  required: ["body"],
};
