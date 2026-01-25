import { Building2, UserCog, Users, Briefcase } from "lucide-react"

const audiences = [
  {
    icon: Building2,
    title: "Insurance Brokers",
    description:
      "Quickly analyze client policies and provide data-driven recommendations to help them optimize coverage and reduce costs.",
  },
  {
    icon: UserCog,
    title: "Risk Managers",
    description:
      "Identify coverage gaps and potential risks across your organization's insurance portfolio with AI-powered insights.",
  },
  {
    icon: Users,
    title: "CFOs & Finance Teams",
    description:
      "Make informed decisions about insurance spend and coverage optimization with comprehensive financial analysis.",
  },
  {
    icon: Briefcase,
    title: "Business Owners",
    description:
      "Understand your insurance coverage in plain language and ensure your business is protected against all key risks.",
  },
]

export function WhoItsForSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Who It's For</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Helios is designed for professionals and businesses who need to make sense of complex insurance policies
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="flex flex-col items-start rounded-2xl border border-border/50 bg-card p-6 transition-colors hover:border-border"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <audience.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{audience.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
