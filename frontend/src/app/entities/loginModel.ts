export class LoginModel {
    public username: string;
    public password: string;
    public registercode?: string;

    constructor() {
        this.username = '';
        this.password = '';
        this.registercode = '';
    }
}
