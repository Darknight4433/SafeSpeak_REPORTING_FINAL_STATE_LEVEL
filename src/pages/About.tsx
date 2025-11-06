import { Shield, Lock, AlertCircle, CheckCircle, Zap, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20 px-4">
          <div className="container max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slideUp">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                About SafeSpeak
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A government-backed initiative to give every child a safe, confidential channel to report concerns and receive immediate support.
            </p>
          </div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-100" />
        </section>

        {/* The Problem */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AlertCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problem We're Solving</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Every day, countless children carry invisible wounds — bullying, abuse, emotional stress, academic pressure, and fears about their own safety. Yet most stay silent. Fear of punishment, lack of trust, and social stigma lock their voices away.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Their pain lingers in the shadows, unspoken and unresolved, slowly eroding their physical health, emotional strength, and future dreams. Right now, no safe or child-friendly system exists for them to share these struggles.
              </p>
              <p className="text-lg text-primary font-semibold leading-relaxed">
                Their cries vanish into silence, while problems grow darker. When a child's voice is silenced, we don't just lose a moment — we risk losing a life, a dream, and an entire future.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How SafeSpeak Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <h3 className="font-semibold mb-2">Choose Your Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Report anonymously or with your name — it's completely your choice.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-secondary mb-2">2</div>
                  <h3 className="font-semibold mb-2">Share Your Concern</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us what's bothering you in a safe, judgment-free environment.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-accent mb-2">3</div>
                  <h3 className="font-semibold mb-2">Secure Transmission</h3>
                  <p className="text-sm text-muted-foreground">
                    Your report is encrypted and sent directly to authorized professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">4</div>
                  <h3 className="font-semibold mb-2">Immediate Action</h3>
                  <p className="text-sm text-muted-foreground">
                    Trained officers review and respond with care, ensuring your safety.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why SafeSpeak is Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Multiple Access Points</h3>
                  <p className="text-sm text-muted-foreground">
                    School kiosks, mobile apps, and web portals ensure every child can reach us.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <Lock className="h-12 w-12 text-secondary mb-4" />
                  <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    Your reports are encrypted using industry-standard 256-bit encryption.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="pt-6">
                  <CheckCircle className="h-12 w-12 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">Trained Authorities</h3>
                  <p className="text-sm text-muted-foreground">
                    Reports reach verified child welfare officers, counselors, and law enforcement.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Immediate Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Urgent cases trigger instant alerts to ensure rapid intervention.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-secondary mb-4" />
                  <h3 className="font-semibold mb-2">Anti-Bullying Shield</h3>
                  <p className="text-sm text-muted-foreground">
                    We handle reports without exposing the reporter, using generalized interventions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="pt-6">
                  <CheckCircle className="h-12 w-12 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">Government Backed</h3>
                  <p className="text-sm text-muted-foreground">
                    An official initiative ensuring accountability and trustworthiness.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Innovation Edge */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Innovation Edge</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Unlike traditional complaint boxes or helplines, SafeSpeak is digitally integrated, proactive, and child-centered.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We disguise reporting within normal school activities (polls, quizzes, wellbeing tips), making it invisible, stigma-free, and safe. Our anti-bullying shield ensures that when a child reports, they are never exposed — instead, schools implement generalized interventions.
              </p>
              <p className="text-lg text-primary font-semibold leading-relaxed mt-4">
                This blend of technology, psychology, and design creates a scalable system that builds trust, empowers voices, and saves lives.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Your Data is Sacred</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20 text-center">
                <CardContent className="pt-6">
                  <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">256-bit Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank-level security protects every report
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 text-center">
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Secure Cloud Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Stored in government-approved secure servers (Lovable Cloud powered)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Verified Access Only</h3>
                  <p className="text-sm text-muted-foreground">
                    Only trained, authorized personnel can view reports
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-muted-foreground mt-8">
              All credentials and reports are encrypted and stored securely using Lovable Cloud, ensuring complete confidentiality and immediate routing to appropriate authorities.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
