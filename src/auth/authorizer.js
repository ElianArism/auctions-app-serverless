import jwt from "jsonwebtoken";
import ENV from "../env";
async function authorizerLambda(event, context) {
  try {
    // get the token
    const token = event.authorizationToken
      .replace("Bearer", "")
      .trim();
    // verify token
    const decodedToken = jwt.verify(token, ENV.AUTH_KEY);
    // construct the policy
    return {
      ...generateAWSPermissionPolicy(
        decodedToken.sub,
        event.methodArn
      ),
      context: decodedToken,
    };
  } catch (error) {
    console.log(error);
  }
}

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimising costs.
function generateAWSPermissionPolicy(principalId, methodArn) {
  const apiGatewayWildcard = methodArn.split("/", 2).join("/") + "/*"; // /stage/method/resource

  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
}

export const handler = authorizerLambda;
