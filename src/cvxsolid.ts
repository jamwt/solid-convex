import { ConvexClient } from "convex/browser";
import { FunctionReference } from "convex/server";
import { Context, createContext, from, useContext } from "solid-js";

export const ConvexContext: Context<ConvexClient | undefined> = createContext();

// Create a reactive SolidJS atom attached to a Convex query function.
export function createQuery<T>(
  query: FunctionReference<"query">,
  args?: {}
): () => T | undefined {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }
  let fullArgs = args ?? {};
  return from((setter) => {
    const unsubber = convex!.onUpdate(query, fullArgs, setter);
    return unsubber;
  });
}

export function createMutation<T>(
  mutation: FunctionReference<"mutation">
): (args?: {}) => Promise<T> {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }

  return (args) => {
    let fullArgs = args ?? {};
    return convex.mutation(mutation, fullArgs);
  };
}

export function createAction<T>(
  action: FunctionReference<"action">
): (args?: {}) => Promise<T> {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }
  return (args) => {
    let fullArgs = args ?? {};
    return convex.action(action, fullArgs);
  };
}
