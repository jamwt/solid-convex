import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query(async (ctx): Promise<number> => {
  const counterDoc = await ctx.db.query("counter_table").first();
  if (counterDoc === null) {
    return 0;
  }
  return counterDoc.counter;
});

export const increment = mutation({
  args: {
    increment: v.number(),
  },
  handler: async (ctx, args) => {
    let counterDoc = await ctx.db.query("counter_table").first();
    if (counterDoc === null) {
      counterDoc = {
        counter: args.increment,
      };
      await ctx.db.insert("counter_table", counterDoc);
    } else {
      await ctx.db.patch(counterDoc._id, {
        counter: counterDoc.counter + args.increment,
      });
    }
  },
});
