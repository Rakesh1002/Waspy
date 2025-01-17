import React from "react";
import {
  Shield,
  Lock,
  Server,
  Bell,
  Key,
  Users,
  ShieldCheck,
  Database,
} from "lucide-react";
import { PolicyLayout } from "@/components/layout/policy-layout";

export default function SecurityPage() {
  return (
    <PolicyLayout
      title="Security"
      description="Your trust is our priority. We implement industry-leading security measures to protect your data."
      currentPage="Security"
    >
      <div className="space-y-8">
        {/* Framework Section - Full Width */}
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
          <h2 className="flex items-center gap-3 mt-0">
            <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Our Security Commitment
            </span>
          </h2>
          <p className="text-muted-foreground pt-4">
            At WASPY, security is our top priority. As a WhatsApp Business
            Solution Provider handling sensitive business communications and AI
            interactions, we implement comprehensive security measures that
            exceed industry standards to protect your data and ensure platform
            integrity.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Protection - Large Card */}
          <div className="md:col-span-2 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Data Protection & Encryption</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">
                  Communication Security
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• End-to-end encryption for WhatsApp communications</li>
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• TLS 1.3 for all data in transit</li>
                  <li>• Regular penetration testing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Data Management</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Automated security scanning</li>
                  <li>• Multi-region data backups</li>
                  <li>• Data retention policies</li>
                  <li>• Secure key management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Infrastructure</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">Cloud Security</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AWS multi-zone infrastructure</li>
                  <li>• Advanced DDoS protection</li>
                  <li>• Network segmentation</li>
                  <li>• Regular security patches</li>
                  <li>• Load balancing & auto-scaling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Access Control</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">Authentication</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Role-based access control</li>
                  <li>• Multi-factor authentication</li>
                  <li>• SSO integration options</li>
                  <li>• Regular access reviews</li>
                  <li>• Strong password policies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI Security - Large Card */}
          <div className="md:col-span-2 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>AI Model Security</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Model Protection</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Secure training environment</li>
                  <li>• Regular vulnerability assessments</li>
                  <li>• Input validation & sanitization</li>
                  <li>• Prompt injection protection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Safety Measures</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Output filtering systems</li>
                  <li>• Secure deployment pipeline</li>
                  <li>• Behavior monitoring</li>
                  <li>• Ethics guidelines</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Incident Response</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">Monitoring</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 24/7 security monitoring</li>
                  <li>• Automated threat detection</li>
                  <li>• Incident response drills</li>
                  <li>• Real-time dashboards</li>
                  <li>• Backup procedures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Employee Security */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Employee Security</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">
                  Training & Policy
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Security awareness training</li>
                  <li>• Background checks</li>
                  <li>• Device management</li>
                  <li>• Access protocols</li>
                  <li>• Compliance checks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section - Full Width */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 p-8 rounded-2xl border shadow-sm">
          <h3 className="flex items-center gap-3 text-xl font-semibold mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Contact Security Team</span>
          </h3>
          <p className="text-muted-foreground">
            For security-related inquiries or to report security issues, please
            contact our security team at{" "}
            <a
              href="mailto:security@waspy.ai"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              security@waspy.ai
            </a>
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
