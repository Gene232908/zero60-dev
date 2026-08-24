# 063 Admin — walkthrough for management

**For:** ZeroSixtyThree management · **Prepared by:** Developer 2 (Milestone 4)

This is the short version. Everything the admin does is on two screens.

---

## 1. Getting in

The admin is **not linked from the website**. There is no button, no footer link, and no
menu item — that is deliberate, so visitors never find it. You reach it by typing the
address:

```
https://zerosixtythree.com/admin
```

You will be asked to **log in** with the email and password of your administrator account.

### "This account is not an administrator"

Signing in is not the same as being an administrator. An account only gets access once it
has been given the **admin flag**. If you see this message, the account is valid but has
not been given that flag yet — ask the developer to add it. It takes a moment and is done
once per person.

This is not just a screen we hide. The database itself refuses to hand over any booking
to an account without that flag, so there is no way around it.

### "Admin is not connected yet"

The database credentials have not been added to this deployment. The admin is finished and
waiting; nothing is broken. See `docs/BLOCKERS.md` (B10a, B10b) for what is outstanding.

---

## 2. Records — the day-to-day screen

`/admin/bookings` lists every booking, newest first.

### Finding a booking

- **Search** — type a reference or enquiry number.
- **Filter by status** — show only New, or only Paid, and so on.
- **Website-sourced only** — tick this to see just the bookings that came through the
  website. These are the ones the partnership applies to.

### Editing a booking

Every change saves immediately. If the save fails you will see a message and the row goes
back to how it was, so what you see on screen is always what is actually stored.

| Column | What to do with it |
|---|---|
| **Status** | New → Confirmed → Paid, or Cancelled / Refunded. Set as things progress. |
| **Amount collected (AED)** | What you were **actually paid**, not what was quoted. The partnership is calculated from this figure, so it is the single most important field on the screen. Leave it blank until money is received. |
| **Origin** | Ticked = the customer came through the website. Untick for phone, WhatsApp or walk-in enquiries. **Unticked bookings earn no commission.** |
| **Customer** | Tick **Returning** if this is someone who has booked before. Returning customers still count towards the partnership. |
| **Commission** | Calculated for you. Nothing to fill in. |

> **If you want fewer statuses.** You mentioned possibly using only New / Paid / Cancelled.
> That is a one-line change for the developer — the whole system, including the invoice,
> follows automatically. Just say the word.

---

## 3. Overview — the monthly summary and the invoice

`/admin` shows the money side. Pick a **month** and **year** at the top.

### The four figures

| Figure | Meaning |
|---|---|
| **Qualifying bookings** | How many bookings that month earn commission |
| **Collected (AED)** | Total actually collected across those bookings |
| **Commission due (AED)** | What is owed for the month |
| **Capped bookings** | How many hit the AED 250 ceiling |

### The billing statement

Below the figures is the invoice for that month: one line per qualifying booking, showing
what was collected and what is owed on it, with a running **Total due**. Lines marked
**Capped** are ones where the ceiling applied. It carries a reference like `063-PS-2026-03`.

---

## 4. How the partnership is calculated

The agreed terms, exactly as the system applies them:

- **2%** of the amount actually collected on a booking.
- **Capped at AED 250 per booking.** The cap is per booking, never per month. Two large
  bookings in the same month are capped at AED 250 *each* — so that month owes AED 500,
  not AED 250.
- **Website-sourced bookings only.** Enquiries that came by phone, WhatsApp or walk-in do
  not count, which is what the Origin tick controls.
- **Only bookings that reached a revenue-bearing status** — in practice, the ones you have
  marked Paid.
- **Returning customers still count**, provided they meet the conditions above.

Worked examples:

| Collected | Commission | Why |
|---|---|---|
| AED 10,000 | AED 200 | 2% of 10,000 |
| AED 12,500 | AED 250 | 2% is exactly 250 — right at the ceiling |
| AED 40,000 | AED 250 | 2% would be 800, so the cap applies |
| AED 40,000, taken by phone | AED 0 | Not website-sourced |
| AED 40,000, still marked New | AED 0 | Not yet a revenue-bearing status |

This arithmetic is checked automatically every time the site is built, including the
"two capped bookings in one month" case, so the figures on the invoice cannot quietly
drift from the terms above.

---

## 5. Everyday questions

**Can I delete a booking?**
Not from this screen. Cancelled is a status — it keeps the history rather than losing it.

**I changed something by mistake.**
Change it back; the save is immediate either way. Nothing is destructive except the amount
field, and that can simply be re-entered.

**Someone shared the /admin link by accident.**
It is harmless on its own. Anyone without the admin flag sees a sign-in screen and nothing
else — the database will not release a single record to them. The page is also excluded
from Google.

**A booking shows no commission and I think it should.**
Check three things, in this order: is **Origin** ticked, is the **status** Paid, and is the
**amount collected** filled in? All three are required.
