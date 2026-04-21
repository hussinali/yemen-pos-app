import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllProducts,
  getProductByBarcode,
  getProductById,
  getAllBranches,
  getAllCategories,
  getInventoryByProduct,
  getAllCustomers,
  getCustomerById,
  getAllSuppliers,
  getSalesReport,
  getTopSellingProducts,
  getLowStockProducts,
  getUserNotifications,
  getAuditLogs,
  createAuditLog,
  createNotification,
} from "./db";
import { salesRouter } from "./routers/sales";
import { productsRouter } from "./routers/products";
import { customersRouter } from "./routers/customers";
import { suppliersRouter } from "./routers/suppliers";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // PRODUCTS & INVENTORY
  // ============================================================================
  products: router({
    list: protectedProcedure.query(async () => {
      return getAllProducts();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getProductById(input.id);
    }),

    getByBarcode: protectedProcedure.input(z.object({ barcode: z.string() })).query(async ({ input }) => {
      return getProductByBarcode(input.barcode);
    }),

    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const products = await getAllProducts();
        return products.filter(
          (p) =>
            p.name.includes(input.query) ||
            p.barcode?.includes(input.query) ||
            p.description?.includes(input.query)
        );
      }),
  }),

  // ============================================================================
  // BRANCHES & CATEGORIES
  // ============================================================================
  branches: router({
    list: protectedProcedure.query(async () => {
      return getAllBranches();
    }),
  }),

  categories: router({
    list: protectedProcedure.query(async () => {
      return getAllCategories();
    }),
  }),

  // ============================================================================
  // INVENTORY
  // ============================================================================
  inventory: router({
    getByProduct: protectedProcedure
      .input(z.object({ productId: z.number(), branchId: z.number() }))
      .query(async ({ input }) => {
        return getInventoryByProduct(input.productId, input.branchId);
      }),

    lowStockProducts: protectedProcedure
      .input(z.object({ branchId: z.number() }))
      .query(async ({ input }) => {
        return getLowStockProducts(input.branchId);
      }),
  }),

  // ============================================================================
  // CUSTOMERS
  // ============================================================================
  customers: router({
    list: protectedProcedure.query(async () => {
      return getAllCustomers();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getCustomerById(input.id);
    }),
  }),

  // ============================================================================
  // SUPPLIERS
  // ============================================================================
  suppliers: router({
    list: protectedProcedure.query(async () => {
      return getAllSuppliers();
    }),
  }),

  // ============================================================================
  // REPORTS & ANALYTICS
  // ============================================================================
  reports: router({
    salesReport: protectedProcedure
      .input(
        z.object({
          branchId: z.number(),
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        return getSalesReport(input.branchId, input.startDate, input.endDate);
      }),

    topProducts: protectedProcedure
      .input(z.object({ branchId: z.number(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return getTopSellingProducts(input.branchId, input.limit);
      }),
  }),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  notifications: router({
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().default(false) }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) return [];
        return getUserNotifications(ctx.user.id, input.unreadOnly);
      }),
  }),

  // ============================================================================
  // AUDIT LOG
  // ============================================================================
  auditLog: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) return [];
        return getAuditLogs(ctx.user.id, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
