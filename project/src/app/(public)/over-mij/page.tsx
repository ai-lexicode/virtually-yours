import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Over mij — Virtually Yours",
  description:
    "Maak kennis met Risha Smeding — freelance jurist, Legal Engineer & Juridisch VA.",
};

export default function OverMijPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-card-border shadow-lg">
                <Image
                  src="/images/profile-risha.jpg"
                  alt="Risha Smeding"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-sm font-medium text-primary tracking-wide uppercase mb-2">
                Over mij
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold">Risha Smeding</h1>
              <p className="mt-2 text-lg text-primary font-medium">
                Freelance jurist, Legal Engineer &amp; Juridisch VA
              </p>

              <div className="mt-6 space-y-4 text-muted leading-relaxed">
                <p>
                  Al enige jaren ben ik werkzaam als virtueel assistent en online
                  business manager. Nadat ik Rechtsgeleerdheid was gaan studeren
                  aan de Open Universiteit, ben ik mij als VA volledig gaan
                  richten op de juridische niche.
                </p>
                <p>
                  Als juridisch VA help ik online ondernemers aan een goed
                  juridisch fundament van hun onderneming. Denk hierbij aan
                  juridische documenten zoals algemene voorwaarden,
                  privacyverklaringen en verwerkersovereenkomsten, specifiek
                  afgestemd op de situatie van de ondernemer.
                </p>
                <p>
                  Ik ondersteun ook juridische dienstverleners, zoals
                  adviesbureaus en advocatenkantoren. Mijn werkzaamheden voer ik
                  remote uit.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button href="/contact">Neem contact op</Button>
                <Button href="/documenten" variant="outline">
                  Bekijk documenten
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services detail */}
      <Section
        title="Mijn diensten"
        subtitle="Ik bied drie kernservices aan voor online ondernemers en juridische dienstverleners."
        bg="bg-sidebar"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Juridisch VA",
              description:
                "Als juridisch virtueel assistent ondersteun ik juridische dienstverleners op afstand. Van onderzoek en correspondentie tot het opstellen van documenten — ik werk nauwkeurig en zelfstandig.",
              icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0",
            },
            {
              title: "Juridische Documenten",
              description:
                "Juridische documenten op maat voor online professionals. Van algemene voorwaarden tot verwerkersovereenkomsten — specifiek afgestemd op jouw situatie als VA, OBM of SMM.",
              icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
            },
            {
              title: "Coaching VAs",
              description:
                "Ik begeleid startende juridische VA's bij het opzetten van hun praktijk. Van het vinden van de juiste klanten tot het opbouwen van een sterk juridisch fundament voor hun eigen onderneming.",
              icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="rounded-xl bg-card border border-card-border p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={service.icon}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 p-6 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Wil je samenwerken?
            </h2>
            <p className="mt-4 text-muted">
              Neem gerust contact op voor een vrijblijvend kennismakingsgesprek.
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
