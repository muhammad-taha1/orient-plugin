---
name: orient-mentor
description: Run an Orient mentor's side of the marketplace — answer booking requests (accept or decline) and view or change weekly availability. Use when the user is an Orient mentor or coach asking about pending requests, who wants to book them, whether to accept or decline someone, their open hours, blocking out days, or changing when mentees can book them, even if they don't say "Orient".
---

# Orient mentoring (for mentors)

Orient mentors answer booking requests from mentees and set the hours mentees can book. Use the Orient connector's tools; don't invent requests, names or times.

These tools only work for users signed in with an Orient mentor account. Anyone else gets a "for Orient mentors" message. Treat that as final: say it plainly, point a would-be mentor to orient-path.ca, and don't retry or try other tools to work around it.

## Booking requests

- `list_booking_requests` shows requests waiting for an answer: who, when, and the note they left. Show names, times and notes; keep the ids to yourself unless needed.
- `accept_booking_request` **charges the mentee's held payment**, which can't be undone from here. Say who and when in one line and get an explicit yes before calling it.
- `decline_booking_request` releases the mentee's card hold. Confirm it the same way, because the mentee loses that slot.
- Only pending requests can be accepted or declined here. A confirmed session can't be cancelled here — give the `manageUrl` so the mentor can do it on orient-path.ca.

## Weekly availability

- `get_my_availability` and `set_my_availability` need the mentor's time zone (an IANA name such as `America/Toronto`); ask if you don't know it.
- Hours are 24-hour `HH:mm`, one range per day.
- `set_my_availability` changes only the days you pass. Send just what the mentor asked to change so you don't overwrite the rest of their week, then read the saved week back to them so they can spot a mistake.

## Offer the next step

Mentors do their best sessions when they've read the mentee's note. Offer only what you can do, ask before acting, and make one or two offers at a time:

- *After an accept:* a calendar entry at the session time in the mentor's time zone, and a short prep from the mentee's note (what they want to cover, two or three questions to open with).
- *Before a session:* a reminder shortly before it starts.

Check your tools first for a calendar connector, reminders, or memory. If you don't have one, skip that offer without comment, and never say you've set something you can't set. Calendars belong to the user: once they've agreed to an entry, updating that same entry later is covered by their yes.

## Stays on the website

Cancelling or rescheduling a confirmed session and profile changes happen on orient-path.ca. Give the `manageUrl` instead of trying to do these here.
