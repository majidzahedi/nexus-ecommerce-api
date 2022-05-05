import { objectType, extendType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.list.field("boughtProducts", {
      type: "Product",
      async resolve(parent, __, context) {
        const products = await context.prisma.product.findMany({
          where: { soldTo: { some: { id: parent.id } } },
        });
        return products;
      },
    });
  },
});

export const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("logedUser", {
      type: "User",
      async resolve(_, __, context) {
        const userId = context.userId;
        if (!userId) throw new Error("You'r not loged in!");
        return await context.prisma.user.findFirst({ where: { id: userId } });
      },
    });
  },
});
