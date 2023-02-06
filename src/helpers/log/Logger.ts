import fs from "fs";

export type TypeLogger = "debug" | "info" | "error";

export interface LoggerConfiguration {
    owner: string;
    path: string;
    filename?: string;
}

export class Logger {

    private static DEFAULT_CONFIGURATION: LoggerConfiguration = {
        path: "logs",
        owner: "DefaultLogger"
    }

    private configuration: LoggerConfiguration;

    private constructor(configuration?: Partial<LoggerConfiguration>) {
        const copy = {...Logger.DEFAULT_CONFIGURATION};

        this.configuration = Object.assign(copy, configuration);
    }

    static createLogger(owner: string) {
        return new Logger({ owner });
    }

    debug(message: string) {
        this.write("debug", message);
    }

    info(message: string) {
        this.write("info", message);
    }

    error(message: string) {
        this.write("error", message);
    }

    private write(type: TypeLogger, message: string): void {
        const textLine = this.getTextWrite(type, message);
        const path = this.getFilename(type);

        this.createPathIfNotExists();

        console[type](textLine);

        fs.appendFile(
            path,
            textLine.concat("\n"),
            (err) => {
                if (err)
                    console.error(`Error to write file '${path}'`, err)
            }
        );
    }

    private getTextWrite(type: TypeLogger, message: string) {
        const time = new Date().toJSON();
        return `[${time}][${type.toUpperCase()}][${this.configuration.owner}] - ${message}`;
    }

    private createPathIfNotExists() {
        if(fs.existsSync(`${this.path()}`)) return;

        fs.mkdirSync(`${this.path()}`, { recursive: true })
    }

    private getFilename(type: string): string {
        const filename = this.configuration.filename ?? type.toUpperCase();

        return `${this.path()}${filename}.log`;
    }

    private path() {
        return this.configuration.path.endsWith("/") ? this.configuration.path : this.configuration.path + "/"
    }
}