import { PolicyLayout } from "@/components/layout/policy-layout";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - WASPY",
  description:
    "Privacy policy and data protection information for WASPY's WhatsApp support platform.",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="Privacy policy and data protection information for WASPY's WhatsApp support platform."
      currentPage="Privacy"
    >
      <div className="prose dark:prose-invert">
        <div className="mb-8">
          <p>
            WASPY (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) is committed to maintaining robust privacy
            protections for its users. Our Privacy Policy is designed to help
            you understand how we collect, use and safeguard the information you
            provide to us and to assist you in making informed decisions when
            using our Service.
          </p>
          <p className="mt-4">
            For purposes of this Agreement, &quot;Site&quot; refers to the
            Company&apos;s website at waspy.unquest.ai. &quot;Service&quot;
            refers to our WhatsApp support platform that enables businesses to
            automate customer support through WhatsApp. By accessing our Site or
            Service, you accept our Privacy Policy and{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            , and consent to our collection, storage, use and disclosure of your
            Personal Information as described here.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            I. Information We Collect
          </h2>
          <p>
            We collect both &quot;Non-Personal Information&quot; and
            &quot;Personal Information&quot;:
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-4">
            1. Information collected via Technology
          </h3>
          <p>
            To use our Service, you initially only need to provide your email
            address. For full access, additional information is required. We
            automatically collect certain information when you use our Service,
            including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Referring URLs and exit pages</li>
            <li>Browser type and version</li>
            <li>Device information and IP address</li>
            <li>Access times and session duration</li>
            <li>Chat analytics and usage patterns</li>
            <li>WhatsApp integration metrics</li>
          </ul>

          <p className="mt-4">
            We use cookies and similar tracking technologies to collect this
            information. We use both persistent cookies (which remain until
            deleted) and session cookies (which expire when you close your
            browser). For example, we use persistent cookies to remember your
            preferences and session cookies to maintain your authentication
            state.
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-4">
            2. Information You Provide
          </h3>
          <p>To create an account, you must provide:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Email address and password</li>
            <li>Business name and contact details</li>
            <li>WhatsApp Business API credentials</li>
            <li>Payment information (processed securely via Stripe)</li>
            <li>Custom bot configurations and settings</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4">
            3. Children&apos;s Privacy
          </h3>
          <p>
            Our Service is not intended for anyone under 13 years old. We do not
            knowingly collect information from children under 13. If we discover
            we have such information, we will delete it immediately. Please
            contact us at privacy@waspy.ai if you believe we have collected
            information from a child under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            II. How We Use and Share Information
          </h2>

          <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
          <p>
            We do not sell or rent your Personal Information to third parties.
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>WhatsApp/Meta for platform integration</li>
            <li>Payment processors for transactions</li>
            <li>Cloud service providers for hosting</li>
            <li>Analytics services to improve our platform</li>
            <li>Law enforcement when legally required</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4">
            Non-Personal Information
          </h3>
          <p>
            We use Non-Personal Information to improve our Service and may share
            aggregated, anonymized data with partners and advertisers. This
            information cannot be used to identify you personally.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            III. Data Sharing and Disclosure
          </h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Service providers who assist in our operations</li>
            <li>WhatsApp and Meta platforms as required for integration</li>
            <li>Law enforcement when required by law</li>
            <li>Other parties with your explicit consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">IV. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            data, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Encryption in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Continuous monitoring and updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">V. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            VI. Cookies and Tracking
          </h2>
          <p>
            We use cookies and similar technologies to enhance your experience.
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            VII. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you
            of any material changes by posting the new policy on this page and
            updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">VIII. Contact Us</h2>
          <p>
            For privacy-related questions or concerns, please contact us at:{" "}
            <a
              href="mailto:privacy@waspy.ai"
              className="text-primary hover:underline"
            >
              privacy@waspy.ai
            </a>
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
