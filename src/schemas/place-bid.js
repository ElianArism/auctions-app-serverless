export const PLACE_BID_SCHEMA = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        amount: {
          type: "number",
        },
      },
      required: ["amount"],
    },
  },
  required: ["body"],
};
