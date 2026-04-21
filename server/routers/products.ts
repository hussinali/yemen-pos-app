import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { products, auditLog } from "../../drizzle/schema";
import { eq, like, desc } from "drizzle-orm";

export const productsRouter = router({
  list: protectedProcedure
    .input(z.object({ search: z.string().optional(), categoryId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      try {
        let query = db.select().from(products);
        if (input.search) query = query.where(like(products.name, `%${input.search}%`)) as any;
        if (input.categoryId) query = query.where(eq(products.categoryId, input.categoryId)) as any;
        return await query.orderBy(desc(products.createdAt));
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      barcode: z.string().optional(),
      categoryId: z.number(),
      purchasePrice: z.string(),
      sellingPrice: z.string(),
      taxRate: z.string().default("0"),
      unit: z.string(),
      minStock: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(products).values({
        name: input.name,
        barcode: input.barcode || null,
        categoryId: input.categoryId,
        purchasePrice: input.purchasePrice,
        sellingPrice: input.sellingPrice,
        taxRate: input.taxRate,
        unit: input.unit,
        minStock: input.minStock,
        isActive: true,
      });
      const productId = (result as any).insertId;
      await db.insert(auditLog).values({
        userId: ctx.user.id,
        action: "CREATE_PRODUCT",
        entityType: "PRODUCT",
        entityId: productId,
        details: JSON.stringify({ name: input.name }),
        ipAddress: (ctx.req as any).ip || "unknown",
      });
      return { success: true, productId };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().optional(), sellingPrice: z.string().optional(), minStock: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.sellingPrice) updateData.sellingPrice = input.sellingPrice;
      if (input.minStock !== undefined) updateData.minStock = input.minStock;
      await db.update(products).set(updateData).where(eq(products.id, input.id));
      await db.insert(auditLog).values({
        userId: ctx.user.id,
        action: "UPDATE_PRODUCT",
        entityType: "PRODUCT",
        entityId: input.id,
        details: JSON.stringify(updateData),
        ipAddress: (ctx.req as any).ip || "unknown",
      });
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(products).set({ isActive: false }).where(eq(products.id, input.id));
      await db.insert(auditLog).values({
        userId: ctx.user.id,
        action: "DELETE_PRODUCT",
        entityType: "PRODUCT",
        entityId: input.id,
        details: JSON.stringify({ deleted: true }),
        ipAddress: (ctx.req as any).ip || "unknown",
      });
      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      return result.length > 0 ? result[0] : null;
    }),
});
