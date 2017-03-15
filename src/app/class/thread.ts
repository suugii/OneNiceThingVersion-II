export class Thread {
	constructor(
		public user1name: string = null,
		public user2name: string = null,
		public imageURL: string = null,
		public userID: string = null,
		public senderPerson: string = null,
		public isRead: boolean = false,
		public receiverID: string = null,
		public lastMessage: string = null,
		public date: any = null,
	) {  }
}