import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { extendType, nonNull, objectType, stringArg } from "nexus";

const APPSECRET: string = process.env.APPSECRET as string;

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const authMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("logIn", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, context) {
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        });

        if (!user) {
          throw new Error("No Such User!");
        }

        const valid = await compare(args.password, user.password);

        if (!valid) {
          throw new Error("Password is incorrect!");
        }

        const token = sign({ userId: user.id }, APPSECRET);

        return {
          token,
          user,
        };
      },
    });
    t.nonNull.field("signUp", {
      type: "AuthPayload",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, context) {
        const hashedpassword = await hash(args.password, 10);

        const user = await context.prisma.user.create({
          data: {
            ...args,
            password: hashedpassword,
          },
        });

        const token = sign({ userId: user.id }, APPSECRET);

        return {
          token,
          user: user,
        };
      },
    });
  },
});
