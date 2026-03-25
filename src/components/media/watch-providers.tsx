import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import type { WatchProvider, WatchProviderRegion } from "@/types/tmdb";

interface WatchProvidersProps {
  providers: WatchProviderRegion;
}

function ProviderLogo({ provider }: { provider: WatchProvider }) {
  return (
    <div
      className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0"
      title={provider.provider_name}
    >
      <Image
        src={getImageUrl(provider.logo_path, "w92")}
        alt={provider.provider_name}
        fill
        className="object-cover"
        sizes="56px"
      />
    </div>
  );
}


function deduplicateProviders(providers: WatchProvider[]): WatchProvider[] {
  const seen = new Set<string>();
  return providers.filter((p) => {
    const baseName = p.provider_name.split(" ")[0].toLowerCase();
    if (seen.has(baseName)) return false;
    seen.add(baseName);
    return true;
  });
}

export function WatchProviders({ providers }: WatchProvidersProps) {
  const flatrate = deduplicateProviders(providers.flatrate ?? []);

  if (flatrate.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-display text-xl text-white mb-4">어디서 볼까요?</h2>
      <div className="flex flex-wrap gap-2">
        {flatrate.map((p) => (
          <ProviderLogo key={p.provider_id} provider={p} />
        ))}
      </div>
    </div>
  );
}
