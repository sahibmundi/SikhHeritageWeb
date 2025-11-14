import { useState } from "react";
import { MapPin, X, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PdfList } from "@/components/PdfViewer";
import type { Gurdwara } from "@shared/schema";

interface GurdwarasProps {
  gurdwaras: Gurdwara[];
}

export function Gurdwaras({ gurdwaras }: GurdwarasProps) {
  const [selectedGurdwara, setSelectedGurdwara] = useState<Gurdwara | null>(null);

  return (
    <section id="gurdwaras" className="py-16 md:py-24 bg-background" data-testid="section-gurdwaras">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-gurdwaras-title">
            ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-gurdwaras-subtitle">
            ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ ਨਾਲ ਜੁੜੇ ਇਤਿਹਾਸਕ ਗੁਰਧਾਮ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {gurdwaras.map((gurdwara) => (
            <Card 
              key={gurdwara.id} 
              className="overflow-hidden shadow-lg hover-elevate transition-all cursor-pointer"
              onClick={() => setSelectedGurdwara(gurdwara)}
              data-testid={`card-gurdwara-${gurdwara.id}`}
            >
              {gurdwara.imageUrl && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={gurdwara.imageUrl}
                    alt={gurdwara.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-semibold text-card-foreground">
                  {gurdwara.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-foreground/80 line-clamp-3">
                  {gurdwara.briefHistory}
                </p>

                {gurdwara.visitDate && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">ਯਾਤਰਾ: {gurdwara.visitDate}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{gurdwara.location.address}</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGurdwara(gurdwara);
                  }}
                  data-testid={`button-view-${gurdwara.id}`}
                >
                  ਪੂਰੀ ਜਾਣਕਾਰੀ ਦੇਖੋ
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedGurdwara && (
          <div 
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setSelectedGurdwara(null)}
            data-testid="modal-gurdwara-details"
          >
            <div className="min-h-screen py-8 px-4">
              <div 
                className="max-w-4xl mx-auto bg-card border border-card-border rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 bg-card border-b border-card-border px-6 py-4 flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {selectedGurdwara.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedGurdwara(null)}
                    data-testid="button-close-modal"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {selectedGurdwara.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-lg border border-border">
                      <img
                        src={selectedGurdwara.imageUrl}
                        alt={selectedGurdwara.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-4">ਇਤਿਹਾਸ:</h4>
                    <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
                      {selectedGurdwara.fullHistory}
                    </div>
                  </div>

                  {selectedGurdwara.visitDate && (
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">ਯਾਤਰਾ ਸਮਾਂ:</h4>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <p className="text-lg font-medium text-primary">{selectedGurdwara.visitDate}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-4">ਸਥਿਤੀ:</h4>
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-base text-foreground/80">{selectedGurdwara.location.address}</p>
                    </div>
                    
                    {selectedGurdwara.location.mapEmbedUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden border border-border">
                        <iframe
                          src={selectedGurdwara.location.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Map of ${selectedGurdwara.name}`}
                        />
                      </div>
                    )}
                  </div>

                  {selectedGurdwara.pdfAssets && selectedGurdwara.pdfAssets.length > 0 && (
                    <PdfList pdfAssets={selectedGurdwara.pdfAssets} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
