export class Story {
	constructor(
		public user: string = "",
		public location: string = "",
		public story: string = "",
		public name: string = "",
		public feel: string = "",
		public message: string = "",
		public privacy: number = 1,
		public created_at: any = Date.now(),
		public updated_at: any = Date.now(),
	) {  }
}