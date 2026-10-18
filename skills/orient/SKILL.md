---
name: orient
description: Find, compare and book a mentor on Orient, or check the user's Orient sessions. Use when the user wants career or industry advice from an experienced person, asks for a mentor or coach, wants to book a 1:1 session, or asks about sessions they've booked on Orient.
---

# Orient mentoring

Orient connects mentees with mentors for paid 1:1 video sessions. Use the Orient connector's tools; don't invent mentors, prices or times.

## Find a mentor

1. Ask what the user wants help with if it isn't clear (role, industry, goal). One question is enough.
2. Call `search_mentors` with their goal as `query`, plus `sector` or `niche` when they named one.
3. Re-rank the results with what you know about the user and suggest two or three, each with one line on why they fit.
   Where cards are shown, summarise briefly instead of repeating every field.
4. For details, call `get_mentor` (profile, price, rating, recent reviews).

## Book a session

1. Ask for the user's time zone if you don't know it (an IANA name such as `America/Toronto`).
2. Call `get_mentor_availability`. Only ever offer times this tool returned.
3. When the user picks a time, confirm the mentor and time in one line, then call `book_session` with the slot's `startTime` exactly as returned.
4. Share the pay link in one short sentence. Payment happens on Orient's website, not in the chat.
   Don't explain holds, fees or acceptance unless the user asks — `about_orient` has the details.
5. After the user says they've paid, call `get_session` to show the updated status.

## The user's sessions

- `list_my_sessions` shows upcoming, unconfirmed, past and cancelled sessions. `get_session` shows one, with the meeting link once it's confirmed.
- `review_mentor` posts a public review after a session. Confirm the rating and wording with the user first; reviews can't be edited.

## Stays on the website

Cancelling, rescheduling, payments and receipts, and profile changes happen on orient-path.ca. Give the user the `manageUrl` from the session instead of trying to do these here.

## Signing in

Searching and browsing work without an account. Booking and the user's sessions need them to connect their Orient account; the connector asks them to sign in when a tool needs it.
