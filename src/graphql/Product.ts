import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.string("imageUrl");
    t.nonNull.int("price");
    t.nonNull.int("inStock");
    t.nonNull.int("sold", {
      async resolve(parent, __, context) {
        const users = await context.prisma.user.count({
          where: { boughtProduct: { some: { id: parent.id } } },
        });
        return users;
      },
    });
  },
});

export const productQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("allProducts", {
      type: "Product",
      async resolve(_, __, context) {
        return await context.prisma.product.findMany();
      },
    });
  },
});

export const productMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addProduct", {
      type: "Product",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg({ default: "No description" })),
        imageUrl: nonNull(stringArg()),
        price: nonNull(intArg()),
        inStock: nonNull(intArg({ default: 1 })),
      },
      async resolve(_, args, context) {
        const product = context.prisma.product.create({
          data: { ...args, sold: 0 },
        });
        return product;
      },
    });
  },
});
