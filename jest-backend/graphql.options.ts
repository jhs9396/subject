import { Injectable, Logger } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { join } from 'path';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  private readonly logger = new Logger(GraphqlOptions.name);
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      context: ({ req, res }) => ({ req, res }),
      typePaths: ['./src/*/*.graphql', './schema/*.graphql'],
      installSubscriptionHandlers: true,
      resolverValidationOptions: {
        requireResolversForResolveType: 'warn',
      },
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.generated.ts'),
        outputAs: 'class',
        customScalarTypeMapping: {
          DateTime: 'DateTimeTz',
        },
      },
      plugins: [],
      debug: true,
      introspection: true,
      cors: {
        origin: true,
        credentials: true,
      },
      formatError: (err: GraphQLError): any => {
        this.logger.error(`${JSON.stringify(err, null, 2)}`);
        if (!err.originalError) {
          return err;
        }
        return (error: GraphQLError) => {
          return {
            message: `${error} error`,
            code: 400,
          };
        };
      },
    };
  }
}
