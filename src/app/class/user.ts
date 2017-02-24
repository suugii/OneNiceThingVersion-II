export class User {
    constructor(
        public email: string = null,
        public username: string = null,
        public firstname: string = null,
        public lastname: string = null,
        public password: string = null,
        public location: string = null,
        public photoURL: string = null,
        public created_at: any = Date.now(),
        public updated_at: any = Date.now(),
    ) { }
}