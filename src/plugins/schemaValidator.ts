import type { Plugin } from "../core/pluginApi";

const schemaValidatorPlugin: Plugin = {
    id: "schema-validator",
    name: "Schema Validator",
    version: "1.0.0",
    register(ctx) {
        ctx.addValidator?.({
            id: "basic-schema",
            validate: (json) => ({
                valid: typeof json === "object" && json !== null,
                errors: typeof json === "object" && json !== null ? [] : ["Root must be an object"],
            }),
        });
    },
};

export default schemaValidatorPlugin;