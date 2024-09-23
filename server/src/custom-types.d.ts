interface AuthUser {
    id: number;
    email: string;
    role: string;

}


declare namespace Express { 
    export interface Request {
        user?: AuthUser;
    }
}
