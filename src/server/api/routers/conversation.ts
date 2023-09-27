import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const conversationRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return prisma.conversation.findMany();
  }),
  create: publicProcedure.input(z.object({name: z.string()})).mutation(({input}) => {
    return prisma.conversation.create({
      data:{
        name: input.name
      }
    });
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.conversation.delete({
        where: {
          id: input.id,
        },
      });
    }),
  updateName: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ input }) => {
      return prisma.conversation.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
