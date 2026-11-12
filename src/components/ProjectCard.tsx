import type { Project } from "@/data/types";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectMeta } from "./ProjectMeta";
import styles from "./ProjectCard.module.css";

export function ProjectCard({ project }: { project: Project }) {
  const titleId = `projekt-${project.slug}`;

  return (
    <article className={styles.card} aria-labelledby={titleId} data-testid="project-card" data-slug={project.slug}>
      <ProjectMedia project={project} sizes="(min-width: 64rem) 26rem, (min-width: 40rem) 46vw, 100vw" />
      <div className={styles.body}>
        <ProjectMeta project={project} />
        <h3 id={titleId} className={styles.name}>
          {project.name}
        </h3>
        <p className={styles.tagline}>{project.tagline}</p>
        <p className={styles.description}>{project.description}</p>
      </div>
      {project.url || project.sourceUrl ? (
        <div className={styles.footer}>
          <ProjectLinks project={project} />
        </div>
      ) : null}
    </article>
  );
}
