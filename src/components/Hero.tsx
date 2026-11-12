import { projects } from "@/data/projects";
import { site } from "@/data/site";
import styles from "./Hero.module.css";

const numbers = ["noll", "en", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva", "tolv"];
const count = numbers[projects.length] ?? String(projects.length);

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className="container">
        <p className={`label ${styles.eyebrow}`}>
          <span>{site.author}</span>
          <span aria-hidden="true">/</span>
          <span>{site.name}</span>
        </p>
        <h1 id="hero-title" className={styles.title}>
          Jag bygger digitala verktyg för lärande, spel och vardag.
        </h1>
        <div className={styles.lower}>
          <div className={styles.intro}>
            <p className={styles.lead}>
              Jag heter Per Björkman och är tekniklärare. Här samlar jag {count} webbappar som jag har byggt:
              labb och kurser för undervisning, spel, träningsappar och en väderapp.
            </p>
            <p className={styles.actions}>
              <a className={styles.primary} href="#projekt">
                Se alla projekt
              </a>
              <a className={styles.secondary} href="#kontakt">
                Kontakt
              </a>
            </p>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt className="label">Yrke</dt>
              <dd>Tekniklärare</dd>
            </div>
            <div>
              <dt className="label">Utbildning</dt>
              <dd>Civilingenjör</dd>
            </div>
            <div>
              <dt className="label">Tidigare</dt>
              <dd>Trafikflygare</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
