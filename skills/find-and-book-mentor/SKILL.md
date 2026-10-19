---
name: find-and-book-mentor
description: Find, compare and book a mentor on Orient, and look after the user's own Orient sessions. Use when the user wants career or industry advice from an experienced person, asks for a mentor or coach, wants to book a 1:1 session, asks what times a mentor is free, asks about sessions they've booked on Orient, wants to prepare for or follow up on a session, or wants to review a mentor — even if they never say "Orient".
---

# Orient mentoring (for mentees)

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
   Then offer one next step (see "Offer the next step").
5. After the user says they've paid, call `get_session` to show the updated status. Once it shows confirmed, offer to put the meeting link on their calendar.

## The user's sessions

- `list_my_sessions` shows upcoming, unconfirmed, past and cancelled sessions. `get_session` shows one, with the meeting link once it's confirmed.
- `review_mentor` posts a public review after a session. Confirm the rating and wording with the user first; reviews can't be edited.

## Offer the next step

A booking only pays off if the user shows up prepared, so after each step offer the one thing that helps most. This is what makes the assistant more useful than the website.

- **Offer only what you can do.** Check your tools for a calendar connector, a reminder or scheduled-task tool, or memory. If you don't have one, skip that offer without comment; don't announce what you can't do. Never say you've set something you can't set.
- **Ask, then act.** Calendars and reminders belong to the user. Make the offer in one line, act after a yes, and don't repeat it if they pass. One or two offers at a time, never a menu; booking replies stay short. Once the user has agreed to a calendar entry, updating that same entry later (the meeting link, a moved time) is part of what they agreed to, so do it and say so rather than asking again.
- **Pick what fits the moment:**
  - *Before booking:* offer to draft the `notes` (what they want to cover) from what you know of their goal. The mentor prepares from it.
  - *Right after `book_session`:* a tentative calendar hold at the slot, in the user's time zone, titled with the mentor's name and with `manageUrl` in the description. If they haven't paid yet, a reminder to pay is the alternative.
  - *Once `get_session` shows it confirmed:* add the meeting link to the hold (or create the event), and offer a reminder shortly before the session. Without a calendar tool, give the session's `calendar` link that fits their calendar instead (`googleUrl`, `outlookUrl`, or `icsUrl` for Apple and desktop Outlook). The card already shows these, so only mention them in text when no card is shown.
  - *Before the session:* offer three or four questions to ask, tailored to the mentor's background (`get_mentor`) and the user's goal.
  - *After a past session:* offer to write up takeaways and action items, then a review (confirm wording first, as above). If it fits, offer to look at another time with the same mentor.
- **Keep the calendar true.** If the user says they cancelled or rescheduled on the website, offer to remove or move the entry you made.

## Stays on the website

Cancelling, rescheduling, payments and receipts, and profile changes happen on orient-path.ca. Give the user the `manageUrl` from the session instead of trying to do these here.

## Signing in

Searching and browsing work without an account. Booking and the user's sessions need them to connect their Orient account; the connector asks them to sign in when a tool needs it.
