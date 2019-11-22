export interface User {
    user_id: string,
    username: string
}

export interface Country {
    name: string,
    code: string
}

export interface Song {
    title: string,
    country_code: string,
    name: string,
    lyrics?: string,
    slot: number,
    checked_out: number
}
