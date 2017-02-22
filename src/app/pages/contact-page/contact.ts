export class Contact {
	constructor(
		public name: string = "",
		public email: string = "",
		public message: string = "",
		public created_at: any = Date.now(),
		public updated_at: any = Date.now(),
	) {  }
}