import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { WhoItsForSection } from "@/components/who-its-for-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhoItsForSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  )
}
