-- CreateEnum
CREATE TYPE "category" AS ENUM ('men', 'women', 'shoe', 'hat', 'jacket', 'shirt');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "category" NOT NULL DEFAULT E'men';
