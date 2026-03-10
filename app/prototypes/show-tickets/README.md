# Show Tickets Prototype

A simple ticketing prototype where visitors can browse shows, select tickets, and complete a mock checkout.

## What it does

- **Browse shows** – List of upcoming shows with date, time, venue, and starting price
- **Select tickets** – Choose ticket type (General, VIP, Front Row) and quantity
- **Checkout** – Enter name and email (no real payment)
- **Confirmation** – Order summary and option to buy more tickets

## Setup

This prototype uses only the existing Next.js app. No extra dependencies are required.

1. From the project root, start the dev server (if not already running):
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000/prototypes/show-tickets](http://localhost:3000/prototypes/show-tickets) in your browser.

You can also reach it from the homepage by clicking the "Show tickets" card.

## Notes

- All shows and prices are hardcoded mock data.
- No payment is processed; the "Complete purchase" step only collects name and email and shows a confirmation.
- This is for prototyping and workshop use only.
