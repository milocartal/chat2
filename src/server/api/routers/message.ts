import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const messageRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({idConv: z.string()})).query(({input}) => {
    return prisma.message.findMany({
      where: {
        idConv: input.idConv
      }
    });
  }),
  create: publicProcedure
    .input(
      z.object({ texte: z.string(), username: z.string(), idConv: z.string() }),
    )
    .mutation(({ input }) => {
      return prisma.message.create({
        data: {
          texte: input.texte,
          username: input.username,
          idConv: input.idConv,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.message.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
