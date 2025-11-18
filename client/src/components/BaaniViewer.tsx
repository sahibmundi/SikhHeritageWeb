import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BaaniPage } from "@shared/schema";

interface BaaniViewerProps {
  pages: BaaniPage[];
}

export function BaaniViewer({ pages }: BaaniViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!pages || pages.length === 0) {
    return null;
  }

  const currentPage = pages[currentPageIndex];
  const canGoPrevious = currentPageIndex > 0;
  const canGoNext = currentPageIndex < pages.length - 1;

  const goToPrevious = () => {
    if (canGoPrevious) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  return (
    <section id="baani" className="py-16 md:py-24 bg-accent/20 animate-fade-in-up" data-testid="section-baani">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <Card className="overflow-hidden shadow-3d-hover glow-border" data-testid="card-baani-page">
          <div className="bg-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                size="icon"
                variant="outline"
                onClick={goToPrevious}
                disabled={!canGoPrevious}
                data-testid="button-previous-page"
                className="hover-elevate active-elevate-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="text-center">
                <p className="text-lg font-semibold text-card-foreground" data-testid="text-page-number">
                  ਪੰਨਾ {currentPage.pageNumber}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-page-title">
                  {currentPage.title}
                </p>
              </div>

              <Button
                size="icon"
                variant="outline"
                onClick={goToNext}
                disabled={!canGoNext}
                data-testid="button-next-page"
                className="hover-elevate active-elevate-2"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-3xl">
                  <img
                    src={currentPage.imageUrl}
                    alt={`ਬਾਣੀ ਪੰਨਾ ${currentPage.pageNumber}`}
                    className="w-full h-auto rounded-md shadow-lg"
                    data-testid={`image-page-${currentPage.pageNumber}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground" data-testid="text-page-progress">
                {currentPageIndex + 1} / {pages.length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
