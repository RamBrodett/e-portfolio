import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getCertifications } from "@/lib/certifications";
import { SectionHeading } from "@/components/section-heading";

export function CertificationsSection() {
  const certifications = getCertifications();
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="scroll-mt-16 py-24">
      <SectionHeading title="Certifications" meta={`${certifications.length}`} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {certifications.map((cert) => (
          <div
            key={`${cert.issuer}-${cert.name}`}
            className="flex flex-col gap-1.5 rounded-xl border border-border bg-card/90 p-5"
          >
            <span aria-hidden="true" className="mb-3 grid size-9 place-items-center border border-border">
              <span className="size-2 bg-primary" />
            </span>
            <h3 className="font-semibold leading-snug tracking-tight">{cert.name}</h3>
            <p className="text-[15px] text-muted-foreground">{cert.issuer}</p>
            <p className="font-mono text-xs text-muted-foreground">
              Issued {cert.issued}
              {cert.expires ? ` · Expires ${cert.expires}` : ""}
              {cert.credentialId ? ` · ID ${cert.credentialId}` : ""}
            </p>
            {cert.url && (
              <Link
                href={cert.url}
                target="_blank"
                className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Show credential <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
