import Image from "next/image";
import type { Project } from "@/data/types";
import styles from "./ProjectMedia.module.css";

interface Props {
  project: Project;
  /** `sizes` för next/image, anpassat till platsen i layouten. */
  sizes: string;
  /** Sätts för bilder ovanför vecket. */
  priority?: boolean;
}

/**
 * Projektets bild i fast format 16:10.
 * Om projektet har en verifierad adress ligger en klickyta ovanpå bilden för mus och touch.
 * Den hoppas över av tangentbord och skärmläsare, eftersom länken redan finns som knapp i
 * kortet. Själva bilden och dess alt-text är tillgängliga som vanligt.
 */
export function ProjectMedia({ project, sizes, priority = false }: Props) {
  const { image } = project;
  const picture = (
    <Image
      src={image.src}
      alt={image.alt}
      sizes={sizes}
      placeholder="blur"
      priority={priority}
      className={styles.image}
    />
  );

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {picture}
        {project.url ? <a href={project.url} className={styles.overlay} tabIndex={-1} aria-hidden="true" /> : null}
      </div>
      {image.kind === "placeholder" ? (
        <figcaption className={`label ${styles.caption}`}>Illustration, ingen skärmdump</figcaption>
      ) : null}
    </figure>
  );
}
