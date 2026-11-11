import { navigation, site } from "@/data/site";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label={`${site.name}, till sidans början`}>
          <span className={styles.mark} aria-hidden="true" />
          <span>teknikpraktik</span>
        </a>
        <nav aria-label="Huvudmeny">
          <ul className={styles.nav}>
            {navigation.map((item) => (
              <li key={item.href} className={item.href === "#utvalda" ? styles.optional : undefined}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
