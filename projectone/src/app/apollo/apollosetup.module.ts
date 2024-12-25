import { inject, NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClient, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { Kind, OperationTypeNode } from 'graphql';

export function createApollo() {

  const httpLink = inject(HttpLink);
  const http = httpLink.create({
    uri: 'http://localhost:5000/graphql',
  });

  const ws = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:5000/graphql',
    }),
  );

  const link = split(
    // Split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      );
    },
    ws,
    http,
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}


@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class ApolloSetupModule { }
