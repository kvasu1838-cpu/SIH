const API =
    "http://127.0.0.1:8000/api";

let trades = [];

let profile =
    JSON.parse(
        localStorage.profile ||
        '{"education":"12th","location":"Maharashtra","interests":[],"concerns":[]}'
    );

let lang =
    localStorage.lang || "en";

const app =
    document.getElementById("app");


const translations = {

    en: {

        hero:
            "Make Career Decisions Together.",

        sub:
            "AI-powered vocational career counselling for students and families.",

        start:
            "Start Career Assessment",

        parent:
            "Parent Counselling"
    },

    te: {

        hero:
            "కెరీర్ నిర్ణయాలను కలిసి తీసుకోండి.",

        sub:
            "విద్యార్థులు మరియు కుటుంబాల కోసం AI ఆధారిత వృత్తి మార్గదర్శకం.",

        start:
            "కెరీర్ అసెస్‌మెంట్ ప్రారంభించండి",

        parent:
            "తల్లిదండ్రుల కౌన్సెలింగ్"
    },

    hi: {

        hero:
            "करियर के फैसले साथ मिलकर लें।",

        sub:
            "छात्रों और परिवारों के लिए AI आधारित व्यावसायिक करियर मार्गदर्शन।",

        start:
            "करियर असेसमेंट शुरू करें",

        parent:
            "अभिभावक काउंसलिंग"
    },

    mr: {

        hero:
            "करिअरचे निर्णय एकत्र घ्या.",

        sub:
            "विद्यार्थी आणि कुटुंबांसाठी AI आधारित व्यावसायिक करिअर मार्गदर्शन.",

        start:
            "करिअर असेसमेंट सुरू करा",

        parent:
            "पालक समुपदेशन"
    }
};


document.getElementById("lang")
    .value = lang;


document.getElementById("lang")
    .onchange = function (event) {

        lang =
            event.target.value;

        localStorage.lang =
            lang;

        render();
    };


async function loadTrades() {

    try {

        trades =
            await fetch(
                API + "/trades"
            ).then(
                response =>
                    response.json()
            );

    } catch (error) {

        console.error(
            "Backend unavailable:",
            error
        );

    }

    render();
}


function go(page) {

    location.hash =
        page;
}


function render() {

    let page =
        location.hash.slice(1);

    if (!page) {

        page = "home";
    }


    if (
        page.startsWith(
            "trade-"
        )
    ) {

        trade(
            Number(
                page.split("-")[1]
            )
        );

        return;
    }


    const pages = {

        home,

        assessment,

        counsellor,

        recommendations,

        compare,

        admin
    };


    if (pages[page]) {

        pages[page]();

    } else {

        home();
    }
}


function home() {

    const text =
        translations[lang];


    app.innerHTML = `

    <section class="hero">

        <div>

            <span class="pill">
                 AI + DATA + FAMILY
            </span>

            <h1>
                ${text.hero}
            </h1>

            <p>
                ${text.sub}
            </p>

            <div class="actions">

                <button
                    class="btn primary"
                    onclick="go('assessment')"
                >
                    ${text.start} →
                </button>

                <button
                    class="btn"
                    onclick="go('counsellor')"
                >
                    ${text.parent}
                </button>

            </div>

            <div class="stats">

                <div>
                    <b>15+</b>
                    <small>Trades</small>
                </div>

                <div>
                    <b>4</b>
                    <small>Languages</small>
                </div>

                <div>
                    <b>24/7</b>
                    <small>Demo AI</small>
                </div>

            </div>

        </div>


        <div class="heroCard">

            <div class="orb">
                AI
            </div>

            <h2>
                Family Career Copilot
            </h2>

            <p>
                Understand interests →
                address parent concerns →
                compare options →
                make an informed decision.
            </p>

        </div>

    </section>


    <section class="section">

        <h2>
            Why This Platform?
        </h2>

        <div class="grid">

            ${[
                "AI Counselling",
                "Verified-data architecture",
                "Regional languages",
                "Family decision support",
                "Career pathways",
                "Human escalation"
            ].map(
                (item, index) => `

                <div class="card">

                    <h3>
                        ${
                            [
                                "🤖",
                                "🛡️",
                                "🌐",
                                "👨‍👩‍👧",
                                "📈",
                                "☎️"
                            ][index]
                        }

                        ${item}

                    </h3>

                    <p class="muted">

                        ${
                            [
                                "Conversational support for student and parent questions.",
                                "Ground responses in structured vocational outcomes.",
                                "English, Telugu, Hindi and Marathi UI.",
                                "Captures parental concerns directly.",
                                "Shows jobs, progression and further learning.",
                                "Unresolved cases can be sent to a counsellor."
                            ][index]
                        }

                    </p>

                </div>

            `
            ).join("")}

        </div>

    </section>


    <section class="section">

        <h2>
            How It Works
        </h2>

        <div class="steps">

            ${
                [
                    "Profile",
                    "Concerns",
                    "AI Counselling",
                    "Recommendations",
                    "Compare & Decide"
                ].map(
                    (item, index) => `

                    <div class="step">

                        <b>
                            0${index + 1}
                        </b>

                        <p>
                            ${item}
                        </p>

                    </div>

                `
                ).join("")
            }

        </div>

    </section>

    `;
}


function assessment() {

    const interests = [

        "Technology",
        "Electronics",
        "Automobile",
        "Healthcare",
        "Construction",
        "Agriculture",
        "Hospitality",
        "Retail",
        "Beauty & Wellness",
        "Electrical",
        "Manufacturing"
    ];


    const concerns = [

        "Salary",
        "Job security",
        "Career growth",
        "Safety",
        "Social status",
        "Further education",
        "Training quality",
        "Local job availability"
    ];


    app.innerHTML = `

    <section class="page">

        <span class="pill">
            STEP 1/3
        </span>

        <h1>
            Student + Family Assessment
        </h1>


        <div class="card form">

            <label class="field">

                Name

                <input
                    id="name"
                    value="${profile.name || ""}"
                >

            </label>


            <div class="two">

                <label class="field">

                    Age

                    <input
                        id="age"
                        type="number"
                        value="${profile.age || 18}"
                    >

                </label>


                <label class="field">

                    Education

                    <select id="edu">

                        <option>10th</option>

                        <option selected>
                            12th
                        </option>

                        <option>
                            ITI
                        </option>

                        <option>
                            Diploma
                        </option>

                        <option>
                            Graduate
                        </option>

                    </select>

                </label>

            </div>


            <label class="field">

                Location

                <input
                    id="loc"
                    value="${
                        profile.location ||
                        "Maharashtra"
                    }"
                >

            </label>


            <h2>
                Interests
            </h2>


            <div class="tags">

                ${
                    interests.map(
                        item => `

                        <button
                            class="tag ${
                                profile.interests?.includes(item)
                                    ? "on"
                                    : ""
                            }"
                        >
                            ${item}
                        </button>

                    `
                    ).join("")
                }

            </div>


            <h2>
                Parent Concerns
            </h2>


            <div class="tags">

                ${
                    concerns.map(
                        item => `

                        <button
                            class="tag ${
                                profile.concerns?.includes(item)
                                    ? "on"
                                    : ""
                            }"
                        >
                            ${item}
                        </button>

                    `
                    ).join("")
                }

            </div>


            <div class="actionsRight">

                <button
                    class="btn primary"
                    onclick="saveAssessment()"
                >
                    Get Recommendations →
                </button>

            </div>

        </div>

    </section>

    `;


    document
        .querySelectorAll(".tag")
        .forEach(
            button => {

                button.onclick =
                    () => {

                        button.classList.toggle(
                            "on"
                        );

                    };

            }
        );
}


function saveAssessment() {

    const selected =
        [
            ...document.querySelectorAll(
                ".tag.on"
            )
        ];


    profile = {

        ...profile,

        name:
            document.getElementById(
                "name"
            ).value,

        age:
            Number(
                document.getElementById(
                    "age"
                ).value
            ),

        education:
            document.getElementById(
                "edu"
            ).value,

        location:
            document.getElementById(
                "loc"
            ).value,

        interests:
            selected
                .map(
                    button =>
                        button.textContent.trim()
                ),

        concerns:
            selected
                .map(
                    button =>
                        button.textContent.trim()
                )
    };


    localStorage.profile =
        JSON.stringify(profile);


    go(
        "recommendations"
    );
}


async function recommendations() {

    const response =
        await fetch(
            API + "/recommendations",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(profile)

            }
        );


    const results =
        await response.json();


    app.innerHTML = `

    <section class="page">

        <span class="pill">
            AI MATCH
        </span>

        <h1>
            Your Recommendations
        </h1>

        <p class="muted">
            Suitability signals only —
            not employment guarantees.
        </p>


        <div class="recgrid">

            ${
                results.map(
                    (trade, index) => `

                    <div class="card">

                        <span class="pill">
                            #${index + 1}
                            •
                            ${trade.category}
                        </span>

                        <h2>
                            ${trade.trade_name}
                        </h2>

                        <p>
                            ${trade.description}
                        </p>

                        <div class="score">

                            ${trade.score}%

                            <small>
                                match
                            </small>

                        </div>


                        <div class="why">

                            ${trade.why
                                .map(
                                    reason =>
                                        `✓ ${reason}`
                                )
                                .join("<br>")}

                        </div>


                        <button
                            class="btn primary"
                            onclick="
                                go(
                                    'trade-${trade.id}'
                                )
                            "
                        >
                            View Career
                        </button>

                    </div>

                `
                ).join("")
            }

        </div>

    </section>

    `;
}


async function trade(id) {

    const response =
        await fetch(
            API + "/trades/" + id
        );


    const trade =
        await response.json();


    app.innerHTML = `

    <section class="page">

        <span
            class="back"
            onclick="history.back()"
        >
            ← Back
        </span>


        <div class="detailTop">

            <div>

                <span class="pill">
                    ${trade.category}
                </span>

                <h1>
                    ${trade.trade_name}
                </h1>

                <p class="muted">
                    ${trade.description}
                </p>

            </div>


            <div class="card">

                <b class="score">
                    ${trade.placement_rate}
                </b>

                <small>
                    prototype indicator
                </small>

            </div>

        </div>


        <div class="grid2">

            <div class="card">

                <h2>
                    Training
                </h2>

                <p>
                    ${trade.training_duration}
                </p>

                <p>
                    ${trade.required_education}
                </p>

            </div>


            <div class="card">

                <h2>
                    Outcome Information
                </h2>

                <p>
                    ${trade.sample_earning_range}
                </p>

                <p>
                    Demand:
                    ${trade.local_demand}
                </p>

            </div>


            <div class="card">

                <h2>
                    Job Roles
                </h2>

                ${
                    trade.job_roles
                        .map(
                            role =>
                                `<p>✓ ${role}</p>`
                        )
                        .join("")
                }

            </div>


            <div class="card">

                <h2>
                    Further Education
                </h2>

                ${
                    trade.further_education
                        .map(
                            item =>
                                `<p>✓ ${item}</p>`
                        )
                        .join("")
                }

            </div>

        </div>


        <div class="card">

            <h2>
                Career Growth
            </h2>

            <div class="timeline">

                ${
                    trade.career_growth
                        .map(
                            (item, index) => `

                            <div>

                                <b>
                                    ${index + 1}
                                </b>

                                <p>
                                    ${item}
                                </p>

                            </div>

                        `
                        )
                        .join("")
                }

            </div>

        </div>


        <div class="notice">

            Prototype data —
            replace with verified official
            outcome data before deployment.

            Salary and placement values
            are illustrative.

        </div>

    </section>

    `;
}


function counsellor() {

    app.innerHTML = `

    <section class="page">

        <span class="pill">
            DEMO MODE
        </span>

        <h1>
            AI Career Counsellor
        </h1>


        <div class="chat card">

            <div
                id="messages"
                class="messages"
            >

                <div class="bubble ai">

                    Hello!

                    Ask about salary,
                    jobs, career growth,
                    safety, further education
                    or trade selection.

                </div>

            </div>


            <div class="quick">

                <button>
                    Will this course provide a job?
                </button>

                <button>
                    What is the earning potential?
                </button>

                <button>
                    Is there career growth?
                </button>

                <button>
                    Can my child study further?
                </button>

            </div>


            <div class="chatInput">

                <input
                    id="q"
                    placeholder="
                        Ask your career question...
                    "
                >

                <button
                    class="btn primary"
                    onclick="sendChat()"
                >
                    Send
                </button>

            </div>

        </div>


        <div
            class="card form"
            style="margin-top:20px"
        >

            <h2>
                Talk to a Human Counsellor
            </h2>


            <label class="field">

                Name

                <input id="cn">

            </label>


            <label class="field">

                Phone / Email

                <input id="cc">

            </label>


            <label class="field">

                Concern

                <select id="co">

                    <option>
                        Salary
                    </option>

                    <option>
                        Job security
                    </option>

                    <option>
                        Career growth
                    </option>

                    <option>
                        Safety
                    </option>

                    <option>
                        Further education
                    </option>

                </select>

            </label>


            <label class="field">

                Message

                <textarea id="cm"></textarea>

            </label>


            <button
                class="btn primary"
                onclick="requestCounsellor()"
            >
                Submit Request
            </button>


            <p id="ok"></p>

        </div>

    </section>

    `;


    document
        .querySelectorAll(
            ".quick button"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        document.getElementById(
                            "q"
                        ).value =
                            button.textContent.trim();

                    };

            }
        );
}


async function sendChat() {

    const input =
        document.getElementById(
            "q"
        );


    const message =
        input.value.trim();


    if (!message) {

        return;
    }


    const messages =
        document.getElementById(
            "messages"
        );


    messages.innerHTML += `

        <div class="bubble user">

            ${message}

        </div>

    `;


    input.value = "";


    const response =
        await fetch(
            API + "/chat",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        message,

                        language: lang

                    })

            }
        );


    const result =
        await response.json();


    messages.innerHTML += `

        <div class="bubble ai">

            ${result.answer}

        </div>

    `;


    messages.scrollTop =
        messages.scrollHeight;
}


async function requestCounsellor() {

    const data = {

        name:
            document.getElementById(
                "cn"
            ).value,

        contact:
            document.getElementById(
                "cc"
            ).value,

        language:
            lang,

        concern:
            document.getElementById(
                "co"
            ).value,

        preferred_time:
            "Any time",

        message:
            document.getElementById(
                "cm"
            ).value
    };


    const response =
        await fetch(
            API + "/counsellor/request",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(data)

            }
        );


    const result =
        await response.json();


    document.getElementById(
        "ok"
    ).textContent =

        result.success

            ? "✓ Request submitted successfully."

            : "Could not submit request.";
}


function compare() {

    app.innerHTML = `

    <section class="page">

        <span class="pill">
            DECISION SUPPORT
        </span>

        <h1>
            Compare Careers
        </h1>

        <p class="muted">
            Select up to five trades.
        </p>


        <div class="card">

            <div class="tags">

                ${
                    trades
                        .map(
                            trade => `

                            <button
                                class="tag"
                            >
                                ${trade.trade_name}
                            </button>

                        `
                        )
                        .join("")
                }

            </div>

        </div>


        <div id="cmp"></div>

    </section>

    `;


    document
        .querySelectorAll(
            ".tag"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        button.classList.toggle(
                            "on"
                        );

                        buildCompare();

                    };

            }
        );
}


function buildCompare() {

    const selected =

        [
            ...document.querySelectorAll(
                ".tag.on"
            )
        ]

            .map(
                button =>
                    trades.find(
                        trade =>
                            trade.trade_name ===
                            button.textContent.trim()
                    )
            )

            .filter(Boolean)

            .slice(0, 5);


    if (!selected.length) {

        document.getElementById(
            "cmp"
        ).innerHTML = "";

        return;
    }


    const fields = [

        ["Training", "training_duration"],

        ["Education", "required_education"],

        ["Earning", "sample_earning_range"],

        ["Placement", "placement_rate"],

        ["Demand", "local_demand"]

    ];


    document.getElementById(
        "cmp"
    ).innerHTML = `

        <div class="card table">

            <table>

                <tr>

                    <th>
                        Feature
                    </th>

                    ${
                        selected
                            .map(
                                trade =>
                                    `<th>
                                        ${trade.trade_name}
                                    </th>`
                            )
                            .join("")
                    }

                </tr>


                ${
                    fields
                        .map(
                            field => `

                            <tr>

                                <td>
                                    ${field[0]}
                                </td>

                                ${
                                    selected
                                        .map(
                                            trade =>
                                                `<td>
                                                    ${
                                                        trade[
                                                            field[1]
                                                        ]
                                                    }
                                                </td>`
                                        )
                                        .join("")
                                }

                            </tr>

                        `
                        )
                        .join("")
                }

            </table>

        </div>

    `;
}


async function admin() {

    const response =
        await fetch(
            API + "/admin/analytics"
        );


    const data =
        await response.json();


    const max =
        Math.max(
            1,
            ...data.concerns.map(
                item =>
                    item.value
            )
        );


    app.innerHTML = `

    <section class="page">

        <span class="pill">
            ADMIN • AGGREGATED
        </span>

        <h1>
            Administrator Dashboard
        </h1>


        <div class="statgrid">

            <div class="card stat">

                Sessions

                <b>
                    ${data.sessions}
                </b>

            </div>


            <div class="card stat">

                Requests

                <b>
                    ${data.counsellor_requests}
                </b>

            </div>


            <div class="card stat">

                Pending

                <b>
                    ${data.pending_requests}
                </b>

            </div>


            <div class="card stat">

                Demo Trades

                <b>
                    ${trades.length}
                </b>

            </div>

        </div>


        <div
            class="card"
            style="margin-top:15px"
        >

            <h2>
                Family Concerns
            </h2>

            <div class="chartbar">

                ${
                    data.concerns.length

                        ?

                        data.concerns
                            .map(
                                item => `

                                <div
                                    class="bar"
                                    style="
                                        height:
                                        ${
                                            item.value /
                                            max *
                                            200
                                        }px
                                    "
                                >

                                    <small>
                                        ${item.name}
                                    </small>

                                </div>

                            `
                            )
                            .join("")

                        :

                        "No requests yet. Submit a counsellor request to populate this chart."
                }

            </div>

        </div>


        <div class="card">

            <h2>
                Recent Requests
            </h2>

            ${
                data.requests.length

                    ?

                    data.requests
                        .map(
                            request => `

                            <div class="request">

                                <b>
                                    #${request.id}
                                    •
                                    ${request.concern}
                                </b>

                                <br>

                                <span class="muted">

                                    ${request.status}
                                    •
                                    ${request.language}

                                </span>

                                <br>

                                ${
                                    request.message ||
                                    "No message"
                                }

                            </div>

                        `
                        )
                        .join("")

                    :

                    "No requests yet."
            }

        </div>

    </section>

    `;
}


window.onhashchange =
    render;


loadTrades();