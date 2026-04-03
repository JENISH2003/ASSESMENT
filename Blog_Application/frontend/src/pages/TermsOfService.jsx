
export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white text-slate-900 font-sans min-h-screen py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12 lg:p-16">
        
        {/* 1. Page Header */}
        <header className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Terms of Service</h1>
          <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-12 text-slate-700 leading-relaxed text-lg">
          
          {/* 2. Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using BlogVerse ("the Website", "the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access or use our services. These terms constitute a legally binding agreement between you and BlogVerse.
            </p>
          </section>

          {/* 3. User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">2. User Responsibilities</h2>
            <p className="mb-4">As a condition of your use of the Service, you agree to the following responsibilities:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Accuracy of Information:</strong> You must provide accurate, complete, and current information when registering for an account.</li>
              <li><strong>Lawful Use:</strong> You may not use the Service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction while using the platform.</li>
              <li><strong>Respectful Interaction:</strong> You agree not to post abusive, defamatory, harassing, or otherwise objectionable content.</li>
            </ul>
          </section>

          {/* 4. Account Rules */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">3. Account Rules and Security</h2>
            <p>
              You are entirely responsible for maintaining the confidentiality of your account credentials (e.g., password) and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the absolute right to suspend, disable, or terminate accounts at any time, with or without cause or prior notice, in our sole discretion.
            </p>
          </section>

          {/* 5. Content Ownership */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">4. Content Ownership and Licensing</h2>
            <p className="mb-4">
              <strong>Your Content:</strong> You retain full ownership, copyright, and any other associated rights to any original content you submit, post, or display on or through the Service.
            </p>
            <p>
              <strong>Our License:</strong> By publishing content on BlogVerse, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content in any existing or future media for the purpose of operating and promoting the platform. We reserve the right to moderate, remove, or modify any content that violates these terms.
            </p>
          </section>

          {/* 6. Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">5. Prohibited Activities</h2>
            <p className="mb-4">Users are strictly prohibited from engaging in the following activities:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Spamming:</strong> Unsolicited promotional materials, phishing links, or repetitive arbitrary comments.</li>
              <li><strong>Hacking:</strong> Attempting to interfere with, compromise the system integrity, or decipher any transmissions to or from the servers running the Service.</li>
              <li><strong>Harmful Content:</strong> Uploading, posting, or transmitting viruses, malicious code, or content that incites violence or self-harm.</li>
            </ul>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">6. Limitation of Liability</h2>
            <p>
              In no event shall BlogVerse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; or (iii) unauthorized access, use or alteration of your transmissions or content.
            </p>
          </section>

          {/* 8. Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          {/* 9. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="bg-slate-50 p-8 rounded-xl border border-slate-200 mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">9. Contact Us</h2>
            <p className="mb-4">If you have any questions or require further clarification about these Terms of Service, please reach out to our support team:</p>
            <div className="flex items-center gap-3 text-lg">
              <strong>Email:</strong> 
              <a href="mailto:support@blogverse.com" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                support@blogverse.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
