import { createServer } from "miragejs";

// Maybe useful:
// https://github.com/miragejs/examples/blob/master/react-typescript/src/mirage/index.ts

export function makeServer() {
  return createServer({
    routes() {
      this.get("/api/test", () => ({
        stuff: [{ thing: "This has stuff" }],
        daily: [
          {
            user: "Test User",
            project: "React timesheet",
            progress: "1%",
            date: "7-7-2021"
          },
          {
            user: "Test User",
            project: "React timesheet",
            progress: "1.4%",
            date: "7-8-2021"
          },
          {
            user: "Test User",
            project: "React timesheet",
            progress: "1.6%",
            date: "7-9-2021"
          }
        ]
      }))
    },
  });
}