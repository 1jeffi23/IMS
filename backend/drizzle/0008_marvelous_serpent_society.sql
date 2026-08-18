CREATE TABLE "product_batch" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"batch_number" varchar(100) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"cost_price" numeric(10, 2) NOT NULL,
	"received_date" date NOT NULL,
	"expiry_date" date,
	"storage_location" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_batch_unique" UNIQUE("product_id","batch_number")
);
--> statement-breakpoint
ALTER TABLE "product_batch" ADD CONSTRAINT "product_batch_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;