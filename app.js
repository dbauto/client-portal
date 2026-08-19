const state = {
  role: "parent_admin",
  authView: "home",
  page: "dashboard",
  inviteLink: "",
  clientPhoto: "",
  clientDocument: "",
  zohoFields: [
    { label: "HR Recruitment Cycle", apiName: "HR_RECRUITMENT_CYCLE", visible: true, editable: true },
    { label: "Submission Status", apiName: "Submission_Status", visible: true, editable: false },
    { label: "Recruitment Stage", apiName: "Status", visible: true, editable: true },
  ],
  candidates: [
    {
      name: "Maya Santos",
      position: "Registered Nurse",
      facility: "Baton Rouge Medical Center",
      status: "Interview",
    },
    {
      name: "Jordan Lee",
      position: "Physical Therapist",
      facility: "North Clinic",
      status: "Client Review",
    },
    {
      name: "Priya Narang",
      position: "LPN",
      facility: "Westview Rehab",
      status: "Pending Start",
    },
  ],
};

const app = document.querySelector("#app");

function html(strings, ...values) {
  return strings.reduce((output, string, index) => {
    return output + string + (values[index] ?? "");
  }, "");
}

function isAdmin() {
  return state.role === "parent_admin" || state.role === "staff_admin";
}

function roleLabel() {
  if (state.role === "parent_admin") return "Parent admin";
  if (state.role === "staff_admin") return "Staff admin";
  return "Invited client";
}

function renderAuth(view = "home") {
  state.authView = view;
  if (view === "home") {
    app.innerHTML = html`
      <section class="auth-wrap">
        <div class="auth-panel">
          <div class="logo">
            <div class="logo-mark">HM</div>
            <div>
              <strong>Hiring Manager Portal</strong>
              <span>Secure role-specific access</span>
            </div>
          </div>
          <div class="entry-list">
            <button class="entry-card" data-auth-route="parent_admin">
              <strong>Admin Login</strong>
              <span>Owner account with full access to clients, staff admins, ATS/CRM integrations, and security.</span>
            </button>
            <button class="entry-card" data-auth-route="staff_admin">
              <strong>Staff Admin Login</strong>
              <span>Invited admin users with assigned permission groups.</span>
            </button>
            <button class="entry-card" data-auth-route="client_invite">
              <strong>Client Invite Setup</strong>
              <span>Clients create credentials only from an active invitation.</span>
            </button>
            <button class="entry-card" data-auth-route="client_login">
              <strong>Client Login</strong>
              <span>Existing invited clients sign in to review candidates and requests.</span>
            </button>
          </div>
        </div>
        <div class="auth-story">
          <p class="pill amber">Secure access</p>
          <h1>Separate pages for administrators and invited clients.</h1>
          <p>
            The parent admin creates client profiles, sends invitations, and manages staff admins.
            Clients cannot self-register without an invite.
          </p>
          <button class="btn ghost" data-demo-admin>Open admin portal</button>
        </div>
      </section>
    `;
    bindAuthEvents();
    return;
  }

  app.innerHTML = html`
    <section class="auth-wrap">
      <div class="auth-panel">
        <div class="logo">
          <div class="logo-mark">HM</div>
          <div>
            <strong>Hiring Manager Portal</strong>
            <span>Secure role-specific access</span>
          </div>
        </div>
        <button class="link-button" data-auth-route="home">Back to access options</button>
        ${authFormForMode(view)}
      </div>
      <div class="auth-story">
        <p class="pill amber">Secure access</p>
          <h1>${view === "client_invite" ? "Invite-only client account setup." : view === "client_login" ? "Client sign in." : "Administrator sign in."}</h1>
          <p>
          ${
            view === "client_invite"
              ? "Client credentials are created only after an admin sends an invitation."
              : view === "client_login"
                ? "Client accounts are separate from admin accounts and only work after invitation acceptance."
                : "Admin accounts are managed separately from client accounts with role-based permissions."
          }
        </p>
        <button class="btn ghost" data-demo-admin>Open admin portal</button>
      </div>
    </section>
  `;
  bindAuthEvents();
}

function authFormForMode(mode) {
  if (mode === "client_invite") return activationForm();
  if (mode === "client_login") {
    return loginForm({
      email: "avery.client@example.com",
      title: "Client Login",
      helper: "Only invited and activated client users can access this portal.",
      role: "client",
    });
  }
  if (mode === "staff_admin") {
    return loginForm({
      email: "ops.admin@hiringportal.test",
      title: "Staff Admin Login",
      helper:
        "Staff admins are invited by the parent admin and can be limited to support, setup, integration, or audit permissions.",
      role: "staff_admin",
    });
  }
  return loginForm({
    email: "owner@hiringportal.test",
    title: "Admin Login",
    helper:
      "The parent admin is the main owner account with full control over clients, staff admins, ATS/CRM integrations, and security.",
    role: "parent_admin",
  });
}

function loginForm({ email, title, helper, role }) {
  return html`
    <form class="form" data-login-form>
      <h2>${title}</h2>
      <label class="field">
        Email
        <input type="email" value="${email}" />
      </label>
      <label class="field">
        Password
        <input type="password" value="SecurePass12345" />
      </label>
      <input type="hidden" data-role-select value="${role}" />
      <button class="btn">Sign in</button>
      <p class="muted">${helper}</p>
    </form>
  `;
}

function activationForm() {
  return html`
    <form class="form" data-activate-form>
      <h2>Client Invite Setup</h2>
      <label class="field">
        Invite token
        <input value="INVITE-CLIENT-DEMO-2026" />
      </label>
      <label class="field">
        Client email
        <input type="email" value="avery.client@example.com" />
      </label>
      <label class="field">
        New password
        <input type="password" value="ClientPass12345" />
      </label>
      <label class="field">
        Confirm password
        <input type="password" value="ClientPass12345" />
      </label>
      <button class="btn">Create client login</button>
      <p class="muted">Clients cannot self-register. They can only enter through an active invite.</p>
    </form>
  `;
}

function bindAuthEvents() {
  document.querySelectorAll("[data-auth-route]").forEach((button) => {
    button.addEventListener("click", () => renderAuth(button.dataset.authRoute));
  });
  document.querySelector("[data-demo-admin]")?.addEventListener("click", () => {
    state.role = "parent_admin";
    state.page = "dashboard";
    renderPortal();
  });
  document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.role = document.querySelector("[data-role-select]").value;
    state.page = "dashboard";
    renderPortal();
  });
  document.querySelector("[data-activate-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.role = "client";
    state.page = "dashboard";
    renderPortal();
  });
}

function renderPortal() {
  const adminItems = [
    ["dashboard", "Dashboard"],
    ["clients", "Client Profiles"],
    ["admins", "Admin Users"],
    ["fields", "Portal Fields"],
    ["zoho", "Integrations"],
    ["audit", "Audit Logs"],
  ];
  const clientItems = [
    ["dashboard", "Dashboard"],
    ["candidates", "Candidates"],
    ["scheduling", "Scheduling"],
    ["profile", "Profile"],
    ["activity", "Activity"],
  ];
  const navItems = isAdmin() ? adminItems : clientItems;
  app.innerHTML = html`
    <section class="portal-shell">
      <aside class="sidebar">
        <div class="logo">
          <div class="logo-mark">HM</div>
          <div>
            <strong>Hiring Manager Portal</strong>
            <span>${isAdmin() ? "Admin Console" : "Client Portal"}</span>
          </div>
        </div>
        <nav class="nav">
          ${navItems
            .map(
              ([id, label]) =>
                `<button class="${state.page === id ? "active" : ""}" data-page="${id}">${label}</button>`,
            )
            .join("")}
        </nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <p class="muted">Secure role-based portal</p>
            <h1>${titleForPage()}</h1>
          </div>
          <div class="toolbar">
            <span class="pill green">${roleLabel()}</span>
            <button class="btn secondary" data-signout>Sign out</button>
          </div>
        </header>
        ${contentForPage()}
      </main>
    </section>
  `;
  bindPortalEvents();
}

function titleForPage() {
  const titles = {
    dashboard: isAdmin() ? "Admin Overview" : "Client Dashboard",
    clients: "Client Profiles",
    admins: "Admin Users",
    fields: "Portal Fields",
    zoho: "Integrations",
    audit: "Audit Logs",
    candidates: "Endorsed Candidates",
    scheduling: "Scheduling Center",
    profile: "Client Profile",
    activity: "My Activity",
  };
  return titles[state.page] ?? "Dashboard";
}

function contentForPage() {
  if (state.page === "clients") return clientsPage();
  if (state.page === "admins") return adminsPage();
  if (state.page === "fields") return fieldsPage();
  if (state.page === "zoho") return zohoPage();
  if (state.page === "audit") return auditPage();
  if (state.page === "candidates") return candidatesPage();
  if (state.page === "scheduling") return schedulingPage();
  if (state.page === "profile") return profilePage();
  if (state.page === "activity") return activityPage();
  return dashboardPage();
}

function dashboardPage() {
  return html`
    <div class="grid">
      <section class="card span-2">
        <div class="metric-row">
          <div class="metric"><span class="muted">Open candidates</span><strong>${state.candidates.length}</strong></div>
          <div class="metric"><span class="muted">Awaiting client</span><strong>7</strong></div>
          <div class="metric"><span class="muted">Integration token</span><strong>45m</strong></div>
          <div class="metric"><span class="muted">Invites sent</span><strong>4</strong></div>
        </div>
      </section>
      <section class="card">
        <h2>Workflow preview</h2>
        <p class="notice">Parent admin creates client profiles, staff admins help operate the portal, and invited clients set credentials.</p>
      </section>
      <section class="card">
        <h2>Connected fields shown to clients</h2>
        <div class="status-grid">
          ${state.zohoFields.map((field) => `<span class="pill">${field.apiName}</span>`).join("")}
        </div>
      </section>
      <section class="card span-2">
        <h2>Login model</h2>
        <div class="status-grid">
          <div class="mini-card"><strong>Parent admin</strong><span>Full owner access</span></div>
          <div class="mini-card"><strong>Staff admin</strong><span>Added by parent admin</span></div>
          <div class="mini-card"><strong>Client</strong><span>Invite-only account setup</span></div>
        </div>
      </section>
    </div>
  `;
}

function clientsPage() {
  return html`
    <div class="grid">
      <section class="card">
        <h2>Create client profile</h2>
        <form class="form" data-client-form>
          <label class="field">Client company / facility<input value="North Clinic Group" /></label>
          <label class="field">Contact name<input value="Avery Chen" /></label>
          <label class="field">Contact email<input type="email" value="avery.client@example.com" /></label>
          <label class="field">Role<select><option>Client Admin</option><option>Hiring Manager</option><option>Viewer</option></select></label>
          <button class="btn">Create profile and invite</button>
        </form>
      </section>
      <section class="card">
        <h2>Invite preview</h2>
        <p class="muted">Generated invite link appears here after profile creation.</p>
        <div class="invite-box ${state.inviteLink ? "" : "hidden"}">
          <span>${state.inviteLink}</span>
          <button class="btn secondary" data-copy>Copy</button>
        </div>
      </section>
      <section class="card span-2">
        <h2>Client access table</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Client</th><th>Email</th><th>Access</th><th>Last active</th></tr></thead>
            <tbody>
              <tr><td>North Clinic Group</td><td>avery.client@example.com</td><td><span class="pill green">Active</span></td><td>Today 9:12 AM</td></tr>
              <tr><td>Westview Rehab</td><td>manager@westview.example</td><td><span class="pill amber">Invite pending</span></td><td>Not activated</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function adminsPage() {
  return html`
    <div class="grid">
      <section class="card">
        <h2>Add staff admin</h2>
        <form class="form">
          <label class="field">Full name<input value="Sam Rivera" /></label>
          <label class="field">Email<input type="email" value="sam.admin@example.com" /></label>
          <label class="field">
            Permission group
            <select>
              <option>Client support and invitations</option>
              <option>Integration manager</option>
              <option>Audit viewer</option>
            </select>
          </label>
          <button class="btn" type="button">Send admin invite</button>
        </form>
      </section>
      <section class="card">
        <h2>Admin hierarchy</h2>
        <div class="candidate-list">
          <article class="candidate">
            <div><h3>Parent admin</h3><p class="muted">owner@hiringportal.test</p></div>
            <span class="pill green">Full access</span>
          </article>
          <article class="candidate">
            <div><h3>Staff admin</h3><p class="muted">ops.admin@hiringportal.test</p></div>
            <span class="pill">Limited access</span>
          </article>
        </div>
      </section>
    </div>
  `;
}

function fieldsPage() {
  return html`
    <div class="grid">
      <section class="card span-2">
        <h2>Client-visible recruitment fields</h2>
        <p class="muted">Admin chooses one or more fields from the connected ATS or CRM to show in the client portal. Zoho Recruit is the sample provider. Editable fields become dropdowns for client updates.</p>
        <div class="candidate-list">
          ${state.zohoFields
            .map(
              (field, index) => `
                <article class="candidate">
                  <div>
                    <h3>${field.label}</h3>
                    <p class="muted">${field.apiName}</p>
                  </div>
                  <div class="toolbar">
                    <span class="pill ${field.visible ? "green" : ""}">${field.visible ? "Visible" : "Hidden"}</span>
                    <span class="pill ${field.editable ? "amber" : ""}">${field.editable ? "Client editable" : "Read only"}</span>
                    <button class="btn secondary" data-remove-field="${index}" type="button">Remove</button>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="card">
        <h2>Add connected field</h2>
        <form class="form" data-field-form>
          <label class="field">Field label<input data-field-label value="Applicant Status" /></label>
          <label class="field">ATS / CRM API name<input data-field-api value="Lead_Status" /></label>
          <label class="field">Client permission<select data-field-permission><option>Visible and editable</option><option>Visible only</option></select></label>
          <button class="btn">Add field</button>
        </form>
      </section>
      <section class="card">
        <h2>Supported examples</h2>
        <div class="status-grid">
          <span class="pill">HR_RECRUITMENT_CYCLE</span>
          <span class="pill">Lead_Status</span>
          <span class="pill">Submission_Status</span>
          <span class="pill">Position_Applied</span>
          <span class="pill">Interview_Date</span>
          <span class="pill">Available_Time</span>
        </div>
      </section>
    </div>
  `;
}

function zohoPage() {
  return html`
    <div class="grid">
      <section class="card span-2">
        <h2>ATS / CRM Integrations</h2>
        <p class="muted">Zoho Recruit is shown as the sample server-based OAuth integration.</p>
        <form class="form">
          <div class="grid">
            <label class="field">Client ID<input value="1000.6Q3NVMI4CAXOK..." /></label>
            <label class="field">Client Secret<input type="password" value="secret-placeholder" /></label>
            <label class="field">Provider<select><option>Zoho Recruit (sample ATS)</option><option>Other ATS</option><option>Other CRM</option></select></label>
            <label class="field">Redirect URI<input value="https://secure-zoho-hiring-portal-free-test.boton-danicamarie-hsm.workers.dev/api/admin/integrations/zoho-recruit/oauth/callback" /></label>
            <label class="field">Scope<input value="ZohoRecruit.modules.all" /></label>
          </div>
          <div class="toolbar">
            <button class="btn" type="button">Save encrypted credentials</button>
            <button class="btn secondary" type="button">Open Zoho Recruit authorization</button>
            <span class="pill green">Refresh every 45 min</span>
          </div>
        </form>
      </section>
      <section class="card">
        <h2>Token monitor</h2>
        <div class="timeline">
          <div><strong>Access token</strong><span class="pill green">Healthy</span></div>
          <div><strong>Next refresh</strong><span>Every 45 minutes</span></div>
          <div><strong>Last sync</strong><span>Today 9:14 AM</span></div>
        </div>
      </section>
      <section class="card">
        <h2>Data sync</h2>
        <div class="timeline">
          <div><strong>Applicants</strong><span>ZohoRecruit.modules.all</span></div>
          <div><strong>Dispatch mode</strong><span>Scheduled outbox</span></div>
          <div><strong>Audit</strong><span>Every update is logged</span></div>
        </div>
      </section>
    </div>
  `;
}

function candidatesPage() {
  return html`
    <section class="card">
      <h2>Candidate review</h2>
      <div class="candidate-list">
        ${state.candidates
          .map(
            (candidate, index) => `
              <article class="candidate">
                <div>
                  <h3>${candidate.name}</h3>
                  <p class="muted">${candidate.position} - ${candidate.facility}</p>
                  <div class="field-strip">
                    ${state.zohoFields
                      .filter((field) => field.visible)
                      .map((field) => `<span>${field.apiName}: ${candidate.status}</span>`)
                      .join("")}
                  </div>
                </div>
                <label class="field">
                  HR Recruitment Cycle
                  <select data-candidate-status="${index}">
                    ${["Screening", "Submitted", "Client Review", "Interview", "Offer", "Hired"]
                      .map(
                        (option) =>
                          `<option ${option === candidate.status ? "selected" : ""}>${option}</option>`,
                      )
                      .join("")}
                  </select>
                </label>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function schedulingPage() {
  return html`
    <section class="card">
      <h2>Interview request</h2>
      <form class="form">
        <label class="field">Candidate<select><option>Maya Santos</option><option>Jordan Lee</option></select></label>
        <label class="field">Preferred date<input type="datetime-local" /></label>
        <label class="field">Notes<textarea rows="4">Client prefers Tuesday afternoon.</textarea></label>
        <button class="btn">Send request</button>
      </form>
    </section>
  `;
}

function profilePage() {
  const image = state.clientPhoto
    ? `<img src="${state.clientPhoto}" alt="Client profile preview" />`
    : "<span>AC</span>";
  return html`
    <div class="grid">
      <section class="card">
        <h2>Profile photo</h2>
        <div class="profile-uploader">
          <div class="avatar-preview">${image}</div>
          <div>
            <label class="field">
              Upload photo
              <input type="file" accept="image/*" data-photo-upload />
            </label>
            <p class="muted">Clients can upload a profile photo. Production should limit size, validate type, and store it securely.</p>
          </div>
        </div>
      </section>
      <section class="card">
        <h2>Client account</h2>
        <form class="form">
          <label class="field">Full name<input value="Avery Chen" /></label>
          <label class="field">Email<input type="email" value="avery.client@example.com" /></label>
          <label class="field">Facility<input value="North Clinic Group" /></label>
          <button class="btn" type="button">Save profile</button>
        </form>
      </section>
      <section class="card span-2">
        <h2>Profile documents</h2>
        <div class="profile-uploader">
          <div class="file-tile">${state.clientDocument || "No file selected"}</div>
          <div>
            <label class="field">
              Upload license, facility file, or profile document
              <input type="file" data-document-upload />
            </label>
            <p class="muted">Uploaded client files would be stored securely and visible only to authorized portal users.</p>
          </div>
        </div>
      </section>
    </div>
  `;
}

function activityPage() {
  return tablePage("My Activity", [
    ["candidate_status_update", "processing", "Today 9:14 AM"],
    ["resume_downloaded", "success", "Yesterday 2:04 PM"],
  ]);
}

function auditPage() {
  return tablePage("Security and activity logs", [
    ["client_profile_invited", "success", "Today 8:55 AM"],
    ["staff_admin_invited", "success", "Today 8:42 AM"],
    ["zoho_token_refreshed", "success", "Today 7:45 AM"],
  ]);
}

function tablePage(title, rows) {
  return html`
    <section class="card">
      <h2>${title}</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Action</th><th>Outcome</th><th>Time</th></tr></thead>
          <tbody>${rows.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function bindPortalEvents() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = button.dataset.page;
      renderPortal();
    });
  });
  document.querySelector("[data-signout]")?.addEventListener("click", () => renderAuth());
  document.querySelector("[data-client-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.inviteLink = `${location.origin}${location.pathname}?token=INVITE-CLIENT-DEMO-2026`;
    renderPortal();
  });
  document.querySelector("[data-field-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = document.querySelector("[data-field-label]").value.trim();
    const apiName = document.querySelector("[data-field-api]").value.trim();
    const permission = document.querySelector("[data-field-permission]").value;
    if (!label || !apiName) return;
    state.zohoFields.push({
      label,
      apiName,
      visible: true,
      editable: permission === "Visible and editable",
    });
    renderPortal();
  });
  document.querySelectorAll("[data-remove-field]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeField);
      state.zohoFields.splice(index, 1);
      renderPortal();
    });
  });
  document.querySelectorAll("[data-candidate-status]").forEach((select) => {
    select.addEventListener("change", () => {
      const index = Number(select.dataset.candidateStatus);
      state.candidates[index].status = select.value;
    });
  });
  document.querySelector("[data-photo-upload]")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      state.clientPhoto = String(reader.result);
      renderPortal();
    });
    reader.readAsDataURL(file);
  });
  document.querySelector("[data-document-upload]")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.clientDocument = file.name;
    renderPortal();
  });
}

renderAuth();
