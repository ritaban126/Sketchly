import { pgTable,text,timestamp,boolean, pgEnum, uuid, varchar, jsonb, integer } from "drizzle-orm/pg-core";

// for user signup/signin
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// for boards
export const boardVisibilityEnum = pgEnum("board_visibility", ["private", "link-view", "link-edit"]);
export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  shareToken: varchar("share_token", { length: 255 }).unique(),
  visibility: boardVisibilityEnum("visibility").default("private").notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// for board members
export const boardRoleEnum = pgEnum("board_role", ["owner", "editor", "viewer"]);
export const boardMembers = pgTable("board_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: boardRoleEnum("role").default("viewer").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// for Drawing objects
export const drawingTypeEnum = pgEnum("drawing_type", [
  "pen", "rectangle", "circle", "line", "arrow", "text", "image",
]);
export const drawingObjects = pgTable("drawing_objects", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => user.id),
  type: drawingTypeEnum("type").notNull(),
  data: jsonb("data").notNull(),
  zIndex: integer("z_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// board history
export const boardHistory = pgTable("board_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
  snapshot: jsonb("snapshot").notNull(),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Upload files
export const fileTypeEnum = pgEnum("file_type", ["image", "pdf", "export-png", "export-pdf"]);
export const fileStatusEnum = pgEnum("file_status", ["processing", "ready", "failed"]);
export const uploadedFiles = pgTable("uploaded_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").references(() => boards.id, { onDelete: "cascade" }),
  uploadedBy: text("uploaded_by").notNull().references(() => user.id),
  type: fileTypeEnum("type").notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  status: fileStatusEnum("status").default("processing").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// for notifications
export const notificationTypeEnum = pgEnum("notification_type", [
  "user-joined", "user-left", "export-ready", "file-ready",
]);
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  boardId: uuid("board_id").references(() => boards.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  payload: jsonb("payload"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});





