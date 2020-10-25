import { SchemaDirectiveVisitor } from "apollo-server";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { CustomError } from "../../application/abstracts/custom_error";
import { AccessTokenManager } from "../../infrastructure/security/access_token_manager";

class AuthSchemaDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const originalResolve = field.resolve || defaultFieldResolver;
    const accessTokenManager = new AccessTokenManager();
    const errorHandler = new CustomError();

    field.resolve = async function (...args: any) {
      const context = args[2];
      const token = context.headers.authorization;
      if (!token) {
        //Throw error
        errorHandler.throw("Not Authenticated");
      }

      try {
        //Decode token
        const decodedToken = await accessTokenManager.verify(token);

        //Assigns it to  context
        args[2].userId = decodedToken;
      } catch (err) {
        //Throw error
        errorHandler.throw(err);
      }

      return originalResolve.apply(this, args);
    };
  }
}

export default AuthSchemaDirective;
