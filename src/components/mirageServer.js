import { createServer } from "miragejs";

// Maybe useful:
// https://github.com/miragejs/examples/blob/master/react-typescript/src/mirage/index.ts
export function makeServer() {
    return createServer({    
        routes() {
            this.get("/api/test", () => ({
                stuff: [{thing: "This has stuff"}],
            }))          
        },
    });
}