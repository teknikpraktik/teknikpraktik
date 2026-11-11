import { categoryLabel } from "@/data/projects";
import type { Project } from "@/data/types";
import styles from "./ProjectMeta.module.css";

const statusText = {
  live: "Publicerad",
  "no-demo": "Ingen publik demo",
} as const;

/** Kategorier och status för ett projekt. */
export function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className={styles.meta}>
      <ul className={`label ${styles.categories}`} aria-label="Kategorier">
        {project.categories.map((id) => (
          <li key={id}>{categoryLabel(id)}</li>
        ))}
      </ul>
      <p className={`label ${styles.status}`} data-status={project.status}>
        <span className={styles.dot} aria-hidden="true" />
        <span className="sr-only">Status: </span>
        {statusText[project.status]}
        {project.note ? ` · ${project.note}` : null}
      </p>
    </div>
  );
}
