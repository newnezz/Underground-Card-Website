(function () {
  const root = document.getElementById("root");
  const SECRET = "vancy2024";

  const state = {
    isAuthenticated: Boolean(localStorage.getItem("vancy-auth")) || Boolean(localStorage.getItem("vancy-credentials")),
    hasAccess: Boolean(localStorage.getItem("vancy-access-granted")),
  };

  function nav(path) {
    location.hash = "#" + path;
  }

  function path() {
    return (location.hash.replace(/^#/, "") || "/").trim();
  }

  function logout() {
    state.isAuthenticated = false;
    state.hasAccess = false;
    localStorage.removeItem("vancy-auth");
    localStorage.removeItem("vancy-access-granted");
    render();
  }

  function shell(content) {
    return '<div class="terminal"><div class="scanline"></div>' + content + "</div>";
  }

  function navBar(title) {
    return (
      '<div class="nav-container">' +
      '<h2 class="nav-title glitch">' + title + "</h2>" +
      '<div class="nav-links">' +
      '<a class="nav-link" href="#/store">CARDS</a>' +
      '<a class="nav-link" href="#/intel">INTEL</a>' +
      '<a class="nav-link" href="#/rank">RANK</a>' +
      '<button class="small-button" data-action="logout">LOGOUT</button>' +
      "</div></div>"
    );
  }

  function randomId(size) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < size; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function viewLogin() {
    root.innerHTML = `
      <div class="login-container">
        ${shell(`
          <div class="terminal-text">AMERICA_FIRST_ACCESS_v2.8</div>
          <form class="login-form" id="key-form">
            <div class="terminal-input"><span class="terminal-input-prefix">$</span><input id="key-input" type="password" autofocus /></div>
            <div class="terminal-text" id="key-error" style="color:red;margin-top:10px;"></div>
            ${localStorage.getItem("vancy-credentials") ? '<div style="margin-top:20px;text-align:center;"><a href="#/login-with-credentials">RETURNING PATRIOT? LOGIN WITH CREDENTIALS</a></div>' : ""}
          </form>
        `)}
      </div>
    `;
    document.getElementById("key-form").onsubmit = function (e) {
      e.preventDefault();
      const val = document.getElementById("key-input").value.trim().toLowerCase();
      if (val === SECRET.toLowerCase()) {
        state.isAuthenticated = true;
        localStorage.setItem("vancy-auth", "true");
        nav("/terminal");
      } else {
        document.getElementById("key-error").textContent = "Access denied. Invalid key.";
        document.getElementById("key-input").value = "";
      }
    };
  }

  function viewCredentialLogin() {
    root.innerHTML = `
      <div class="login-container">
        ${shell(`
          <div class="terminal-text">PATRIOT_LOGIN_SYSTEM</div>
          <form class="login-form" id="cred-form">
            <label>PATRIOT ID:</label><input id="agent-id" type="text" />
            <label>ACCESS KEY:</label><input id="access-key" type="password" />
            <button type="submit">LOGIN</button>
            <div class="terminal-text" id="cred-error" style="color:red;margin-top:10px;"></div>
            <div style="margin-top:20px;text-align:center;"><a href="#/">← New Login</a></div>
          </form>
        `)}
      </div>
    `;
    document.getElementById("cred-form").onsubmit = function (e) {
      e.preventDefault();
      const raw = localStorage.getItem("vancy-credentials");
      if (!raw) {
        document.getElementById("cred-error").textContent = "No credentials found. You must be initiated first.";
        return;
      }
      const data = JSON.parse(raw);
      if (document.getElementById("agent-id").value === data.id && document.getElementById("access-key").value === data.key) {
        state.isAuthenticated = true;
        state.hasAccess = true;
        localStorage.setItem("vancy-auth", "true");
        localStorage.setItem("vancy-access-granted", "true");
        nav("/intel");
      } else {
        document.getElementById("cred-error").textContent = "Access denied. Invalid credentials.";
      }
    };
  }

  function viewTerminal() {
    root.innerHTML = shell(`
      <div class="terminal-text">SECURE CONNECTION ESTABLISHED
WELCOME TO THE PATRIOT NETWORK
Type 'continue' to proceed.</div>
      <form id="terminal-form" class="terminal-input">
        <span class="terminal-input-prefix">$</span><input id="terminal-cmd" type="text" autofocus />
      </form>
    `);
    document.getElementById("terminal-form").onsubmit = function (e) {
      e.preventDefault();
      const val = document.getElementById("terminal-cmd").value.trim().toLowerCase();
      if (val === "continue") nav("/video");
    };
  }

  function viewVideo() {
    root.innerHTML = shell(`
      <div class="terminal-text">SECURE VIDEO TRANSMISSION
CLASSIFIED OPERATION DETAILS</div>
      <div style="margin-top:20px;border:1px solid var(--terminal-green);height:320px;display:flex;align-items:center;justify-content:center;">[VIDEO BRIEFING PLACEHOLDER]</div>
      <button id="to-choice" style="margin-top:20px;width:100%;">CONTINUE TO COMMITMENT PHASE</button>
    `);
    document.getElementById("to-choice").onclick = () => nav("/choice");
  }

  function viewChoice() {
    root.innerHTML = shell(`
      <div class="terminal-text">YOUR COMMITMENT WILL NOW BE TESTED.
Take the red pill to join the network.
Take the blue pill to exit.</div>
      <div class="choice-container">
        <button class="pill-button red-pill" id="red">RED PILL</button>
        <button class="pill-button blue-pill" id="blue">BLUE PILL</button>
      </div>
    `);
    document.getElementById("red").onclick = () => nav("/register");
    document.getElementById("blue").onclick = () => {
      localStorage.clear();
      location.href = "https://www.google.com";
    };
  }

  function viewRegister() {
    const id = randomId(10);
    const key = randomId(10) + "-" + randomId(10) + "-" + randomId(10);
    localStorage.setItem("vancy-credentials", JSON.stringify({ id: id, key: key, date: new Date().toISOString() }));
    root.innerHTML = shell(`
      <div class="credentials-container">
        <h2 class="glitch">YOUR SECURE CREDENTIALS</h2>
        <p>PATRIOT ID:</p><div class="secret-id">${id}</div>
        <p>ACCESS KEY:</p><div class="secret-id">${key}</div>
        <button id="secured" style="width:100%;">I HAVE SECURED MY CREDENTIALS</button>
      </div>
    `);
    document.getElementById("secured").onclick = () => {
      state.hasAccess = true;
      localStorage.setItem("vancy-access-granted", "true");
      nav("/intel");
    };
  }

  function viewIntel() {
    const creds = JSON.parse(localStorage.getItem("vancy-credentials") || "{}");
    const intel = [
      "JD VANCE TALKING POINTS",
      "MEDIA STRATEGY",
      "DEMOGRAPHIC INSIGHTS",
      "OPPOSITION RESEARCH",
    ];
    root.innerHTML = shell(`
      ${navBar("CLASSIFIED INTELLIGENCE")}
      <div class="terminal-text" style="margin-bottom:20px;font-size:0.8em;">PATRIOT: ${creds.id || "UNKNOWN"}</div>
      <div class="card-grid">
        ${intel.map((x) => `<div class="card-item"><h3>${x}</h3><p style="margin-top:10px;">Strategic data file for network operations.</p><button style="margin-top:15px;">ACCESS FILE</button></div>`).join("")}
      </div>
    `);
  }

  function viewStore() {
    const cards = [
      { t: "THE VISIONARY", p: "$15" },
      { t: "THE PATRIOT", p: "$10" },
      { t: "THE OUTSIDER", p: "$25" },
      { t: "THE STRATEGIST", p: "$40" },
      { t: "THE FUTURE PRESIDENT", p: "$100" },
    ];
    root.innerHTML = shell(`
      ${navBar("PATRIOT TRADING CARDS")}
      <div class="card-grid">
        ${cards
          .map(
            (x) =>
              `<div class="card-item"><div style="height:130px;border:1px solid var(--terminal-green);display:flex;align-items:center;justify-content:center;">[CARD IMAGE]</div><h3 style="margin-top:10px;">${x.t}</h3><p>${x.p}</p><button style="margin-top:10px;">ADD TO CART</button></div>`
          )
          .join("")}
      </div>
    `);
  }

  function viewRank() {
    const creds = JSON.parse(localStorage.getItem("vancy-credentials") || "{}");
    const joined = creds.date ? new Date(creds.date) : new Date();
    const days = Math.floor((Date.now() - joined.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min(days * 5, 100);
    root.innerHTML = shell(`
      ${navBar("PATRIOT NETWORK RANKS")}
      <div class="terminal-text" style="margin-bottom:20px;font-size:0.8em;">PATRIOT: ${creds.id || "UNKNOWN"} | CURRENT RANK: INITIATE</div>
      <div class="rank-container">
        <div class="rank-section">
          <h4>Progress to OPERATIVE: ${progress}%</h4>
          <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
        <div class="rank-section">
          <h4>Current Perks</h4>
          <ul class="perk-list"><li>Access to basic strategic intel</li><li>Ability to purchase basic cards</li></ul>
        </div>
        <div class="rank-section">
          <h4>Requirements</h4>
          <ul class="requirement-list"><li class="${progress > 25 ? "completed" : ""}">Distribute at least 1 trading card</li><li class="${progress > 50 ? "completed" : ""}">Recruit 2 new patriots</li><li class="${progress > 75 ? "completed" : ""}">Complete first mission</li></ul>
        </div>
        <div class="mission-teaser"><h3>UPCOMING INFLUENCE OPERATIONS</h3><div class="mission-status">OPERATION SYSTEM: INITIALIZING...</div></div>
      </div>
    `);
  }

  function guard(authOnly, accessOnly) {
    if (authOnly && !state.isAuthenticated) return nav("/");
    if (accessOnly && (!state.isAuthenticated || !state.hasAccess)) return nav("/");
    return null;
  }

  function bindGlobalActions() {
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) logoutBtn.onclick = logout;
  }

  function render() {
    const p = path();
    switch (p) {
      case "/":
        viewLogin();
        break;
      case "/login-with-credentials":
        viewCredentialLogin();
        break;
      case "/terminal":
        if (guard(true, false)) return;
        viewTerminal();
        break;
      case "/video":
        if (guard(true, false)) return;
        viewVideo();
        break;
      case "/choice":
        if (guard(true, false)) return;
        viewChoice();
        break;
      case "/register":
        if (guard(true, false)) return;
        viewRegister();
        break;
      case "/intel":
        if (guard(true, true)) return;
        viewIntel();
        break;
      case "/store":
        if (guard(true, true)) return;
        viewStore();
        break;
      case "/rank":
        if (guard(true, true)) return;
        viewRank();
        break;
      default:
        nav("/");
        return;
    }
    bindGlobalActions();
  }

  window.addEventListener("hashchange", render);
  if (!location.hash) nav("/");
  render();
})();
