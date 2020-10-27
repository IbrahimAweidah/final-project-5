// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'lh3um8zn07'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-0rw8r0s2.eu.auth0.com',            // Auth0 domain
  clientId: 'X9oU63qGD9dOMVLuVGuzHhP7Qkj1Gv8R',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback',
}