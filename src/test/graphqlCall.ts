import { ExecutionResult, graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../utils/createSchema';
import { Maybe } from 'type-graphql';

// import { createSchema } from "../utils/createSchema";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: unknown | null;
  }>;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({
  source,
  variableValues
}: Options): Promise<ExecutionResult> => {
  if (!schema) schema = await createSchema();

  return graphql({
    schema,
    source,
    variableValues
  });
};
