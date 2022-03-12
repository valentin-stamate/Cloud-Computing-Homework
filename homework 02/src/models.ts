export interface Actor {
    id: number;

    name: string;
    age: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface Movie {
    id: number;

    title: string;
    year: string;
    genre: string;
    rating: number;

    createdAt: Date;
    updatedAt: Date;
}

export class ResponseMessage {
    constructor(public message: string) {}
}