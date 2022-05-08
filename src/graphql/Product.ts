import {
  extendType,
  intArg,
  objectType,
  stringArg,
  list,
  nonNull,
} from "nexus";
import { faker } from "@faker-js/faker";

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.string("imageUrl");
    t.nonNull.int("price");
    t.nonNull.int("inStock");
    t.nonNull.string("category");
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
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
      },
      async resolve(_, args, context) {
        const where: any = args.filter
          ? { category: { contains: args.filter } }
          : {};
        return await context.prisma.product.findMany({
          where,
          skip: args.skip as number | undefined,
          take: args.take as number | undefined,
        });
      },
    });
    t.field("product", {
      type: "Product",
      args: { id: nonNull(intArg()) },
      async resolve(_, args, context) {
        const product = await context.prisma.product.findUnique({
          where: { id: args.id },
        });
        return product;
      },
    }),
      t.field("categories", {
        type: list("String"),
        async resolve(_, __, context) {
          const uniqueByCategory = await context.prisma.product.groupBy({
            by: ["category"],
          });
          return uniqueByCategory.map(({ category }) => category);
        },
      });
  },
});
