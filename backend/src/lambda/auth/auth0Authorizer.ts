import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import * as jwksClient from 'jwks-rsa'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { JwtHeader } from 'jsonwebtoken'

const logger = createLogger('auth')
const jwksUrl = process.env.JWKS_URL
const client = jwksClient({
  jwksUri: jwksUrl
});

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  if(!jwt || !jwt.header) {
    throw new Error("Invalid jwt header")
  }

  let key = await getKey(jwt.header)
  let publicKey = key.getPublicKey()

  return verify(token,publicKey) as JwtPayload
}

async function getKey(header: JwtHeader): Promise<jwksClient.SigningKey>{
  return new Promise((resolve,reject) => {
    client.getSigningKey(header.kid, function(err: Error, key: jwksClient.SigningKey) {
        if(err){
          reject(err)
        }
        resolve(key)
        
    });
  })

}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}