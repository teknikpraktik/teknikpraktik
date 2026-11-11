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
 * Om projektet har en verifierad adress är bilden klickbar med mus och touch,
 * men hoppas över av tangentbord och skärmläsare: länken finns redan som knapp i kortet.
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
      {project.url ? (
        <a href={project.url} className={styles.frame} tabIndex={-1} aria-hidden="true">
          {picture}
        </a>
      ) : (
        <div className={styles.frame}>{picture}</div>
      )}
      {image.kind === "placeholder" ? (
        <figcaption className={`label ${styles.caption}`}>Illustration, ingen skärmdump</figcaption>
      ) : null}
    </figure>
  );
}
