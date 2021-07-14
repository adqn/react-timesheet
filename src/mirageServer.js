import { createServer } from "miragejs";

// import { Octokit } from "octokit";

// Maybe useful:
// https://github.com/miragejs/examples/blob/master/react-typescript/src/mirage/index.ts

export function makeServer() {
  // return {};
  return createServer({
    routes() {
      this.get("/api/test", () => ({
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
        ],
        projects: [
          {
            name: 'react-timesheet',
            contributors: [
              'adqn',
              'ksiondag'
            ]
          }
        ]
      }))

      this.passthrough('api.github.com')
    },
  });
}