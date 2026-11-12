import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Sidan finns inte",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className={`container ${styles.main}`}>
      <p className="label">404</p>
      <h1 className={styles.title}>Sidan finns inte.</h1>
      <p className={styles.text}>Adressen kan vara felskriven eller så har sidan flyttats.</p>
      <p>
        <Link className={styles.link} href="/">
          Till startsidan
        </Link>
      </p>
    </main>
  );
}
