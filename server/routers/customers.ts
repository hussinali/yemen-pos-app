import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { customers } from "../../drizzle/schema";
import { eq, like, desc } from "drizzle-orm";

export const customersRouter = router({
  list: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(customers);
        if (input.search) {
          query = query.where(like(customers.name, `%${input.search}%`)) as any;
        }
        return await query.orderBy(desc(customers.createdAt));
      } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(customers).values({
          name: input.name,
          phone: input.phone || null,
          email: input.email || null,
          address: input.address || null,
          loyaltyPoints: 0,
        });

        return { success: true, customerId: (result as any).insertId };
      } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
      }
    }),
});
