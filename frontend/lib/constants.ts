import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const GRAPH_CLIENT_URL = "http://127.0.0.1:4000/graphql";

export const graphClient = new ApolloClient({
  uri: GRAPH_CLIENT_URL,
  cache: new InMemoryCache(),
});
