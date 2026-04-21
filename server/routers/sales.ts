import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { sales, saleItems, auditLog } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const salesRouter = router({
  create: protectedProcedure
    .input(z.object({
      customerId: z.number().optional(),
      branchId: z.number(),
      items: z.array(z.object({
        productId: z.number(),
        quantity: z.number().positive(),
        unitPrice: z.string(),
        taxRate: z.string().default("0"),
        subtotal: z.string(),
      })),
      subtotal: z.string(),
      taxAmount: z.string(),
      total: z.string(),
      paymentMethod: z.enum(["cash", "bank_transfer", "credit_card"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const saleNumber = `SALE-${Date.now()}`;
      const saleResult = await db.insert(sales).values({
        saleNumber,
        customerId: input.customerId || null,
        branchId: input.branchId,
        cashierId: ctx.user.id,
        subtotal: input.subtotal,
        taxAmount: input.taxAmount,
        total: input.total,
        paymentMethod: input.paymentMethod,
        notes: input.notes || null,
        status: "completed",
        paymentStatus: "paid",
      });

      const saleId = (saleResult as any).insertId;

      for (const item of input.items) {
        await db.insert(saleItems).values({
          saleId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          subtotal: item.subtotal,
        });
      }

      await db.insert(auditLog).values({
        userId: ctx.user.id,
        action: "CREATE_SALE",
        entityType: "SALE",
        entityId: saleId,
        details: JSON.stringify({ saleNumber, total: input.total }),
        ipAddress: (ctx.req as any).ip || "unknown",
      });

      return { success: true, saleId, saleNumber };
    }),

  list: protectedProcedure
    .input(z.object({ branchId: z.number(), limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(sales).where(eq(sales.branchId, input.branchId))
        .orderBy(desc(sales.createdAt)).limit(input.limit).offset(input.offset);
      return result;
    }),

  getById: protectedProcedure
    .input(z.object({ saleId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const sale = await db.select().from(sales).where(eq(sales.id, input.saleId)).limit(1);
      if (sale.length === 0) return null;
      const items = await db.select().from(saleItems).where(eq(saleItems.saleId, input.saleId));
      return { ...sale[0], items };
    }),
});
