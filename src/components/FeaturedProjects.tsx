import { featuredProjects } from "@/data/projects";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectMeta } from "./ProjectMeta";
import { SectionHeading } from "./SectionHeading";
import styles from "./FeaturedProjects.module.css";

export function FeaturedProjects() {
  return (
    <section id="utvalda" className={styles.section} aria-labelledby="utvalda-title">
      <div className="container">
        <SectionHeading id="utvalda-title" index="01" title="Utvalda projekt">
          Tre projekt som visar bredden: ett labb för klassrummet, ett spel och en träningsapp.
        </SectionHeading>
        <ol className={styles.list}>
          {featuredProjects.map((project, position) => (
            <li key={project.slug}>
              <article
                className={styles.item}
                aria-labelledby={`utvald-${project.slug}`}
                data-testid="featured-project"
              >
                <div className={styles.media}>
                  <ProjectMedia
                    project={project}
                    sizes="(min-width: 60rem) min(58vw, 46rem), 100vw"
                    priority={position === 0}
                  />
                </div>
                <div className={styles.body}>
                  <ProjectMeta project={project} />
                  <h3 id={`utvald-${project.slug}`} className={styles.name}>
                    {project.name}
                  </h3>
                  <p className={styles.tagline}>{project.tagline}</p>
                  <p className={styles.text}>{project.featuredText ?? project.description}</p>
                  <ProjectLinks project={project} />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
