export function getEnv(key: string): string {
    const value = process.env[key];

    if(value) return value;

    throw new Error(`Env with key ${key} not found!`);
}