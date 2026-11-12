import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import { ProjectGallery } from "@/components/ProjectGallery";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { projects, usedCategories } from "@/data/projects";
import { site } from "@/data/site";
import styles from "./page.module.css";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "sv-SE",
      publisher: { "@id": `${site.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.author,
      url: site.url,
      jobTitle: "Tekniklärare",
      sameAs: [site.contact.profileUrl],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#innehall">
        Hoppa till innehållet
      </a>
      <div id="top" />
      <SiteHeader />
      <main id="innehall">
        <Hero />
        <FeaturedProjects />
        <section id="projekt" className={styles.section} aria-labelledby="projekt-title">
          <div className="container">
            <SectionHeading id="projekt-title" index="02" title="Alla projekt">
              Välj en kategori för att begränsa urvalet. Ett projekt kan höra till flera.
            </SectionHeading>
            <ProjectGallery projects={projects} categories={usedCategories} />
          </div>
        </section>
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
