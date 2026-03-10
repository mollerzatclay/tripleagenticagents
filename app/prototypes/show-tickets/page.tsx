"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

type Step = "shows" | "tickets" | "checkout" | "confirm";

const SHOWS = [
  {
    id: "1",
    title: "Neon Nights Live",
    date: "Fri, June 14, 2025",
    time: "8:00 PM",
    venue: "The Grand Stage",
    price: 45,
  },
  {
    id: "2",
    title: "Comedy Hour",
    date: "Sat, June 21, 2025",
    time: "7:30 PM",
    venue: "Laugh Factory",
    price: 35,
  },
  {
    id: "3",
    title: "Jazz Under the Stars",
    date: "Sun, July 6, 2025",
    time: "6:00 PM",
    venue: "Rooftop Garden",
    price: 55,
  },
];

type TicketTier = { name: string; price: number };
const TIERS: TicketTier[] = [
  { name: "General Admission", price: 0 },
  { name: "VIP", price: 25 },
  { name: "Front Row", price: 50 },
];

export default function ShowTickets() {
  const [step, setStep] = useState<Step>("shows");
  const [selectedShow, setSelectedShow] = useState<(typeof SHOWS)[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tierIndex, setTierIndex] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const tier = TIERS[tierIndex];
  const ticketPrice = selectedShow ? selectedShow.price + tier.price : 0;
  const total = ticketPrice * quantity;

  const handleSelectShow = (show: (typeof SHOWS)[0]) => {
    setSelectedShow(show);
    setStep("tickets");
    setQuantity(1);
    setTierIndex(0);
  };

  const handleCheckout = () => {
    setStep("checkout");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) setStep("confirm");
  };

  const reset = () => {
    setStep("shows");
    setSelectedShow(null);
    setQuantity(1);
    setTierIndex(0);
    setName("");
    setEmail("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to prototypes
        </Link>
        <h1 className={styles.siteTitle}>Show Tickets</h1>
        <p className={styles.tagline}>Get tickets to your next favorite show</p>
      </header>

      <main className={styles.main}>
        {step === "shows" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upcoming shows</h2>
            <p className={styles.sectionSubtitle}>
              Choose a show to see ticket options.
            </p>
            <ul className={styles.showList}>
              {SHOWS.map((show) => (
                <li key={show.id} className={styles.showCard}>
                  <div className={styles.showInfo}>
                    <h3 className={styles.showTitle}>{show.title}</h3>
                    <p className={styles.showMeta}>
                      {show.date} · {show.time}
                    </p>
                    <p className={styles.showVenue}>{show.venue}</p>
                    <p className={styles.showPrice}>From ${show.price}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => handleSelectShow(show)}
                  >
                    Get tickets
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === "tickets" && selectedShow && (
          <section className={styles.section}>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => setStep("shows")}
            >
              ← Change show
            </button>
            <div className={styles.showSummary}>
              <h2 className={styles.sectionTitle}>{selectedShow.title}</h2>
              <p className={styles.showMeta}>
                {selectedShow.date} · {selectedShow.time} · {selectedShow.venue}
              </p>
            </div>

            <div className={styles.ticketOptions}>
              <div className={styles.field}>
                <label className={styles.label}>Ticket type</label>
                <select
                  className={styles.select}
                  value={tierIndex}
                  onChange={(e) => setTierIndex(Number(e.target.value))}
                >
                  {TIERS.map((t, i) => (
                    <option key={i} value={i}>
                      {t.name}
                      {t.price > 0 ? ` (+$${t.price})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Quantity</label>
                <div className={styles.quantityRow}>
                  <button
                    type="button"
                    className={styles.quantityBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button
                    type="button"
                    className={styles.quantityBtn}
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.orderSummary}>
              <p className={styles.summaryLine}>
                <span>{quantity} × ${ticketPrice.toFixed(2)}</span>
                <span>${total.toFixed(2)}</span>
              </p>
              <p className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </p>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleCheckout}
            >
              Continue to checkout
            </button>
          </section>
        )}

        {step === "checkout" && selectedShow && (
          <section className={styles.section}>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => setStep("tickets")}
            >
              ← Back to tickets
            </button>
            <h2 className={styles.sectionTitle}>Checkout</h2>
            <div className={styles.orderSummary}>
              <p className={styles.summaryLine}>
                <span>{selectedShow.title}</span>
              </p>
              <p className={styles.summaryLine}>
                <span>
                  {quantity} ticket{quantity > 1 ? "s" : ""} · ${ticketPrice.toFixed(2)} each
                </span>
                <span>${total.toFixed(2)}</span>
              </p>
              <p className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <p className={styles.disclaimer}>
                This is a prototype. No payment is collected and no real tickets
                are issued.
              </p>
              <button type="submit" className={styles.primaryButton}>
                Complete purchase
              </button>
            </form>
          </section>
        )}

        {step === "confirm" && selectedShow && (
          <section className={styles.section}>
            <div className={styles.confirmCard}>
              <div className={styles.confirmIcon}>✓</div>
              <h2 className={styles.confirmTitle}>You&apos;re all set!</h2>
              <p className={styles.confirmText}>
                A confirmation has been sent to <strong>{email}</strong> for your
                order.
              </p>
              <div className={styles.confirmDetails}>
                <p>
                  <strong>{selectedShow.title}</strong>
                </p>
                <p>
                  {selectedShow.date} · {selectedShow.time}
                </p>
                <p>{selectedShow.venue}</p>
                <p>
                  {quantity} ticket{quantity > 1 ? "s" : ""} · ${total.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={reset}
              >
                Buy more tickets
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
