import { useState, useEffect } from "react";
import type { TimelineEvent, BiographySection } from "@shared/schema";

interface BiographyProps {
  timeline: TimelineEvent[];
  sections: BiographySection[];
}

export function Biography({ timeline, sections }: BiographyProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const current = sectionElements.find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 200 && rect.bottom >= 200;
      });
      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="biography" className="py-16 md:py-24 bg-background" data-testid="section-biography">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-biography-title">
            ਜੀਵਨੀ
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-biography-subtitle">
            ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ ਦਾ ਸੰਪੂਰਨ ਜੀਵਨ ਚਰਿੱਤਰ
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="lg:w-64 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 bg-card border border-card-border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-card-foreground mb-6" data-testid="text-timeline-title">
                ਵਿਸ਼ੇਸ਼ ਤਰੀਖਾਂ
              </h3>
              <div className="relative space-y-6">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                
                {timeline.map((event, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(event.sectionId)}
                    className={`relative flex items-start gap-4 w-full text-left transition-all hover-elevate active-elevate-2 p-2 rounded-md ${
                      activeSection === event.sectionId ? "text-primary font-semibold" : "text-foreground"
                    }`}
                    data-testid={`button-timeline-${event.year}`}
                  >
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      activeSection === event.sectionId ? "bg-primary text-primary-foreground" : "bg-card border-2 border-border"
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-semibold text-base">{event.year}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{event.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-12">
            {sections.map((section) => (
              <div 
                key={section.id} 
                id={section.id} 
                className="scroll-mt-24"
                data-testid={`section-${section.id}`}
              >
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {section.heading}
                </h3>
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
