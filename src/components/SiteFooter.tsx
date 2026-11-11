import { site } from "@/data/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {site.author} · {site.domain}
        </p>
        <p>
          <a href="#top">Till toppen</a>
        </p>
      </div>
    </footer>
  );
}
