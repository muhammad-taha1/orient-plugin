# Orient

Find a mentor who fits your goals and book a paid 1:1 video session, right from your AI assistant.

## Install

- **Claude:** in **Customize → Plugins → Add**, either choose **Add marketplace** and enter `muhammad-taha1/orient-plugin` (gets updates), then install **Orient**, or choose **Upload plugin** with [the Claude zip](https://github.com/muhammad-taha1/orient-plugin/raw/main/dist/orient-claude.zip). Then open the plugin's **Connectors** tab and connect **Orient**: installing adds the skills, but the tools only work once the connector is connected. Start a new chat afterwards. In Claude Code the connector loads with the plugin:

      /plugin install orient --marketplace muhammad-taha1/orient-plugin

- **ChatGPT:** add **Orient** from the Plugins directory once it's listed.
  - **Workspace (Business, Enterprise, Edu):** until it's listed, an owner or admin, or a member with the **Upload plugins** and **Create plugins with MCPs** permissions, can upload [the ChatGPT zip](https://github.com/muhammad-taha1/orient-plugin/raw/main/dist/orient-chatgpt.zip) on the web: **Admin console → your workspace → Plugins → Add → Upload plugin**. Uploading doesn't connect Orient. Each person then opens the plugin and clicks **Connect** to sign in.
  - **Personal account:** there's no upload option, so add a custom MCP server with the URL `https://orient-path.ca/api/mcp` in Developer mode.

## Use it

Tell the assistant what you'd like help with, for example "find me a mentor in product management who has worked at a startup". Orient suggests mentors who fit, shows their profiles, ratings and prices, and lists their open times in your time zone.

To book, connect your Orient account when the assistant asks. Orient reserves the time and gives you a link to pay on orient-path.ca; you're only charged once the mentor accepts. You can also check your sessions, get the meeting link, and review a mentor afterwards. Cancelling, rescheduling and payments stay on the Orient website.

## What's included

- **Orient connector**: the remote MCP server at `https://orient-path.ca/api/mcp`. Searching and browsing work without an account; booking and your sessions use your Orient sign-in (OAuth).
- **Orient skills**: `find-and-book-mentor` tells the assistant how to search, offer only real open times, and keep booking replies short; `orient-mentor` covers mentors answering booking requests and setting weekly hours.

## Data

The plugin talks only to Orient (`orient-path.ca`). It sends your search terms, your time zone, the mentor and time you pick, and any notes you add to a booking. It returns public mentor profiles and, once you're signed in, your own sessions and reviews. Orient never sees your chat history. The plugin itself stores nothing.

Privacy policy: https://orient-path.ca/pages/privacy-policy · Terms: https://orient-path.ca/pages/terms-and-conditions · Support: info@orient-path.ca
