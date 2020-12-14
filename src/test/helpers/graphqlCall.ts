import { ExecutionResult, graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../../utils/createSchema';
import { Maybe } from 'type-graphql';

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: unknown | null;
  }>;
  userId?: string;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({
  source,
  variableValues,
  userId
}: Options): Promise<ExecutionResult> => {
  if (!schema) schema = await createSchema();

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId
        }
      }
      // res: {
      //   clearCookie: jest.fn()
      // }
    }
  });
};
