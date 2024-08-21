-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;
