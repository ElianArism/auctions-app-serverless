import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpJsonBodyParser from "@middy/http-json-body-parser";

export class ApiMiddleware {
  static use(handler) {
    return middy(createAuction).use([
      httpJsonBodyParser(), // Parse our stringified input body
      httpEventNormalizer(), // Adjust api gateway event object and normalize it
      httpErrorHandler(), // Make our handling error process cleaner
    ]);
  }
}
