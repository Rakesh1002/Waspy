import { PolicyLayout } from "@/components/layout/policy-layout";

export const metadata = {
  title: "Terms of Service - WASPY",
  description: "Terms and conditions for using WASPY's website.",
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      description="Please read these terms carefully before using our platform."
      currentPage="Terms"
    >
      <div className="prose dark:prose-invert">
        <div className="mb-8">
          <p>Version 1.0</p>
          <p>Last revised on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p>
            The website located at waspy.unquest.ai (the &quot;Site&quot;) is a
            copyrighted work belonging to UnQuest, Inc. (&quot;Company&quot;,
            &quot;us&quot;, &quot;our&quot;, and &quot;we&quot;). Certain
            features of the Site may be subject to additional guidelines, terms,
            or rules, which will be posted on the Site in connection with such
            features. All such additional terms, guidelines, and rules are
            incorporated by reference into these Terms.
          </p>
        </div>

        <div className="mb-8 font-semibold">
          <p className="mb-4">
            THESE TERMS OF USE (THESE &quot;TERMS&quot;) SET FORTH THE LEGALLY
            BINDING TERMS AND CONDITIONS THAT GOVERN YOUR USE OF THE SITE. BY
            ACCESSING OR USING THE SITE, YOU ARE ACCEPTING THESE TERMS (ON
            BEHALF OF YOURSELF OR THE ENTITY THAT YOU REPRESENT), AND YOU
            REPRESENT AND WARRANT THAT YOU HAVE THE RIGHT, AUTHORITY, AND
            CAPACITY TO ENTER INTO THESE TERMS (ON BEHALF OF YOURSELF OR THE
            ENTITY THAT YOU REPRESENT). YOU MAY NOT ACCESS OR USE THE SITE OR
            ACCEPT THE TERMS IF YOU ARE NOT AT LEAST 18 YEARS OLD. IF YOU DO NOT
            AGREE WITH ALL OF THE PROVISIONS OF THESE TERMS, DO NOT ACCESS
            AND/OR USE THE SITE.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Accounts</h2>
          <h3 className="text-xl mb-2">1.1 Account Creation</h3>
          <p>
            In order to use certain features of the Site, you must register for
            an account (&quot;Account&quot;) and provide certain information
            about yourself as prompted by the account registration form. You
            represent and warrant that: (a) all required registration
            information you submit is truthful and accurate; (b) you will
            maintain the accuracy of such information. You may delete your
            Account at any time, for any reason, by following the instructions
            on the Site. Company may suspend or terminate your Account in
            accordance with Section 7.
          </p>

          <h3 className="text-xl mb-2 mt-4">1.2 Account Responsibilities</h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            Account login information and are fully responsible for all
            activities that occur under your Account. You agree to immediately
            notify Company of any unauthorized use, or suspected unauthorized
            use of your Account or any other breach of security. Company cannot
            and will not be liable for any loss or damage arising from your
            failure to comply with the above requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Access to the Site</h2>

          <h3 className="text-xl mb-2">2.1 License</h3>
          <p>
            Subject to these Terms, Company grants you a non-transferable,
            non-exclusive, revocable, limited license to use and access the Site
            solely for your own personal, noncommercial use.
          </p>

          <h3 className="text-xl mb-2 mt-4">2.2 Certain Restrictions</h3>
          <p>
            The rights granted to you in these Terms are subject to the
            following restrictions: (a) you shall not license, sell, rent,
            lease, transfer, assign, distribute, host, or otherwise commercially
            exploit the Site, whether in whole or in part, or any content
            displayed on the Site; (b) you shall not modify, make derivative
            works of, disassemble, reverse compile or reverse engineer any part
            of the Site; (c) you shall not access the Site in order to build a
            similar or competitive website, product, or service; and (d) except
            as expressly stated herein, no part of the Site may be copied,
            reproduced, distributed, republished, downloaded, displayed, posted
            or transmitted in any form or by any means. Unless otherwise
            indicated, any future release, update, or other addition to
            functionality of the Site shall be subject to these Terms. All
            copyright and other proprietary notices on the Site (or on any
            content displayed on the Site) must be retained on all copies
            thereof.
          </p>

          <h3 className="text-xl mb-2 mt-4">2.3 Modification</h3>
          <p>
            Company reserves the right, at any time, to modify, suspend, or
            discontinue the Site (in whole or in part) with or without notice to
            you. You agree that Company will not be liable to you or to any
            third party for any modification, suspension, or discontinuation of
            the Site or any part thereof.
          </p>

          <h3 className="text-xl mb-2 mt-4">2.4 No Support or Maintenance</h3>
          <p>
            You acknowledge and agree that Company will have no obligation to
            provide you with any support or maintenance in connection with the
            Site.
          </p>

          <h3 className="text-xl mb-2 mt-4">2.5 Ownership</h3>
          <p>
            You acknowledge that all the intellectual property rights, including
            copyrights, patents, trade marks, and trade secrets, in the Site and
            its content are owned by Company or Company&apos;s suppliers.
            Neither these Terms (nor your access to the Site) transfers to you
            or any third party any rights, title or interest in or to such
            intellectual property rights, except for the limited access rights
            expressly set forth in Section 2.1. Company and its suppliers
            reserve all rights not granted in these Terms. There are no implied
            licenses granted under these Terms.
          </p>

          <h3 className="text-xl mb-2 mt-4">2.6 Feedback</h3>
          <p>
            If you provide Company with any feedback or suggestions regarding
            the Site (&quot;Feedback&quot;), you hereby assign to Company all
            rights in such Feedback and agree that Company shall have the right
            to use and fully exploit such Feedback and related information in
            any manner it deems appropriate. Company will treat any Feedback you
            provide to Company as non-confidential and non-proprietary. You
            agree that you will not submit to Company any information or ideas
            that you consider to be confidential or proprietary.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Indemnification</h2>
          <p>
            You agree to indemnify and hold Company (and its officers,
            employees, and agents) harmless, including costs and attorneys&apos;
            fees, from any claim or demand made by any third party due to or
            arising out of (a) your use of the Site, (b) your violation of these
            Terms or (c) your violation of applicable laws or regulations.
            Company reserves the right, at your expense, to assume the exclusive
            defense and control of any matter for which you are required to
            indemnify us, and you agree to cooperate with our defense of these
            claims. You agree not to settle any matter without the prior written
            consent of Company. Company will use reasonable efforts to notify
            you of any such claim, action or proceeding upon becoming aware of
            it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Third-Party Links & Ads; Other Users
          </h2>

          <h3 className="text-xl mb-2">4.1 Third-Party Links & Ads</h3>
          <p>
            The Site may contain links to third-party websites and services,
            and/or display advertisements for third parties (collectively,
            &quot;Third-Party Links & Ads&quot;). Such Third-Party Links & Ads
            are not under the control of Company, and Company is not responsible
            for any Third-Party Links & Ads. Company provides access to these
            Third-Party Links & Ads only as a convenience to you, and does not
            review, approve, monitor, endorse, warrant, or make any
            representations with respect to Third-Party Links & Ads. You use all
            Third-Party Links & Ads at your own risk, and should apply a
            suitable level of caution and discretion in doing so. When you click
            on any of the Third-Party Links & Ads, the applicable third
            party&apos;s terms and policies apply, including the third
            party&apos;s privacy and data gathering practices.
          </p>

          <h3 className="text-xl mb-2 mt-4">4.2 Other Users</h3>
          <p>
            Your interactions with other Site users are solely between you and
            such users. You agree that Company will not be responsible for any
            loss or damage incurred as the result of any such interactions. If
            there is a dispute between you and any Site user, we are under no
            obligation to become involved.
          </p>

          <h3 className="text-xl mb-2 mt-4">4.3 Release</h3>
          <p>
            You hereby release and forever discharge Company (and our officers,
            employees, agents, successors, and assigns) from, and hereby waive
            and relinquish, each and every past, present and future dispute,
            claim, controversy, demand, right, obligation, liability, action and
            cause of action of every kind and nature (including personal
            injuries, death, and property damage), that has arisen or arises
            directly or indirectly out of, or that relates directly or
            indirectly to, the Site (including any interactions with, or act or
            omission of, other Site users or any Third-Party Links & Ads).
          </p>
          <p className="mt-4 font-semibold">
            IF YOU ARE A CALIFORNIA RESIDENT, YOU HEREBY WAIVE CALIFORNIA CIVIL
            CODE SECTION 1542 IN CONNECTION WITH THE FOREGOING, WHICH STATES:
            &quot;A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR
            OR RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER
            FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM OR
            HER MUST HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE
            DEBTOR OR RELEASED PARTY.&quot;
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Disclaimers</h2>
          <p className="font-semibold">
            THE SITE IS PROVIDED ON AN &quot;AS-IS&quot; AND &quot;AS
            AVAILABLE&quot; BASIS, AND COMPANY (AND OUR SUPPLIERS) EXPRESSLY
            DISCLAIM ANY AND ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER
            EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ALL WARRANTIES OR
            CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            TITLE, QUIET ENJOYMENT, ACCURACY, OR NON-INFRINGEMENT. WE (AND OUR
            SUPPLIERS) MAKE NO WARRANTY THAT THE SITE WILL MEET YOUR
            REQUIREMENTS, WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE,
            OR ERROR-FREE BASIS, OR WILL BE ACCURATE, RELIABLE, FREE OF VIRUSES
            OR OTHER HARMFUL CODE, COMPLETE, LEGAL, OR SAFE. IF APPLICABLE LAW
            REQUIRES ANY WARRANTIES WITH RESPECT TO THE SITE, ALL SUCH
            WARRANTIES ARE LIMITED IN DURATION TO 90 DAYS FROM THE DATE OF FIRST
            USE.
          </p>
          <p className="mt-4">
            SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES,
            SO THE ABOVE EXCLUSION MAY NOT APPLY TO YOU. SOME JURISDICTIONS DO
            NOT ALLOW LIMITATIONS ON HOW LONG AN IMPLIED WARRANTY LASTS, SO THE
            ABOVE LIMITATION MAY NOT APPLY TO YOU.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Limitation on Liability
          </h2>
          <p className="font-semibold mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL COMPANY
            (OR OUR SUPPLIERS) BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY LOST
            PROFITS, LOST DATA, COSTS OF PROCUREMENT OF SUBSTITUTE PRODUCTS, OR
            ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR
            PUNITIVE DAMAGES ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE
            OF, OR INABILITY TO USE, THE SITE, EVEN IF COMPANY HAS BEEN ADVISED
            OF THE POSSIBILITY OF SUCH DAMAGES. ACCESS TO, AND USE OF, THE SITE
            IS AT YOUR OWN DISCRETION AND RISK, AND YOU WILL BE SOLELY
            RESPONSIBLE FOR ANY DAMAGE TO YOUR DEVICE OR COMPUTER SYSTEM, OR
            LOSS OF DATA RESULTING THEREFROM.
          </p>

          <p className="font-semibold mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOTWITHSTANDING ANYTHING TO
            THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY DAMAGES
            ARISING FROM OR RELATED TO THESE TERMS (FOR ANY CAUSE WHATSOEVER AND
            REGARDLESS OF THE FORM OF THE ACTION), WILL AT ALL TIMES BE LIMITED
            TO A MAXIMUM OF FIFTY US DOLLARS. THE EXISTENCE OF MORE THAN ONE
            CLAIM WILL NOT ENLARGE THIS LIMIT. YOU AGREE THAT OUR SUPPLIERS WILL
            HAVE NO LIABILITY OF ANY KIND ARISING FROM OR RELATING TO THESE
            TERMS.
          </p>

          <p>
            SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF
            LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE
            LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Term and Termination
          </h2>
          <p>
            Subject to this Section, these Terms will remain in full force and
            effect while you use the Site. We may suspend or terminate your
            rights to use the Site (including your Account) at any time for any
            reason at our sole discretion, including for any use of the Site in
            violation of these Terms. Upon termination of your rights under
            these Terms, your Account and right to access and use the Site will
            terminate immediately. Company will not have any liability
            whatsoever to you for any termination of your rights under these
            Terms, including for termination of your Account. Even after your
            rights under these Terms are terminated, the following provisions of
            these Terms will remain in effect: Sections 2.2 through 2.6 and
            Sections 3 through 8.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. General</h2>

          <h3 className="text-xl mb-2">8.1 Changes</h3>
          <p>
            These Terms are subject to occasional revision, and if we make any
            substantial changes, we may notify you by sending you an e-mail to
            the last e-mail address you provided to us (if any), and/or by
            prominently posting notice of the changes on our Site. You are
            responsible for providing us with your most current e-mail address.
            In the event that the last e-mail address that you have provided us
            is not valid, or for any reason is not capable of delivering to you
            the notice described above, our dispatch of the e-mail containing
            such notice will nonetheless constitute effective notice of the
            changes described in the notice. Continued use of our Site following
            notice of such changes shall indicate your acknowledgement of such
            changes and agreement to be bound by the terms and conditions of
            such changes.
          </p>

          <h3 className="text-xl mb-2 mt-4">8.2 Dispute Resolution</h3>
          <p className="mb-4">
            Please read the following arbitration agreement in this Section (the
            &quot;Arbitration Agreement&quot;) carefully. It requires you to
            arbitrate disputes with Company, its parent companies, subsidiaries,
            affiliates, successors and assigns and all of their respective
            officers, directors, employees, agents, and representatives
            (collectively, the &quot;Company Parties&quot;) and limits the
            manner in which you can seek relief from the Company Parties.
          </p>

          <div className="pl-4">
            <h4 className="text-lg mb-2 mt-4">
              (a) Applicability of Arbitration Agreement
            </h4>
            <p className="mb-4">
              You agree that any dispute between you and any of the Company
              Parties relating in any way to the Site, the services offered on
              the Site (the &quot;Services&quot;) or these Terms will be
              resolved by binding arbitration, rather than in court, except that
              (1) you and the Company Parties may assert individualized claims
              in small claims court if the claims qualify, remain in such court
              and advance solely on an individual, non-class basis; and (2) you
              or the Company Parties may seek equitable relief in court for
              infringement or other misuse of intellectual property rights (such
              as trademarks, trade dress, domain names, trade secrets,
              copyrights, and patents).
            </p>

            <h4 className="text-lg mb-2 mt-4">
              (b) Informal Dispute Resolution
            </h4>
            <p className="mb-4">
              There might be instances when a Dispute arises between you and
              Company. If that occurs, Company is committed to working with you
              to reach a reasonable resolution. You and Company agree that good
              faith informal efforts to resolve Disputes can result in a prompt,
              low‐cost and mutually beneficial outcome.
            </p>

            <h4 className="text-lg mb-2 mt-4">
              (c) Arbitration Rules and Forum
            </h4>
            <p className="mb-4">
              These Terms evidence a transaction involving interstate commerce;
              and notwithstanding any other provision herein with respect to the
              applicable substantive law, the Federal Arbitration Act, 9 U.S.C.
              § 1 et seq., will govern the interpretation and enforcement of
              this Arbitration Agreement and any arbitration proceedings.
            </p>

            <h4 className="text-lg mb-2 mt-4">(d) Authority of Arbitrator</h4>
            <p className="mb-4">
              The arbitrator shall have exclusive authority to resolve all
              disputes subject to arbitration hereunder including, without
              limitation, any dispute related to the interpretation,
              applicability, enforceability or formation of this Arbitration
              Agreement or any portion of the Arbitration Agreement.
            </p>

            <h4 className="text-lg mb-2 mt-4">(e) Waiver of Jury Trial</h4>
            <p className="mb-4 font-semibold">
              EXCEPT AS SPECIFIED IN SECTION 8.2(A) YOU AND THE COMPANY PARTIES
              HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN
              COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY.
            </p>

            <h4 className="text-lg mb-2 mt-4">
              (f) Waiver of Class or Other Non-Individualized Relief
            </h4>
            <p className="mb-4 font-semibold">
              YOU AND COMPANY AGREE THAT, EXCEPT AS SPECIFIED IN SUBSECTION
              8.2(H) EACH OF US MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN
              INDIVIDUAL BASIS AND NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE
              BASIS.
            </p>

            <h4 className="text-lg mb-2 mt-4">
              (g) Attorneys&apos; Fees and Costs
            </h4>
            <p className="mb-4">
              The parties shall bear their own attorneys&apos; fees and costs in
              arbitration unless the arbitrator finds that either the substance
              of the Dispute or the relief sought in the Request was frivolous
              or was brought for an improper purpose.
            </p>

            <h4 className="text-lg mb-2 mt-4">(h) Batch Arbitration</h4>
            <p className="mb-4">
              To increase the efficiency of administration and resolution of
              arbitrations, you and Company agree that in the event that there
              are 100 or more individual Requests of a substantially similar
              nature filed against Company by or with the assistance of the same
              law firm, group of law firms, or organizations, within a 30 day
              period, the JAMS shall administer the arbitration demands in
              batches.
            </p>

            <h4 className="text-lg mb-2 mt-4">(i) 30-Day Right to Opt Out</h4>
            <p className="mb-4">
              You have the right to opt out of the provisions of this
              Arbitration Agreement by sending a timely written notice of your
              decision to opt out to: 1111B S Governors Ave STE 25082 Dover, DE,
              19904 US, or email to rakesh@unquest.ai, within 30 days after
              first becoming subject to this Arbitration Agreement.
            </p>

            <h4 className="text-lg mb-2 mt-4">(j) Invalidity, Expiration</h4>
            <p className="mb-4">
              Except as provided in the subsection entitled &quot;Waiver of
              Class or Other Non-Individualized Relief&quot;, if any part or
              parts of this Arbitration Agreement are found under the law to be
              invalid or unenforceable, then such specific part or parts shall
              be of no force and effect.
            </p>

            <h4 className="text-lg mb-2 mt-4">(k) Modification</h4>
            <p className="mb-4">
              Notwithstanding any provision in these Terms to the contrary, we
              agree that if Company makes any future material change to this
              Arbitration Agreement, you may reject that change within 30 days
              of such change becoming effective by writing Company at the
              address provided above.
            </p>
          </div>

          <h3 className="text-xl mb-2 mt-4">8.3 Export</h3>
          <p className="mb-4">
            The Site may be subject to U.S. export control laws and may be
            subject to export or import regulations in other countries. You
            agree not to export, reexport, or transfer, directly or indirectly,
            any U.S. technical data acquired from Company, or any products
            utilizing such data, in violation of the United States export laws
            or regulations.
          </p>

          <h3 className="text-xl mb-2 mt-4">8.4 Disclosures</h3>
          <p className="mb-4">
            Company is located at the address in Section 8.8. If you are a
            California resident, you may report complaints to the Complaint
            Assistance Unit of the Division of Consumer Product of the
            California Department of Consumer Affairs by contacting them in
            writing at 400 R Street, Sacramento, CA 95814, or by telephone at
            (800) 952-5210.
          </p>

          <h3 className="text-xl mb-2 mt-4">8.5 Electronic Communications</h3>
          <p className="mb-4">
            The communications between you and Company use electronic means,
            whether you use the Site or send us emails, or whether Company posts
            notices on the Site or communicates with you via email. For
            contractual purposes, you (a) consent to receive communications from
            Company in an electronic form; and (b) agree that all terms and
            conditions, agreements, notices, disclosures, and other
            communications that Company provides to you electronically satisfy
            any legal requirement that such communications would satisfy if it
            were be in a hardcopy writing. The foregoing does not affect your
            non-waivable rights.
          </p>

          <h3 className="text-xl mb-2 mt-4">8.6 Entire Terms</h3>
          <p className="mb-4">
            These Terms constitute the entire agreement between you and us
            regarding the use of the Site. Our failure to exercise or enforce
            any right or provision of these Terms shall not operate as a waiver
            of such right or provision. The section titles in these Terms are
            for convenience only and have no legal or contractual effect. The
            word &quot;including&quot; means &quot;including without
            limitation&quot;. If any provision of these Terms is, for any
            reason, held to be invalid or unenforceable, the other provisions of
            these Terms will be unimpaired and the invalid or unenforceable
            provision will be deemed modified so that it is valid and
            enforceable to the maximum extent permitted by law.
          </p>

          <h3 className="text-xl mb-2 mt-4">
            8.7 Copyright/Trademark Information
          </h3>
          <p className="mb-4">
            Copyright © {new Date().getFullYear()} UnQuest, Inc. All rights
            reserved. All trademarks, logos and service marks
            (&quot;Marks&quot;) displayed on the Site are our property or the
            property of other third parties. You are not permitted to use these
            Marks without our prior written consent or the consent of such third
            party which may own the Marks.
          </p>

          <h3 className="text-xl mb-2 mt-4">8.8 Contact Information</h3>
          <div className="mb-4">
            <p>Rakesh Roushan</p>
            <p>1111B S Governors Ave STE 25082</p>
            <p>Dover, Delaware 19904</p>
            <p>United States</p>
            <p className="mt-2">Phone: (740) 272-5155</p>
            <p>
              Email:{" "}
              <a
                href="mailto:rakesh@unquest.ai"
                className="text-primary hover:underline"
              >
                rakesh@unquest.ai
              </a>
            </p>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
}
