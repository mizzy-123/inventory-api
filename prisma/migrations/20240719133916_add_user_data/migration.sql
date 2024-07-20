-- CreateTable
CREATE TABLE "user_data" (
    "id" BIGSERIAL NOT NULL,
    "foto" TEXT NOT NULL,
    "users_id" TEXT NOT NULL,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_users_id_key" ON "user_data"("users_id");

-- AddForeignKey
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
