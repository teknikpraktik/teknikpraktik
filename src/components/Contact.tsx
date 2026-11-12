import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="kontakt" className={styles.section} aria-labelledby="kontakt-title">
      <div className="container">
        <SectionHeading id="kontakt-title" index="04" title="Kontakt" />
        <div className={styles.grid}>
          <p className={styles.text}>
            Vill du använda något av projekten i undervisningen, samarbeta kring en idé eller fråga hur något
            är byggt? Skriv ett ärende i webbplatsens repo på GitHub, så svarar jag där.
          </p>
          <div className={styles.actions}>
            <p>
              <a className={styles.link} href={site.contact.url} data-testid="contact-link">
                <span className={styles.handle}>{site.contact.label}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </p>
            <p className={styles.note}>
              Ärendet blir offentligt och kräver ett GitHub-konto. Alla projekt finns på{" "}
              <a href={site.contact.profileUrl} data-testid="profile-link">
                {site.contact.profileLabel}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
