export class Story {
	constructor(
		public user: string = null,
		public location: string = null,
		public story: string = null,
		public name: string = null,
		public feeling: string = null,
		public message: string = null,
		public privacy: number = null,
		public created_at: any = Date.now(),
		public updated_at: any = Date.now(),
	) {  }
}