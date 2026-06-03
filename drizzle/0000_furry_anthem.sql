CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"original_url" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_slug_unique" UNIQUE("slug")
);
