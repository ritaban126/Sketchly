-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "board_role" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "board_visibility" AS ENUM('private', 'link-view', 'link-edit');--> statement-breakpoint
CREATE TYPE "drawing_type" AS ENUM('pen', 'rectangle', 'circle', 'line', 'arrow', 'text', 'image');--> statement-breakpoint
CREATE TYPE "file_status" AS ENUM('processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "file_type" AS ENUM('image', 'pdf', 'export-png', 'export-pdf');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('user-joined', 'user-left', 'export-ready', 'file-ready');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"board_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"board_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "board_role" DEFAULT 'viewer'::"board_role" NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"owner_id" text NOT NULL,
	"share_token" varchar(255) CONSTRAINT "boards_share_token_key" UNIQUE,
	"visibility" "board_visibility" DEFAULT 'private'::"board_visibility" NOT NULL,
	"thumbnail_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drawing_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"board_id" uuid NOT NULL,
	"author_id" text NOT NULL,
	"type" "drawing_type" NOT NULL,
	"data" jsonb NOT NULL,
	"z_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"board_id" uuid,
	"type" "notification_type" NOT NULL,
	"payload" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL CONSTRAINT "session_token_key" UNIQUE,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"board_id" uuid,
	"uploaded_by" text NOT NULL,
	"type" "file_type" NOT NULL,
	"url" varchar(1000) NOT NULL,
	"status" "file_status" DEFAULT 'processing'::"file_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL CONSTRAINT "user_email_key" UNIQUE,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "board_history" ADD CONSTRAINT "board_history_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "board_history" ADD CONSTRAINT "board_history_created_by_user_id_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_owner_id_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drawing_objects" ADD CONSTRAINT "drawing_objects_author_id_user_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "drawing_objects" ADD CONSTRAINT "drawing_objects_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id");
*/