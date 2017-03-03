import { Thread } from './thread';
export class Message {
	constructor(
		public id: string = null,
		public date: any = null,
		public isRead: boolean = false,
		public name: string = null,
		public message: string = null,
		public senderID: string = null,
		public receiverID: string = null,
		public thread = new Thread(),
	) { }
}