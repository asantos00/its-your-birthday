# Migration `20210206233921-change-birthdays-and-paids`

This migration has been generated by Alexandre Santos at 2/6/2021, 11:39:21 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."_BirthdayToContributor" (
"A" text  NOT NULL ,"B" text  NOT NULL )

CREATE TABLE "public"."_paidBy" (
"A" text  NOT NULL ,"B" integer  NOT NULL )

ALTER TABLE "public"."Birthday" ADD COLUMN "contributorEmail" text   ;

ALTER TABLE "public"."Contributor" DROP CONSTRAINT IF EXiSTS "Contributor_birthdayId_fkey",
DROP COLUMN "birthdayId",
DROP COLUMN "hasPaid";

CREATE UNIQUE INDEX "_BirthdayToContributor_AB_unique" ON "public"."_BirthdayToContributor"("A","B")

CREATE  INDEX "_BirthdayToContributor_B_index" ON "public"."_BirthdayToContributor"("B")

CREATE UNIQUE INDEX "_paidBy_AB_unique" ON "public"."_paidBy"("A","B")

CREATE  INDEX "_paidBy_B_index" ON "public"."_paidBy"("B")

ALTER TABLE "public"."_BirthdayToContributor" ADD FOREIGN KEY ("A")REFERENCES "public"."Birthday"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_BirthdayToContributor" ADD FOREIGN KEY ("B")REFERENCES "public"."Contributor"("email") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_paidBy" ADD FOREIGN KEY ("A")REFERENCES "public"."Contributor"("email") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_paidBy" ADD FOREIGN KEY ("B")REFERENCES "public"."Gift"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Birthday" ADD FOREIGN KEY ("contributorEmail")REFERENCES "public"."Contributor"("email") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Birthday" ADD FOREIGN KEY ("contributorEmail")REFERENCES "public"."Contributor"("email") ON DELETE SET NULL  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210206231708..20210206233921-change-birthdays-and-paids
--- datamodel.dml
+++ datamodel.dml
@@ -2,25 +2,25 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
   platform = ["debian-openssl-1.1.x", "native"]
 }
 model Contributor {
-  email         String    @id
+  email         String     @id
   name          String
-  hasPaid       Boolean   @default(false)
-  Birthday      Birthday? @relation(fields: [birthdayId], references: [id])
-  birthdayId    String?
-  suggestedGifs Gift[]    @relation("giftSuggestor")
-  upvotes       Gift[]    @relation("upvotedBy")
-  createdAt     DateTime  @default(now())
+  Birthday      Birthday[] @relation
+  paidBirthdays Birthday[] @relation("paidBirthdays")
+  suggestedGifs Gift[]     @relation("giftSuggestor")
+  upvotes       Gift[]     @relation("upvotedBy")
+  createdAt     DateTime   @default(now())
+  paid          Gift[]     @relation("paidBy")
 }
 model Gift {
   id          Int           @id @default(autoincrement())
@@ -30,14 +30,17 @@
   description String
   suggestor   Contributor?  @relation(name: "giftSuggestor", fields: [authorEmail], references: [email])
   authorEmail String?
   upvotedBy   Contributor[] @relation("upvotedBy")
+  paidBy      Contributor[] @relation("paidBy")
 }
 model Birthday {
-  id           String        @id @default(uuid())
-  createdAt    DateTime      @default(now())
-  date         DateTime?
-  person       String
-  gifts        Gift[]
-  contributors Contributor[]
+  id               String        @id @default(uuid())
+  createdAt        DateTime      @default(now())
+  date             DateTime?
+  person           String
+  gifts            Gift[]
+  contributorEmail String?
+  contributors     Contributor[] @relation(fields: [contributorEmail], references: [email])
+  Contributor      Contributor?  @relation("paidBirthdays", fields: [contributorEmail], references: [email])
 }
```


