import path from "path";

const vitestConfig = {
    resolve: {
        alias: {
            "@helpers": path.resolve("src/helpers"),
            "@libs": path.resolve("src/libs"),
            "@repositories": path.resolve("src/repositories"),
            "@services": path.resolve("src/services"),
            "@controllers": path.resolve("src/controllers"),
            "@plugins": path.resolve("src/plugins"),
            "@routes": path.resolve("src/routes"),
        }
    }
}

export default vitestConfig;