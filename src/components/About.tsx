import { SectionHeading } from "./SectionHeading";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="om" className={styles.section} aria-labelledby="om-title">
      <div className="container">
        <SectionHeading id="om-title" index="03" title="Om mig" />
        <div className={styles.grid}>
          <p className={styles.statement}>
            Mitt arbete förenar teknik, lärande och praktisk produktutveckling.
          </p>
          <div className={styles.text}>
            <p>
              Jag är tekniklärare, civilingenjör i botten och har tidigare arbetat som trafikflygare.
              Projekten på den här sidan är webbappar som går att öppna direkt i webbläsaren. Några är gjorda
              för undervisning, där eleverna ska kunna undersöka en idé själva i stället för att bara läsa
              om den. Andra är spel, träningsappar och verktyg för vardagen.
            </p>
            <p>
              Källkoden till de flesta projekten ligger öppet på GitHub.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
