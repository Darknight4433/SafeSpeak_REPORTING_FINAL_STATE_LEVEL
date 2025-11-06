import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20 px-4">
          <div className="container max-w-4xl mx-auto text-center relative z-10">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slideUp">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Privacy & Security Policy
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Your safety and privacy are our highest priorities. Here's exactly how we protect you.
            </p>
            <p className="text-sm text-muted-foreground">
              Last Updated: January 2025
            </p>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Quick Summary</h2>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>All reports are encrypted using 256-bit encryption before storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Anonymous reports contain zero personally identifiable information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <UserCheck className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Only verified, trained child welfare officers can access reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Data stored in government-approved secure cloud infrastructure (Lovable Cloud)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Collect */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What Information We Collect</h2>
            
            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    For Anonymous Reports:
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Report category (e.g., bullying, abuse)</li>
                    <li>• Detailed description of the concern</li>
                    <li>• Optionally: age range, general location (school/city)</li>
                    <li>• Timestamp of submission</li>
                  </ul>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="font-semibold text-primary">
                      We do NOT collect: Name, email, phone number, or any identifiable data.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-secondary" />
                    For Named Reports:
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• All of the above</li>
                    <li>• Optional: Your name</li>
                    <li>• Optional: Contact information (only if you want follow-up)</li>
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground italic">
                    This information is only used to provide you with support and updates on your case.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How We Protect */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">How We Protect Your Data</h2>
            
            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-primary" />
                    End-to-End Encryption
                  </h3>
                  <p className="text-muted-foreground">
                    Every report is encrypted using industry-standard 256-bit AES encryption before it leaves your device. This means even if someone intercepts the data, they cannot read it.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-secondary" />
                    Secure Cloud Storage
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    All data is stored using Lovable Cloud, a government-approved secure infrastructure powered by Supabase. This includes:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Database-level encryption at rest</li>
                    <li>• Automatic backups with encryption</li>
                    <li>• Firewall protection and intrusion detection</li>
                    <li>• Regular security audits and compliance checks</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-accent" />
                    Access Control
                  </h3>
                  <p className="text-muted-foreground">
                    Only verified child welfare officers, counselors, and authorized government personnel can access reports. Each access is logged and audited for accountability.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who Can See */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Who Can See Your Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-accent">
                    <Eye className="h-6 w-6" />
                    Authorized Personnel Only:
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Trained child welfare officers</li>
                    <li>✓ School counselors (only for school-related reports)</li>
                    <li>✓ Law enforcement (only in cases involving crimes or immediate danger)</li>
                    <li>✓ Government child protection authorities</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-destructive">
                    <Shield className="h-6 w-6" />
                    Who CANNOT See Your Reports:
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✗ Other students</li>
                    <li>✗ Teachers (unless authorized by the system)</li>
                    <li>✗ Parents (unless you explicitly request it)</li>
                    <li>✗ The accused person (to protect you from retaliation)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Data Retention & Deletion</h2>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Reports are kept securely for as long as needed to:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>• Resolve your concern and ensure your safety</li>
                  <li>• Comply with legal requirements</li>
                  <li>• Prevent future incidents (anonymized data for trend analysis)</li>
                </ul>
                <Separator className="my-4" />
                <p className="text-muted-foreground">
                  Once a case is closed and no longer needed, personal information is deleted. Only anonymized, aggregated data may be kept for research and improvement purposes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Your Rights */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Your Rights</h2>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Access</h4>
                      <p className="text-sm text-muted-foreground">Request a copy of your submitted report (if named)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Update</h4>
                      <p className="text-sm text-muted-foreground">Correct any inaccurate information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Withdraw</h4>
                      <p className="text-sm text-muted-foreground">Request deletion of your data (unless legally required to keep)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Anonymous Forever</h4>
                      <p className="text-sm text-muted-foreground">If you report anonymously, we cannot trace it back to you</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions or concerns about how your information is protected, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-lg">📧 Email: privacy@safespeak.co</p>
              <p className="text-lg">📞 Privacy Helpline: 1800-XXX-XXXX</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
