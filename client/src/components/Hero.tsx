export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/30" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
        <div className="space-y-6 md:space-y-8">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight"
            data-testid="text-hero-title"
          >
            ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ
          </h1>
          
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            ਧਰਮ ਤੇ ਮਨੁੱਖੀ ਅਧਿਕਾਰਾਂ ਦੇ ਰਖਿਆਕਰਤਾ
          </h2>

          <div className="max-w-3xl mx-auto pt-6">
            <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed" data-testid="text-hero-description">
              ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ (1 ਅਪਰੈਲ 1621 – 24 ਨਵੰਬਰ 1675) ਸਿੱਖਾਂ ਦੇ ਨੌਵੇਂ ਗੁਰੂ ਸਨ। 
              ਉਨ੍ਹਾਂ ਨੂੰ ਹਿੰਦ ਦੀ ਚਾਦਰ ਕਹਿ ਕੇ ਸਨਮਾਨਿਆ ਜਾਂਦਾ ਹੈ, ਕਿਉਂਕਿ ਉਨ੍ਹਾਂ ਨੇ ਧਰਮ ਦੀ ਰਾਖੀ ਲਈ ਮਹਾਨ ਕੁਰਬਾਨੀ ਦਿੱਤੀ।
            </p>
          </div>

          <div className="mt-12 p-8 md:p-12 bg-card/50 backdrop-blur-sm border border-card-border rounded-lg shadow-lg max-w-2xl mx-auto">
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary leading-relaxed" data-testid="text-hero-quote">
              "ਕਾਹੂ ਕਉ ਦੇਤੁ ਨ ਡਰੈ, ਨਾਹੁ ਡਰਾਵੈ।"
            </p>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground" data-testid="text-hero-quote-meaning">
              ਕਿਸੇ ਨੂੰ ਭੈ ਨਹੀਂ ਦਿੰਦੇ, ਨਾ ਕਿਸੇ ਤੋਂ ਡਰਦੇ ਹਨ
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById("biography")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md shadow-lg hover-elevate active-elevate-2 transition-all"
              data-testid="button-explore-biography"
            >
              ਜੀਵਨੀ ਪੜ੍ਹੋ
            </button>
            <button
              onClick={() => document.getElementById("shabads")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-card border border-card-border text-card-foreground font-semibold rounded-md shadow-lg hover-elevate active-elevate-2 backdrop-blur-sm transition-all"
              data-testid="button-explore-shabads"
            >
              ਬਾਣੀ ਸੁਣੋ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
