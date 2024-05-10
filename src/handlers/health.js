async function health(event, ctx) {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
}

export const handler = health;
