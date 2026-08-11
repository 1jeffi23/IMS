CREATE TABLE "product_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"batch_number" varchar(100) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"cost_price" numeric(10, 2) NOT NULL,
	"received_date" date NOT NULL,
	"expiry_date" date,
	"storage_location" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_batches" ADD CONSTRAINT "product_batches_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "cost_price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "storage_location";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "expiry_date";