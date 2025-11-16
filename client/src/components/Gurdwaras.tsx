import { useState } from "react";
import { MapPin, X, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PdfList } from "@/components/PdfViewer";
import { motion, AnimatePresence } from "framer-motion";
import type { Gurdwara } from "@shared/schema";

interface GurdwarasProps {
  gurdwaras: Gurdwara[];
}

export function Gurdwaras({ gurdwaras }: GurdwarasProps) {
  const [selectedGurdwara, setSelectedGurdwara] = useState<Gurdwara | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="gurdwaras" className="py-16 md:py-24 bg-gradient-to-b from-background to-accent/10" data-testid="section-gurdwaras">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-gurdwaras-title">
            ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary mx-auto mb-6 glow-border-orange"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-gurdwaras-subtitle">
            ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ ਨਾਲ ਜੁੜੇ ਇਤਿਹਾਸਕ ਗੁਰਧਾਮ
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
        >
          {gurdwaras.map((gurdwara, index) => (
            <motion.div
              key={gurdwara.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="shadow-3d-hover glow-border transition-all cursor-pointer h-full group relative"
                onClick={() => setSelectedGurdwara(gurdwara)}
                data-testid={`card-gurdwara-${gurdwara.id}`}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                />
                
                {gurdwara.imageUrl && (
                  <div className="aspect-video overflow-hidden bg-muted relative rounded-t-lg">
                    <motion.img
                      src={gurdwara.imageUrl}
                      alt={gurdwara.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                      initial={{ opacity: 0.4 }}
                      whileHover={{ opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                    {gurdwara.visitDate && (
                      <motion.div 
                        className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                      >
                        {gurdwara.visitDate}
                      </motion.div>
                    )}
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {gurdwara.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-foreground/80 line-clamp-3">
                    {gurdwara.briefHistory}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{gurdwara.location.address}</span>
                  </div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGurdwara(gurdwara);
                      }}
                      data-testid={`button-view-${gurdwara.id}`}
                    >
                      <span>ਪੂਰੀ ਜਾਣਕਾਰੀ ਦੇਖੋ</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedGurdwara && (
            <motion.div 
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto"
              onClick={() => setSelectedGurdwara(null)}
              data-testid="modal-gurdwara-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="min-h-screen py-8 px-4">
                <motion.div 
                  className="max-w-4xl mx-auto bg-card border border-card-border rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.9, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 50 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <div className="sticky top-0 z-10 bg-card border-b border-card-border px-6 py-4 flex items-center justify-between rounded-t-lg">
                    <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                      {selectedGurdwara.name}
                    </h3>
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedGurdwara(null)}
                        data-testid="button-close-modal"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </motion.div>
                  </div>

                  <div className="p-6 md:p-8 space-y-8">
                    {selectedGurdwara.imageUrl && (
                      <motion.div 
                        className="aspect-video overflow-hidden rounded-lg border border-border shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={selectedGurdwara.imageUrl}
                          alt={selectedGurdwara.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-xl font-semibold text-foreground mb-4">ਇਤਿਹਾਸ:</h4>
                      <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
                        {selectedGurdwara.fullHistory}
                      </div>
                    </motion.div>

                    {selectedGurdwara.visitDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="text-xl font-semibold text-foreground mb-4">ਯਾਤਰਾ ਸਮਾਂ:</h4>
                        <div className="flex items-start gap-3 bg-primary/10 p-4 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <p className="text-lg font-medium text-primary">{selectedGurdwara.visitDate}</p>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-xl font-semibold text-foreground mb-4">ਸਥਿਤੀ:</h4>
                      <div className="flex items-start gap-3 mb-4 bg-accent/20 p-4 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <p className="text-base text-foreground/80">{selectedGurdwara.location.address}</p>
                      </div>
                      
                      {selectedGurdwara.location.mapEmbedUrl && (
                        <div className="aspect-video rounded-lg overflow-hidden border border-border shadow-lg">
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
                    </motion.div>

                    {selectedGurdwara.pdfAssets && selectedGurdwara.pdfAssets.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <PdfList pdfAssets={selectedGurdwara.pdfAssets} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
