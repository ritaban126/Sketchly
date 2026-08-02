import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id
		}),
	},
	user: {
		accounts: r.many.account(),
		boardsViaBoardHistory: r.many.boards({
			alias: "boards_id_user_id_via_boardHistory"
		}),
		boardsViaBoardMembers: r.many.boards({
			alias: "boards_id_user_id_via_boardMembers"
		}),
		boardsOwnerId: r.many.boards({
			alias: "boards_ownerId_user_id"
		}),
		boardsViaDrawingObjects: r.many.boards({
			from: r.user.id.through(r.drawingObjects.authorId),
			to: r.boards.id.through(r.drawingObjects.boardId),
			alias: "user_id_boards_id_via_drawingObjects"
		}),
		boardsViaNotifications: r.many.boards({
			alias: "boards_id_user_id_via_notifications"
		}),
		sessions: r.many.session(),
		boardsViaUploadedFiles: r.many.boards({
			alias: "boards_id_user_id_via_uploadedFiles"
		}),
	},
	boards: {
		usersViaBoardHistory: r.many.user({
			from: r.boards.id.through(r.boardHistory.boardId),
			to: r.user.id.through(r.boardHistory.createdBy),
			alias: "boards_id_user_id_via_boardHistory"
		}),
		usersViaBoardMembers: r.many.user({
			from: r.boards.id.through(r.boardMembers.boardId),
			to: r.user.id.through(r.boardMembers.userId),
			alias: "boards_id_user_id_via_boardMembers"
		}),
		user: r.one.user({
			from: r.boards.ownerId,
			to: r.user.id,
			alias: "boards_ownerId_user_id"
		}),
		usersViaDrawingObjects: r.many.user({
			alias: "user_id_boards_id_via_drawingObjects"
		}),
		usersViaNotifications: r.many.user({
			from: r.boards.id.through(r.notifications.boardId),
			to: r.user.id.through(r.notifications.userId),
			alias: "boards_id_user_id_via_notifications"
		}),
		usersViaUploadedFiles: r.many.user({
			from: r.boards.id.through(r.uploadedFiles.boardId),
			to: r.user.id.through(r.uploadedFiles.uploadedBy),
			alias: "boards_id_user_id_via_uploadedFiles"
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id
		}),
	},
}))