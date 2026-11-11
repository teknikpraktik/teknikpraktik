import type { Project } from "@/data/types";
import styles from "./ProjectLinks.module.css";

/**
 * Länkar för ett projekt. Demolänken visas bara när adressen är verifierad,
 * och källkodslänken bara för publika repon.
 */
export function ProjectLinks({ project }: { project: Project }) {
  if (!project.url && !project.sourceUrl) return null;

  return (
    <p className={styles.links}>
      {project.url ? (
        <a className={styles.primary} href={project.url} data-testid="project-link">
          Öppna<span className="sr-only"> {project.name}</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </a>
      ) : null}
      {project.sourceUrl ? (
        <a className={styles.secondary} href={project.sourceUrl} data-testid="source-link">
          Källkod<span className="sr-only"> för {project.name}</span>
        </a>
      ) : null}
    </p>
  );
}
