export class Story {
	constructor(
		public user: string = null,
		public touser: string = null,
		public location: any = null,
		public story: string = null,
		public imageURL: string = null,
		public name: string = null,
		public feeling: string = null,
		public message: string = null,
		public privacy: number = null,
		public image64: string = null,
		public created_at: any = Date.now(),
		public updated_at: any = Date.now(),
	) {  }
}