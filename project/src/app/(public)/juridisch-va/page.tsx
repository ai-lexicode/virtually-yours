import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Juridisch VA — Virtually Yours",
  description:
    "Flexibele inzet als Juridisch Virtual Assistant (VA) voor administratieve, juridische en secretariële ondersteuning (op afstand).",
};

export default function JuridischVaServicePage() {
  return (
    <>
      <section className="py-16 sm:py-20 text-center bg-surface-container-low border-b border-card-border">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-label text-primary tracking-wide mb-2 uppercase">Diensten</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface">
            Juridisch Virtual Assistant (VA)
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Als Juridisch Virtual Assistant (VA) bied ik tijdelijke of doorlopende ondersteuning 
            aan juridische dienstverleners, (online) ondernemers en advocatenkantoren. Ik werk 
            doorgaans remote, zodat je geen extra werkplek hoeft te regelen.
          </p>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Klantenstop Notice */}
          <div className="mb-12 rounded-2xl bg-primary/10 border border-primary/20 p-6 sm:p-8 flex items-start gap-4">
            <svg className="w-8 h-8 text-primary shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-serif text-xl font-bold text-on-surface mb-2">Momenteel Klantenstop</h3>
              <p className="text-muted leading-relaxed">
                Op dit moment heb ik weinig tot geen ruimte meer voor nieuwe structurele werkzaamheden als Juridisch VA voor continue bijstand.
                Ben je op zoek naar een goede VA? Stuur mij gerust een e-mail, dan kijk ik of ik een beschikbare collega binnen
                mijn netwerk kan aanbevelen die jou perfect kan ondersteunen.
              </p>
            </div>
          </div>

          {/* Pricing Options */}
          <h2 className="font-serif text-2xl font-bold text-on-surface mb-8">
            Tarieven en Samenwerkingsvormen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Abonnement */}
            <div className="bg-card border border-card-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-on-surface mb-2">Abonnement</h3>
              <p className="text-sm text-muted mb-4 line-clamp-4">
                Structurele ondersteuning voor een vast aantal uren per maand.
                Vanaf minimaal 2 uur per maand met een initiële termijn van ten minste 6 maanden.
              </p>
            </div>

            {/* Strippenkaart */}
            <div className="bg-card border border-card-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-on-surface mb-2">Strippenkaart</h3>
              <p className="text-sm text-muted mb-4 line-clamp-4">
                Pre-paid 10-uren kaart voor flexibele ondersteuning. Je koopt vooraf 10 uur in te zetten binnen je project.
                Deze strippenkaart is maximaal 1 jaar geldig na aanschaf.
              </p>
            </div>

            {/* Nacalculatie */}
            <div className="bg-card border border-card-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-on-surface mb-2">Nacalculatie</h3>
              <p className="text-sm text-muted mb-4 line-clamp-4">
                Ideaal voor losse afspraken of spoedklussen waarbij de uren vooraf niet direct zijn in te schatten.
                Facturering geschiedt achteraf (vanaf minimaal 1 uur per facturatiemoment).
              </p>
            </div>
            
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section bg="bg-sidebar">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl bg-card border border-card-border p-8 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              Interesse in samenwerking?
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Ondanks de strakke agenda, evalueer ik regelmatig de capaciteit en kijk ik met plezier of
              er op termijn ruimte is of ik jou kan koppelen aan iemand uit mijn netwerk.
            </p>
            <div className="mt-8">
              <Button href="/contact" size="lg">
                Neem contact op
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
