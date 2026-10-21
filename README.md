# OPR Planner

A small web app for planning weekly team meetings in the Production Solutions Department (OPR).

🔗 **Live:** [opr-planner.vercel.app](https://opr-planner.vercel.app)

*Upcoming meeting page*:

<img width="700" alt="" src="https://github.com/user-attachments/assets/ba6c749d-80d4-4dbd-89ae-0fe690f27540" />

## Why

Our weekly meetings include two recurring blocks — “Lifehacks” and “Code review”. Speakers for the next meeting are usually agreed on at the end of the current one, so it’s easy to forget who’s up next.

OPR Planner solves this: any employee can open the page at any time and see who is presenting in which block at the upcoming meeting.

The app is available to the whole department (~20 people).

## Features

- **Upcoming meeting page** — date, time and blocks of the nearest meeting with their participants
- **Admin page** (password-protected) — create a meeting, add blocks and pick participants from the employee list
- Form validation and responsive layout

## Tech stack

| Part | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, axios, react-select |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (cloud), `pg` driver |
| Deploy | Vercel (frontend and backend as separate services) |
| Tooling | ESLint, Prettier |

## Project structure

```
opr-planner/
├── frontend/
│   └── src/
│       ├── components/   # Header, PlannerBlock, AgendaCard
│       ├── pages/        # MeetingPage, AdminPage
│       ├── constants/    # block configuration
│       ├── types/        # shared TypeScript types
│       └── utils/        # date helpers
├── backend/
│   └── server.js         # Express API
└── vercel.json           # /api requests go to the backend, everything else to the React app
```

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/next-meeting` | Nearest upcoming meeting with blocks and participants |
| `GET` | `/api/employees` | List of employees |
| `POST` | `/api/meetings` | Create a meeting with blocks and participants |
| `POST` | `/api/auth` | Check admin password |

## Database

```
employees           (id, full_name)
meetings            (id, date, time)
meeting_blocks      (id, meeting_id → meetings, type, description)
block_participants  (block_id → meeting_blocks, employee_id → employees)
```

The upcoming meeting is fetched with a single query that aggregates blocks and participants into JSON (`json_agg` / `json_build_object`).

## Run locally

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=3000
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
ADMIN_PASSWORD=
```

```bash
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Author

**Sentyabrina Sulakova** — [GitHub](https://github.com/sulakova-s) · [Telegram](https://t.me/s_sulakova)
