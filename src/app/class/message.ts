import { Thread } from './thread';
export class Message {
	constructor(
		public date: any = null,
		public name: string = null,
		public message: string = null,
		public thread = new Thread(),
	) { }
}