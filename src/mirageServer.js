import { createServer } from "miragejs";

// import { Octokit } from "octokit";

// Maybe useful:
// https://github.com/miragejs/examples/blob/master/react-typescript/src/mirage/index.ts

let daily2 = [
  {
    user: "Test user",
    project: "React timesheet",
    description: "Some changes were made here, need approval",
    date: 1627059118345,
    hours: 1,
    minutes: 14
  },
  {
    user: "Test user",
    project: "React timesheet",
    description: "More changes were made, things were broken, God's wrath was invoked",
    date: 1627059373810,
    hours: 2,
    minutes: 1
  }
]

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
        daily2,
        projects: [
          {
            name: 'React timesheet',
            contributors: [
              'adqn',
              'ksiondag'
            ]
          }
        ]
      }))

      this.post('/api/newentry', (schema, req) => {
        let attrs = JSON.parse(req.requestBody)
        attrs.user = "Test user"
        daily2.push(attrs)
        console.log(attrs)
      })

      this.passthrough('api.github.com')
    },
  });
}