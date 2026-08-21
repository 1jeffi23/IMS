ALTER TABLE "sale_item" ADD COLUMN "batch_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_batch_id_product_batch_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."product_batch"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_email_unique" UNIQUE("email");