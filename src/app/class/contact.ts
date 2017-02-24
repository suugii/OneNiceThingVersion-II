export class Contact {
	constructor(
		public name: string = null,
		public email: string = null,
		public message: string = null,
		public created_at: any = Date.now(),
		public updated_at: any = Date.now(),
	) {  }
}