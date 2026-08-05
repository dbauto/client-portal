# Client Hiring Manager Portal Prototype

This prototype demonstrates a responsive client portal connected conceptually to **Zoho Recruit or Zoho CRM**.

## Open the prototype

Open `index.html` in Chrome, Edge, or Firefox. No installation is required.

## Main flow

1. Internal recruiter changes a candidate's Zoho stage/status to **Endorsed to Hiring Manager**.
2. The backend syncs only candidates belonging to the logged-in client or facility.
3. The hiring manager reviews candidate cards and opens the full profile.
4. The hiring manager views the résumé attachment.
5. The hiring manager records a decision or schedules an interview.
6. The interview remains on Microsoft Teams, Zoom, Google Meet, phone, or another provider.
7. The portal writes the decision and interview details back to Zoho.

## Recommended production architecture

- **Frontend:** React or Next.js
- **Backend:** FastAPI, Node.js/NestJS, or Next.js server routes
- **Authentication:** Passwordless email, Microsoft Entra ID, Google Workspace, or Zoho SSO
- **Zoho access:** OAuth 2.0 stored and refreshed only on the server
- **Record security:** Client ID / facility lookup enforced by the backend
- **Resume delivery:** Backend streams the Zoho attachment using a short-lived authorized URL
- **Audit:** Store user, timestamp, old status, new status, notes, and IP/device metadata
- **Interview data:** Store provider, meeting URL, date/time, time zone, interviewer, duration, and notes

## Suggested Zoho field mapping

| Portal field | Zoho Recruit example | Zoho CRM example |
|---|---|---|
| Candidate ID | Candidate ID / Application ID | Lead ID / Recruitment Log ID |
| Client | Client Name / Department | Client or Facility lookup |
| Position | Job Opening | Position Applied |
| Endorsement status | Candidate Status / Application Status | Recruitment Stage / HR Stage |
| Resume | Candidate attachment | Lead or Recruitment Log attachment |
| Client decision | Custom picklist | Client Decision picklist |
| Decision notes | Custom multiline field | Client Feedback multiline field |
| Interview date | Interview module | Interview DateTime |
| Provider | Custom picklist | Meeting Provider |
| Meeting URL | Custom URL field | Interview Meeting Link |

## Security rules

- Never place Zoho client secret, refresh token, or access token inside browser JavaScript.
- Do not trust a client ID received from the browser; determine permitted clients from the authenticated portal account.
- Log résumé access and all hiring decisions.
- Apply retention and privacy controls for candidate personal data.
