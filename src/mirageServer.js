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

let projects2 = [
  {
    name: "test project 1",
    client: "moose",
    contributors: ["a duck"],
    tags: [
      "duck_approved",
      "fried_duck",
      "not_geese"
    ],
    segments: [
      {
        date: "2021-08-23",
        start: "10:17AM",
        end: "10:19AM",
        duration: "00:03:33",
        description: "made good soup"
      }
    ]
  },
  {
    name: "test project 2",
    client: "horse",
    contributors: ["a duck"],
    tags: [
      "duck_approved",
      "fried_duck",
      "not_geese"
    ],
    segments: [
      {
        date: "2021-08-23",
        start: "10:17AM",
        end: "10:19AM",
        duration: "00:03:33",
        description: "made good soup"
      }
    ]
  }
]
let templates = []

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
        ],
        projects2,
        templates
      }))

      this.post('/api/newentry', (schema, req) => {
        let attrs = JSON.parse(req.requestBody)
        attrs.user = "Test user"
        daily2.push(attrs)
        console.log(attrs)
      })

      this.post(`/api/savetemplate`, (schema, req) => {
        let attrs = JSON.parse(req.requestBody)
        templates.push(attrs)
      })

      this.passthrough('api.github.com')
    },
  });
}