export class User {
    constructor(
        public username: string = "",
        public firstname: string = "",
        public lastname: string = "",
        public location: string = "",
        public email: string = "",
        public password: string = "",
        public created_at: any = Date.now(),
        public updated_at: any = Date.now(),
    ) { }
}