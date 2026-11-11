import styles from "./SectionHeading.module.css";

interface Props {
  id: string;
  index: string;
  title: string;
  children?: React.ReactNode;
}

/** Gemensam rubrik för sidans sektioner: löpnummer, rubrik och en valfri ingress. */
export function SectionHeading({ id, index, title, children }: Props) {
  return (
    <div className={styles.heading}>
      <p className={`label ${styles.index}`} aria-hidden="true">
        {index}
      </p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {children ? <p className={styles.intro}>{children}</p> : null}
    </div>
  );
}
