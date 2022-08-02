import { InternalConvexClient, QueryToken } from "convex/browser";
import { Context, createContext, from, useContext } from "solid-js";
import convexConfig from "../convex.json";

export class ConvexSolidClient {
  client: InternalConvexClient;
  // List of createQuery() calls below, that represent current subscriptions
  // to convex queries.
  // [setter from solid, path of query -- 'getCounter', arguments to query, unsubscribe from convex]
  subs: Map<QueryToken, [(val: any) => any, string, any[], () => void]>;

  constructor(origin?: string) {
    origin = origin ?? convexConfig.origin;
    this.subs = new Map();
    this.client = new InternalConvexClient(origin, (vals) => {
      this.handleNewValues(vals);
    });
  }

  // Called by convex internal client every time some of our subscriptions
  // have new values.
  handleNewValues(updatedQueries: QueryToken[]) {
    for (const queryToken of updatedQueries) {
      let queryInfo = this.subs.get(queryToken);
      if (queryInfo !== undefined) {
        const [setter, queryPath, args, _unsub] = queryInfo;
        const newValue = this.client.localQueryResult(queryPath, args);
        setter(newValue);
      }
    }
  }

  addSub(setter: (val: any) => any, queryPath: string, args: any[]): string {
    const { queryToken, unsubscribe } = this.client.subscribe(queryPath, args);
    this.subs.set(queryToken, [setter, queryPath, args, unsubscribe]);
    return queryToken;
  }

  rmSub(queryToken: string) {
    let queryInfo = this.subs.get(queryToken);
    const [, , , unsubscribe] = queryInfo!;
    unsubscribe();
    this.subs.delete(queryToken);
  }

  mutate(queryPath: string, args: any[]): Promise<any> {
    return this.client.mutate(queryPath, args);
  }
}

// given as an instance of ConvexSolidClient.
export const ConvexContext: Context<ConvexSolidClient | undefined> =
  createContext();

// Create a reactive SolidJS atom attached to a Convex query function.
export function createQuery<T>(queryPath: string, args?: any[]): () => T {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }
  let fullArgs = args ?? [];
  return from((setter) => {
    const queryToken = convex!.addSub(setter, queryPath, fullArgs);
    return () => convex.rmSub(queryToken);
  });
}

// Create a mutation callable using the current Convex client.
// Note: Doesn't support optimistic updates.
export function createMutation<T>(
  queryPath: string,
  args?: any[]
): () => Promise<T> {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }
  let fullArgs = args ?? [];

  return () => {
    return convex.mutate(queryPath, fullArgs);
  };
}
