import { SectionHeading } from "./SectionHeading";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="om" className={styles.section} aria-labelledby="om-title">
      <div className="container">
        <SectionHeading id="om-title" index="03" title="Om Per" />
        <div className={styles.grid}>
          <p className={styles.statement}>
            Tekniklärare, civilingenjör och tidigare trafikflygare. Mitt arbete förenar teknik, lärande och
            praktisk produktutveckling.
          </p>
          <div className={styles.text}>
            <p>
              Jag heter Per Björkman. Projekten på den här sidan är webbappar som jag har utvecklat och som går
              att öppna direkt i webbläsaren. Några är gjorda för undervisning, där eleverna ska kunna
              undersöka en idé själva i stället för att bara läsa om den. Andra är spel, träningsappar och
              verktyg för vardagen.
            </p>
            <p>
              Gemensamt för dem är att de är byggda för att användas. Källkoden till de flesta ligger öppet på
              GitHub.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
