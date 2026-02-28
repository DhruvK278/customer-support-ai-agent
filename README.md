# 🤖 Customer Support AI Agent

An AI-powered customer support resolution platform that automatically triages customer complaints and recommends the best resolution using a fine-tuned LLM (Llama 3.1 via Together AI), backed by AWS DynamoDB.
---

## ✨ Features

- **AI-driven resolution** — Submits customer complaints to Llama 3.1 (via Together AI) which returns a structured resolution, description, and confidence score
- **8 issue categories** — Product Defects, Quality Issues, Incorrect Item, Service Issues, Product Not as Described, Price Issues, Packaging Issues, Functionality Problems
- **9 resolution types** — Refund, Replacement, Repair, Discount, Apology, Return, Exchange, Compensation, Service Enhancement
- **Ticket history** — All past resolutions are stored in AWS DynamoDB and displayed in a live feed
- **Rate limiting** — Max 100 AI agent invocations per day
- **Premium dark UI** — Glassmorphism design with purple accent, animated confidence bar, and color-coded resolution badges

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| AI Model | Meta Llama 3.1 8B Instruct (via [Together AI](https://www.together.ai)) |
| Database | AWS DynamoDB |
| Deployment | Vercel (frontend) |

---

## 📁 Project Structure

```
customer-support-ai-agent/
├── agent-ui/               # Next.js frontend (port 3700)
│   ├── app/
│   │   ├── page.tsx        # Main dashboard — order card + AI actions feed
│   │   ├── layout.tsx      # Root layout with font & global modals
│   │   └── globals.css     # Dark theme, glassmorphism utilities, animations
│   ├── components/
│   │   ├── CustomerSupport.tsx  # Support request modal with form
│   │   └── ViewTickets.tsx      # Ticket detail modal with confidence bar
│   └── utils/
│       ├── instance.ts     # Axios instance configured for the backend
│       └── store.ts        # Zustand global state (modal visibility)
│
├── agent_backend/          # Express.js API (port 9000)
│   ├── index.js            # Entry point, CORS, middleware setup
│   └── src/
│       ├── route.js        # API routes
│       ├── controller.js   # DynamoDB CRUD + rate limiting logic
│       └── agent.js        # Together AI LLM call + system prompt
│
└── scripts/                # Dataset generation & fine-tuning utilities
    ├── aidatasetgen.py
    └── customer_complaints.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Together AI](https://www.together.ai) API key
- An AWS account with a DynamoDB table

### 1. Clone the repo

```bash
git clone https://github.com/DhruvK278/customer-support-ai-agent.git
cd customer-support-ai-agent
```

### 2. Set up the Backend

```bash
cd agent_backend
npm install
```

Create a `.env` file inside `agent_backend/`:

```env
TOGETHER_API_KEY=your_together_ai_api_key

AWS_REGION_1=us-east-1
AWS_ACCESS_KEY_1=your_aws_access_key
AWS_SECRET_KEY_1=your_aws_secret_key
DYNAMODB_TABLE_NAME=your_dynamodb_table_name
```

Start the backend:

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

The API will run on **http://localhost:9000**

### 3. Set up the Frontend

```bash
cd agent-ui
npm install
npm run dev
```

The UI will run on **https://localhost:3700**

> ⚠️ The frontend uses local HTTPS certificates (`localhost.pem` / `localhost-key.pem`). Use `https://` in your browser.

---

## 🔌 API Reference

Base URL: `http://localhost:9000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/list` | Fetch all past support tickets |
| `POST` | `/create` | Submit a new complaint → AI generates resolution |
| `GET` | `/run/:id` | Get details of a specific ticket |

### POST `/create` — Request Body

```json
{
  "customer_name": "Sample User",
  "customer_email": "user@example.com",
  "issue": "Product Defects",
  "issue_description": "The keyboard stopped working after 2 days."
}
```

### POST `/create` — Response

```json
{
  "id": "742",
  "customer_name": "Sample User",
  "customer_email": "user@example.com",
  "issue": "Product Defects",
  "issue_description": "The keyboard stopped working after 2 days.",
  "resolution": "Replacement",
  "resolution_description": "Send a replacement unit to the customer within 3-5 business days.",
  "confidence_score": 92,
  "date": "2024-10-12T10:30:00.000Z"
}
```

---

## 🧠 How the AI Agent Works

1. Customer submits an issue category + description via the UI
2. The backend sends the issue to **Llama 3.1 8B Instruct** with a system prompt that defines the 8 issue categories and 9 resolution options
3. The model returns a structured JSON response with `resolution`, `resolution_description`, and `confidence_score`
4. The result is saved to DynamoDB and displayed back to the customer in real time

---

## 📸 Screenshots

> The UI uses a **premium dark theme** with glassmorphism cards, a purple accent system, color-coded resolution badges, and an animated confidence score bar.

---

## 📄 License

MIT
