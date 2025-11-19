import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BaaniRaag } from "@shared/schema";

interface BaaniViewerProps {
  raags: BaaniRaag[];
}

export function BaaniViewer({ raags }: BaaniViewerProps) {
  const [currentRaagIndex, setCurrentRaagIndex] = useState(0);
  const [currentShabadIndex, setCurrentShabadIndex] = useState(0);

  if (!raags || raags.length === 0) {
    return null;
  }

  const currentRaag = raags[currentRaagIndex];
  const currentShabad = currentRaag.shabads[currentShabadIndex];
  
  const canGoPreviousShabad = currentShabadIndex > 0;
  const canGoNextShabad = currentShabadIndex < currentRaag.shabads.length - 1;
  const canGoPreviousRaag = currentRaagIndex > 0;
  const canGoNextRaag = currentRaagIndex < raags.length - 1;

  const goToPreviousShabad = () => {
    if (canGoPreviousShabad) {
      setCurrentShabadIndex(currentShabadIndex - 1);
    } else if (canGoPreviousRaag) {
      setCurrentRaagIndex(currentRaagIndex - 1);
      const previousRaag = raags[currentRaagIndex - 1];
      setCurrentShabadIndex(previousRaag.shabads.length - 1);
    }
  };

  const goToNextShabad = () => {
    if (canGoNextShabad) {
      setCurrentShabadIndex(currentShabadIndex + 1);
    } else if (canGoNextRaag) {
      setCurrentRaagIndex(currentRaagIndex + 1);
      setCurrentShabadIndex(0);
    }
  };

  const selectRaag = (raagIndex: number) => {
    setCurrentRaagIndex(raagIndex);
    setCurrentShabadIndex(0);
  };

  return (
    <section id="baani" className="py-16 md:py-24 bg-accent/20 animate-fade-in-up" data-testid="section-baani">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16 animate-scale-in"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-baani-title">
            ਬਾਣੀ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਸਾਹਿਬ ਜੀ
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-baani-subtitle">
            ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਵਿੱਚੋਂ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਦੀ ਪਵਿੱਤਰ ਬਾਣੀ
          </p>
        </motion.div>

        {/* Raag Selection */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {raags.map((raag, index) => (
            <Button
              key={raag.id}
              variant={index === currentRaagIndex ? "default" : "outline"}
              onClick={() => selectRaag(index)}
              data-testid={`button-select-raag-${index}`}
              className="text-sm md:text-base"
            >
              {raag.name}
            </Button>
          ))}
        </div>

        <Card className="overflow-hidden shadow-3d-hover glow-border" data-testid="card-baani-display">
          <div className="bg-card p-6 md:p-8 lg:p-12">
            <div className="flex items-center justify-between mb-6">
              <Button
                size="icon"
                variant="outline"
                onClick={goToPreviousShabad}
                disabled={!canGoPreviousShabad && !canGoPreviousRaag}
                data-testid="button-previous-shabad"
                className="hover-elevate active-elevate-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="text-center">
                <p className="text-lg font-semibold text-card-foreground mb-1" data-testid="text-raag-title">
                  {currentRaag.title}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-shabad-count">
                  ਸ਼ਬਦ {currentShabadIndex + 1} / {currentRaag.shabads.length}
                </p>
              </div>

              <Button
                size="icon"
                variant="outline"
                onClick={goToNextShabad}
                disabled={!canGoNextShabad && !canGoNextRaag}
                data-testid="button-next-shabad"
                className="hover-elevate active-elevate-2"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentRaag.id}-${currentShabad.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-4xl">
                  <div 
                    className="text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose lg:leading-loose text-center whitespace-pre-line font-serif text-foreground"
                    style={{ 
                      fontFamily: '"Noto Sans Gurmukhi", "Raavi", sans-serif',
                      lineHeight: '2.2'
                    }}
                    data-testid={`shabad-text-${currentShabad.id}`}
                  >
                    {currentShabad.text}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <p data-testid="text-total-progress">
                ਕੁੱਲ: ਰਾਗ {currentRaagIndex + 1}/{raags.length}
              </p>
              <span>•</span>
              <p data-testid="text-raag-progress">
                {currentRaag.name} ({currentRaag.shabads.length} ਸ਼ਬਦ)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
