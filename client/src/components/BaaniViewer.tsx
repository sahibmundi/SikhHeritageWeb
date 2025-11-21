import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function BaaniViewer() {
  const { data, isLoading } = useQuery<{ text: string }>({
    queryKey: ['/api/baani/text'],
  });

  if (isLoading) {
    return (
      <section 
        id="baani" 
        className="py-16 md:py-24 bg-gradient-to-b from-background via-accent/5 to-background" 
        data-testid="section-baani"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <Card className="p-8">
            <div className="space-y-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (!data?.text) {
    return null;
  }

  return (
    <section 
      id="baani" 
      className="py-16 md:py-24 bg-gradient-to-b from-background via-accent/5 to-background animate-fade-in-up" 
      data-testid="section-baani"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" 
            data-testid="text-baani-title"
          >
            ਬਾਣੀ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਸਾਹਿਬ ਜੀ
          </h2>
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" 
            data-testid="text-baani-subtitle"
          >
            ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਵਿੱਚੋਂ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਦੀ ਪਵਿੱਤਰ ਬਾਣੀ
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed text-xl md:text-2xl"
                style={{ fontFamily: 'AnmolUni, Raavi, serif' }}
                data-testid="text-baani-content"
              >
                {data.text}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
