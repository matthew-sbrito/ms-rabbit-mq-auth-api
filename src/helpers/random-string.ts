const ALL_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ALL_CHARACTERS_LENGTH = ALL_CHARACTERS.length;

export function randomString(length: number = 20) {
    let result = '';

    while (result.length < length) {
        const randomNumber = Math.floor(Math.random() * ALL_CHARACTERS_LENGTH);
        result += ALL_CHARACTERS[randomNumber];
    }

    return result;
}