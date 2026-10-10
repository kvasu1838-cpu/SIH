from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import sqlite3
import json

BASE = Path(__file__).resolve().parent
DB = BASE / "app.db"
SEED = BASE / "seed.json"

app = FastAPI(title="VocaAI SIH Prototype")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    connection = sqlite3.connect(DB)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():

    connection = get_db()

    connection.executescript("""
    CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY,
        trade_name TEXT,
        category TEXT,
        description TEXT,
        required_education TEXT,
        training_duration TEXT,
        sample_earning_range TEXT,
        placement_rate TEXT,
        job_roles TEXT,
        career_growth TEXT,
        further_education TEXT,
        local_demand TEXT,
        interests TEXT
    );

    CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        contact TEXT,
        language TEXT,
        concern TEXT,
        preferred_time TEXT,
        message TEXT,
        status TEXT DEFAULT 'Pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language TEXT,
        concerns TEXT,
        location TEXT,
        selected_trade TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    count = connection.execute(
        "SELECT COUNT(*) AS count FROM trades"
    ).fetchone()["count"]

    if count == 0:

        data = json.loads(
            SEED.read_text(encoding="utf-8")
        )

        for trade in data:

            connection.execute(
                """
                INSERT INTO trades
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    trade["id"],
                    trade["trade_name"],
                    trade["category"],
                    trade["description"],
                    trade["required_education"],
                    trade["training_duration"],
                    trade["sample_earning_range"],
                    trade["placement_rate"],
                    json.dumps(trade["job_roles"]),
                    json.dumps(trade["career_growth"]),
                    json.dumps(trade["further_education"]),
                    trade["local_demand"],
                    json.dumps(trade["interests"])
                )
            )

    connection.commit()
    connection.close()


def convert_trade(row):

    data = dict(row)

    data["job_roles"] = json.loads(data["job_roles"])
    data["career_growth"] = json.loads(data["career_growth"])
    data["further_education"] = json.loads(
        data["further_education"]
    )
    data["interests"] = json.loads(data["interests"])

    return data


@app.on_event("startup")
def startup():

    initialize_database()


@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "demo_mode": True
    }


@app.get("/api/trades")
def get_trades():

    connection = get_db()

    rows = connection.execute(
        "SELECT * FROM trades ORDER BY trade_name"
    ).fetchall()

    connection.close()

    return [
        convert_trade(row)
        for row in rows
    ]


@app.get("/api/trades/{trade_id}")
def get_trade(trade_id: int):

    connection = get_db()

    row = connection.execute(
        "SELECT * FROM trades WHERE id = ?",
        (trade_id,)
    ).fetchone()

    connection.close()

    if not row:
        return {
            "error": "Trade not found"
        }

    return convert_trade(row)


class RecommendationRequest(BaseModel):

    education: str = "12th"
    location: str = "Maharashtra"
    interests: list[str] = []
    career_goal: str = "Stable employment"
    concerns: list[str] = []


@app.post("/api/recommendations")
def recommendations(data: RecommendationRequest):

    connection = get_db()

    rows = connection.execute(
        "SELECT * FROM trades"
    ).fetchall()

    connection.close()

    selected_interests = {
        item.lower()
        for item in data.interests
    }

    results = []

    for row in rows:

        trade = convert_trade(row)

        trade_interests = {
            item.lower()
            for item in trade["interests"]
        }

        interest_match = len(
            selected_interests.intersection(
                trade_interests
            )
        )

        score = 55

        score += interest_match * 10

        if "12th" in trade[
            "required_education"
        ].lower():

            score += 5

        concerns = " ".join(
            data.concerns
        ).lower()

        if (
            "security" in concerns
            and trade["local_demand"]
            in ["High", "Very High"]
        ):

            score += 5

        score = min(score, 98)

        trade["score"] = score

        trade["why"] = []

        if interest_match:

            trade["why"].append(
                "Matches your selected interests"
            )

        trade["why"].append(
            "Has a defined career progression pathway"
        )

        results.append(trade)

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results[:5]


class ChatRequest(BaseModel):

    message: str
    language: str = "en"
    selected_trade: str | None = None


@app.post("/api/chat")
def chat(data: ChatRequest):

    connection = get_db()

    trade = None

    if data.selected_trade:

        row = connection.execute(
            """
            SELECT *
            FROM trades
            WHERE lower(trade_name) = lower(?)
            """,
            (data.selected_trade,)
        ).fetchone()

        if row:
            trade = convert_trade(row)

    if not trade:

        rows = connection.execute(
            "SELECT * FROM trades"
        ).fetchall()

        for row in rows:

            if (
                row["trade_name"].lower()
                in data.message.lower()
            ):

                trade = convert_trade(row)
                break

    connection.close()

    message = data.message.lower()

    telugu = data.language == "te"

    if any(
        keyword in message
        for keyword in [
            "salary",
            "earning",
            "income",
            "జీతం"
        ]
    ):

        if trade:

            if telugu:

                answer = (
                    f"{trade['trade_name']} కోసం "
                    f"prototype sample earning range "
                    f"{trade['sample_earning_range']}. "
                    "ఇది హామీ చేసిన జీతం కాదు."
                )

            else:

                answer = (
                    f"The prototype sample earning range "
                    f"for {trade['trade_name']} is "
                    f"{trade['sample_earning_range']}. "
                    "This is illustrative and not a "
                    "salary guarantee."
                )

        else:

            answer = (
                "Please select a trade to view "
                "its illustrative earning range."
            )

    elif any(
        keyword in message
        for keyword in [
            "job",
            "employment",
            "placement",
            "ఉద్యోగ"
        ]
    ):

        if trade:

            answer = (
                f"{trade['trade_name']} has a prototype "
                f"placement indicator of "
                f"{trade['placement_rate']}. "
                "Actual outcomes depend on the "
                "training provider, location and skills."
            )

        else:

            answer = (
                "Employment outcomes should be checked "
                "against verified local provider data."
            )

    elif any(
        keyword in message
        for keyword in [
            "growth",
            "career",
            "future"
        ]
    ):

        if trade:

            answer = (
                "Career path: "
                + " → ".join(
                    trade["career_growth"]
                )
            )

        else:

            answer = (
                "Training → Entry Role → "
                "Experience → Advanced Skill → "
                "Senior Role"
            )

    elif any(
        keyword in message
        for keyword in [
            "study",
            "education",
            "చదువు"
        ]
    ):

        if trade:

            answer = (
                "Further education: "
                + ", ".join(
                    trade["further_education"]
                )
            )

        else:

            answer = (
                "Each trade includes "
                "further education options."
            )

    else:

        if telugu:

            answer = (
                "నేను salary, jobs, career growth, "
                "safety మరియు further education "
                "గురించి వివరించగలను."
            )

        else:

            answer = (
                "I can help with salary, jobs, "
                "career growth, safety, further "
                "education and trade selection."
            )

    return {
        "answer": answer,
        "mode": "demo",
        "source": "Prototype vocational knowledge base"
    }


class CounsellorRequest(BaseModel):

    name: str
    contact: str
    language: str
    concern: str
    preferred_time: str
    message: str


@app.post("/api/counsellor/request")
def counsellor_request(
    data: CounsellorRequest
):

    connection = get_db()

    connection.execute(
        """
        INSERT INTO requests
        (
            name,
            contact,
            language,
            concern,
            preferred_time,
            message
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            data.name,
            data.contact,
            data.language,
            data.concern,
            data.preferred_time,
            data.message
        )
    )

    connection.commit()

    request_id = connection.execute(
        "SELECT last_insert_rowid()"
    ).fetchone()[0]

    connection.close()

    return {
        "success": True,
        "id": request_id,
        "status": "Pending"
    }


@app.get("/api/admin/analytics")
def admin_analytics():

    connection = get_db()

    request_count = connection.execute(
        "SELECT COUNT(*) AS n FROM requests"
    ).fetchone()["n"]

    pending_count = connection.execute(
        """
        SELECT COUNT(*) AS n
        FROM requests
        WHERE status = 'Pending'
        """
    ).fetchone()["n"]

    session_count = connection.execute(
        "SELECT COUNT(*) AS n FROM sessions"
    ).fetchone()["n"]

    concerns = []

    rows = connection.execute(
        """
        SELECT concern, COUNT(*) AS n
        FROM requests
        GROUP BY concern
        """
    ).fetchall()

    for row in rows:

        concerns.append(
            {
                "name": row["concern"],
                "value": row["n"]
            }
        )

    requests = [
        dict(row)
        for row in connection.execute(
            """
            SELECT *
            FROM requests
            ORDER BY id DESC
            LIMIT 20
            """
        ).fetchall()
    ]

    connection.close()

    return {
        "total_users": 0,
        "sessions": session_count,
        "counsellor_requests": request_count,
        "pending_requests": pending_count,
        "concerns": concerns,
        "requests": requests
    }


@app.post("/api/session")
def create_session(data: dict):

    connection = get_db()

    connection.execute(
        """
        INSERT INTO sessions
        (
            language,
            concerns,
            location,
            selected_trade
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            data.get("language", "en"),
            json.dumps(
                data.get("concerns", [])
            ),
            data.get(
                "location",
                ""
            ),
            data.get(
                "selected_trade",
                ""
            )
        )
    )

    connection.commit()
    connection.close()

    return {
        "success": True
    }