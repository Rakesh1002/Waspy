import React from "react";
import {
  Shield,
  FileCheck,
  Globe,
  Book,
  Lock,
  CheckCircle,
} from "lucide-react";
import { PolicyLayout } from "@/components/layout/policy-layout";

export default function CompliancePage() {
  return (
    <PolicyLayout
      title="Compliance"
      description="We maintain strict compliance with international regulations and industry standards."
      currentPage="Compliance"
    >
      <div className="space-y-8">
        {/* Framework Section - Full Width */}
        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
          <h2 className="flex items-center gap-3 mt-0">
            <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Our Compliance Framework
            </span>
          </h2>
          <p className="text-muted-foreground pt-4">
            WASPY maintains comprehensive compliance with international data
            protection regulations, industry standards, and WhatsApp&apos;s
            business requirements. Our multi-layered compliance framework
            ensures the highest level of service while protecting our
            customers&apos; data and interests.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Protection - Large Card */}
          <div className="md:col-span-2 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Data Protection Compliance</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">GDPR Compliance</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Data Processing Agreements (DPAs)</li>
                  <li>• Data Protection Impact Assessments</li>
                  <li>• Data Subject Rights Management</li>
                  <li>• Privacy by Design Implementation</li>
                  <li>• Cross-border Data Transfer Compliance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">CCPA Compliance</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Consumer Rights Management</li>
                  <li>• Data Mapping and Inventory</li>
                  <li>• Privacy Notice Requirements</li>
                  <li>• Opt-out Mechanisms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* WhatsApp Business Compliance */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>WhatsApp Business</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">
                  Platform Requirements
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Official WhatsApp Business Solution Provider</li>
                  <li>• API Usage Guidelines Compliance</li>
                  <li>• Message Template Approval Process</li>
                  <li>• Quality Rating Monitoring</li>
                  <li>• Business Verification Standards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Standards */}
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Security Standards</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">Certifications</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• ISO 27001 Certified Processes</li>
                  <li>• SOC 2 Type II Compliance</li>
                  <li>• PCI DSS Compliance</li>
                  <li>• Regular Third-party Assessments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI Ethics - Large Card */}
          <div className="md:col-span-2 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-sm">
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>AI Ethics & Compliance</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">AI Governance</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Ethical AI Development Guidelines</li>
                  <li>• Bias Prevention Measures</li>
                  <li>• Transparency in AI Operations</li>
                  <li>• Regular AI Audits</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Data Handling</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI Training Data Protection</li>
                  <li>• Model Privacy Standards</li>
                  <li>• Output Filtering Systems</li>
                  <li>• Continuous Monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section - Full Width */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 p-8 rounded-2xl border shadow-sm">
          <h3 className="flex items-center gap-3 text-xl font-semibold mb-4">
            <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Contact Compliance Team</span>
          </h3>
          <p className="text-muted-foreground">
            For compliance-related inquiries or to request compliance
            documentation, please contact our compliance team at{" "}
            <a
              href="mailto:compliance@waspy.ai"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              compliance@waspy.ai
            </a>
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
