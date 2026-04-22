import { useState } from "react";
import { Sparkles, Globe, Loader2, ArrowRight, CheckCircle2, X, Edit3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ScanResult {
  companyName: string;
  description: string;
  logoUrl?: string;
  industry?: string;
  socials: { platform: string; handle: string; url: string }[];
}

interface AIWebsiteScanStepProps {
  onSkip: () => void;
  onContinue: (result: ScanResult) => void;
}

// Mock crawl result generator — pretends to fetch the URL
const mockScan = (url: string): ScanResult => {
  const cleanHost = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split(".")[0];
  const name = cleanHost
    ? cleanHost.charAt(0).toUpperCase() + cleanHost.slice(1)
    : "Your Agency";
  return {
    companyName: `${name} Studio`,
    description: `${name} is a full-service creative studio helping ambitious brands grow through design, content, and social media.`,
    industry: "Creative Agency",
    socials: [
      { platform: "Instagram", handle: `@${cleanHost || "yourbrand"}`, url: `https://instagram.com/${cleanHost}` },
      { platform: "LinkedIn", handle: `${cleanHost || "yourbrand"}`, url: `https://linkedin.com/company/${cleanHost}` },
      { platform: "Twitter", handle: `@${cleanHost || "yourbrand"}_co`, url: `https://x.com/${cleanHost}` },
      { platform: "Facebook", handle: `/${cleanHost || "yourbrand"}`, url: `https://facebook.com/${cleanHost}` },
    ],
  };
};

const AIWebsiteScanStep = ({ onSkip, onContinue }: AIWebsiteScanStepProps) => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);
    // Simulate a 2s "AI crawl"
    setTimeout(() => {
      setResult(mockScan(url));
      setScanning(false);
    }, 1800);
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Let AI set you up in seconds</h2>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
          Drop your agency website. We'll fetch your name, logo, brand details, and social links automatically.
        </p>
      </div>

      {/* URL input */}
      {!result && (
        <>
          <div>
            <label className="text-xs font-semibold tracking-wider text-foreground mb-1.5 block">
              AGENCY WEBSITE
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                disabled={scanning}
                placeholder="yourdomain.com"
                className="w-full h-12 pl-10 pr-32 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none disabled:opacity-60"
              />
              <Button
                size="sm"
                onClick={handleScan}
                disabled={!url.trim() || scanning}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 shadow-coral"
              >
                {scanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Scanning…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Scan
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              We never store your website. Used only to pre-fill your profile.
            </p>
          </div>

          {/* Skeleton loader during scan */}
          {scanning && (
            <div className="mt-6 border border-dashed border-border rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted rounded w-2/3" />
                  <div className="h-2.5 bg-muted/70 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="h-2.5 bg-muted/70 rounded" />
                <div className="h-2.5 bg-muted/70 rounded w-5/6" />
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-20 bg-muted rounded-full" />
                ))}
              </div>
              <p className="text-[11px] text-center text-muted-foreground mt-4 not-italic flex items-center justify-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                Reading your site, finding your brand…
              </p>
            </div>
          )}
        </>
      )}

      {/* Result preview */}
      {result && (
        <div className="border-2 border-primary/30 bg-primary/[0.02] rounded-xl p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-xs font-semibold text-success uppercase tracking-wider">
              Found it!
            </span>
            <button
              onClick={() => {
                setResult(null);
                setUrl("");
              }}
              className="ml-auto text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Try again
            </button>
          </div>

          {/* Header row */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {result.companyName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{result.companyName}</p>
              {result.industry && (
                <p className="text-[11px] text-muted-foreground">{result.industry}</p>
              )}
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1" title="Edit details">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {result.description}
          </p>

          {/* Socials found */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Social profiles detected
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.socials.map((s) => (
                <span
                  key={s.platform}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-card border border-border px-2 py-1 rounded-md"
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  {s.platform}
                  <span className="text-muted-foreground">{s.handle}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-7">
        <button
          onClick={onSkip}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Skip, set up manually
        </button>
        <Button
          disabled={!result}
          onClick={() => result && onContinue(result)}
          size="lg"
          className="shadow-coral px-6"
        >
          Continue <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AIWebsiteScanStep;
