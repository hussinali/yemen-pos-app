import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { suppliers } from "../../drizzle/schema";
import { eq, like, desc } from "drizzle-orm";

export const suppliersRouter = router({
  list: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(suppliers);
        if (input.search) {
          query = query.where(like(suppliers.name, `%${input.search}%`)) as any;
        }
        return await query.orderBy(desc(suppliers.createdAt));
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        return [];
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        contactPerson: z.string().optional(),
        paymentTerms: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(suppliers).values({
          name: input.name,
          phone: input.phone || null,
          email: input.email || null,
          contactPerson: input.contactPerson || null,
          paymentTerms: input.paymentTerms || null,
        });

        return { success: true, supplierId: (result as any).insertId };
      } catch (error) {
        console.error("Error creating supplier:", error);
        throw error;
      }
    }),
});
