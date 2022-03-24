import { apolloClient } from './apollo-client';
import { gql } from '@apollo/client';

const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`;


export const verify = (accessToken:string) => {
   return apolloClient.query({
    query: gql(VERIFY),
    variables: {
      request: {
         accessToken,
      },
    },
  })
}
