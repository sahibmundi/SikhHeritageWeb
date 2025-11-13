import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors"
            data-testid="link-home"
          >
            ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("biography")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors hover-elevate px-3 py-2 rounded-md"
              data-testid="link-biography"
            >
              ਜੀਵਨੀ
            </button>
            <button
              onClick={() => scrollToSection("shabads")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors hover-elevate px-3 py-2 rounded-md"
              data-testid="link-shabads"
            >
              ਬਾਣੀ ਅਤੇ ਰਾਗ
            </button>
            <button
              onClick={() => scrollToSection("gurdwaras")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors hover-elevate px-3 py-2 rounded-md"
              data-testid="link-gurdwaras"
            >
              ਗੁਰਦੁਆਰੇ ਸਾਹਿਬ
            </button>
            <button
              onClick={() => scrollToSection("resources")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors hover-elevate px-3 py-2 rounded-md"
              data-testid="link-resources"
            >
              ਸਰੋਤ
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle-mobile"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2" data-testid="mobile-menu">
            <button
              onClick={() => scrollToSection("biography")}
              className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              data-testid="link-biography-mobile"
            >
              ਜੀਵਨੀ
            </button>
            <button
              onClick={() => scrollToSection("shabads")}
              className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              data-testid="link-shabads-mobile"
            >
              ਬਾਣੀ ਅਤੇ ਰਾਗ
            </button>
            <button
              onClick={() => scrollToSection("gurdwaras")}
              className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              data-testid="link-gurdwaras-mobile"
            >
              ਗੁਰਦੁਆਰੇ ਸਾਹਿਬ
            </button>
            <button
              onClick={() => scrollToSection("resources")}
              className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              data-testid="link-resources-mobile"
            >
              ਸਰੋਤ
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
