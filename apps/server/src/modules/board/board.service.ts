import {db, boards, boardMembers} from "@repo/db";
import {and, eq, ilike, desc} from "drizzle-orm";
import { randomBytes } from "crypto";


// create board logic
export async function createBoard(userId: string, title: string) {
  const [board] = await db.insert(boards).values({ title, ownerId: userId }).returning();

  if (!board) {
    throw new Error("Failed to create board");
  }

  await db.insert(boardMembers).values({ boardId: board.id, userId, role: "owner" });
  return board;
}

// export async function getBoardById(boardId: string) {
//   return db.query.boards.findFirst({ where: eq(boards.id, boardId) });
// }
export async function getBoardById(boardId: string) {
  const result = await db
    .select()
    .from(boards)
    .where(eq(boards.id, boardId))
    .limit(1);

  return result[0] ?? null;
}

// for rename board logic
export async function renameBoard(boardId: string, title: string) {
  const [board] = await db.update(boards).set({ title, updatedAt: new Date() })
    .where(eq(boards.id, boardId)).returning();
  return board;
}

// for delete board logic
export async function deleteBoard(boardId: string) {
  await db.delete(boards).where(eq(boards.id, boardId)); // cascades to members/objects/etc
}

// for list boards logic
export async function listBoards(userId: string, query?: string) {
  const whereClause = query
    ? and(eq(boardMembers.userId, userId), ilike(boards.title, `%${query}%`))
    : eq(boardMembers.userId, userId);

  return await db
    .select({
      id: boards.id,
      title: boards.title,
      ownerId: boards.ownerId,
      shareToken: boards.shareToken,
      visibility: boards.visibility,
      thumbnailUrl: boards.thumbnailUrl,
      createdAt: boards.createdAt,
      updatedAt: boards.updatedAt,
      role: boardMembers.role,
    })
    .from(boardMembers)
    .innerJoin(boards, eq(boardMembers.boardId, boards.id))
    .where(whereClause)
    .orderBy(desc(boardMembers.joinedAt));
}

// for generate share link logic
export async function generateShareLink(boardId: string) {
  const shareToken = randomBytes(8).toString("hex");
  await db.update(boards).set({ shareToken, visibility: "link-edit" }).where(eq(boards.id, boardId));
  return shareToken;
}

// for join board token logic
// export async function joinBoardByToken(shareToken: string, userId: string) {
//   const board = await db.query.boards.findFirst({ where: eq(boards.shareToken, shareToken) });
//   if (!board) throw new Error("Invalid share link");

//   const existing = await db.query.boardMembers.findFirst({
//     where: and(
//       eq(boardMembers.boardId, board.id),
//       eq(boardMembers.userId, userId),
//     ),
//   });

//   if (!existing) {
//     await db.insert(boardMembers).values({ boardId: board.id, userId, role: "editor" });
//   }
//   return board;
// }

export async function joinBoardByToken(shareToken: string, userId: string) {
  const boardRows = await db
    .select()
    .from(boards)
    .where(eq(boards.shareToken, shareToken))
    .limit(1);

  const board = boardRows[0];

  if (!board) {
    throw new Error("Invalid share link");
  }

  const existingRows = await db
    .select()
    .from(boardMembers)
    .where(
      and(
        eq(boardMembers.boardId, board.id),
        eq(boardMembers.userId, userId),
      ),
    )
    .limit(1);

  const existing = existingRows[0];

  if (!existing) {
    await db.insert(boardMembers).values({
      boardId: board.id,
      userId,
      role: "editor",
    });
  }

  return board;
}

