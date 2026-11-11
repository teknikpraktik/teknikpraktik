"use client";

import { useId, useState } from "react";
import type { Category, CategoryId, Project } from "@/data/types";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectGallery.module.css";

interface Props {
  projects: Project[];
  categories: Category[];
}

type Filter = CategoryId | "alla";

/**
 * Galleri med kategorifilter. Utan JavaScript visas alla projekt.
 * Filtren är vanliga knappar med aria-pressed. Antalet träffar läses upp via aria-live.
 */
export function ProjectGallery({ projects, categories }: Props) {
  const [filter, setFilter] = useState<Filter>("alla");
  const listId = useId();

  const visible = filter === "alla" ? projects : projects.filter((p) => p.categories.includes(filter));
  const options: { id: Filter; label: string; count: number }[] = [
    { id: "alla", label: "Alla", count: projects.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.label,
      count: projects.filter((p) => p.categories.includes(category.id)).length,
    })),
  ];

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filtrera projekt efter kategori">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={styles.filter}
              aria-pressed={filter === option.id}
              aria-controls={listId}
              data-filter={option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
              <span className={styles.count} aria-hidden="true">
                {option.count}
              </span>
              <span className="sr-only">, {option.count} projekt</span>
            </button>
          ))}
        </div>
        <p className={`label ${styles.result}`} role="status" aria-live="polite" data-testid="filter-status">
          Visar {visible.length} av {projects.length} projekt
        </p>
      </div>
      <ul id={listId} className={styles.grid} data-testid="project-grid">
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
