
export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white text-slate-900 font-sans min-h-screen py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12 lg:p-16">
        
        {/* 1. Page Header */}
        <header className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-12 text-slate-700 leading-relaxed text-lg">
          
          {/* 2. Introduction Section */}
          <section>
            <p>
              Welcome to BlogVerse. We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy outlines our practices concerning the collection, use, retention, and disclosure of your information when you access our platform, use our services, or interact with our community. 
            </p>
            <p className="mt-4">
              By accessing or using our services, you expressly consent to the processing of your personal information in accordance with this Privacy Policy. If you do not agree with the terms outlined herein, please discontinue use of our platform immediately.
            </p>
          </section>

          {/* 3. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">1. Information We Collect</h2>
            <p className="mb-4">We collect information to provide better services to all our users. The types of data we collect depend on how you interact with our platform:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Account Information:</strong> When you register for an account, subscribe to our newsletter, or publish content, we collect personal identifiers such as your full name, email address, profile picture, and biographical information you choose to provide.
              </li>
              <li>
                <strong>Automatically Collected Usage Data:</strong> We automatically log diagnostic and usage data when you access the platform. This may include your IP address, browser type and version, device identifiers, referring/exit pages, and date/time stamps.
              </li>
              <li>
                <strong>User-Generated Content:</strong> Any articles, comments, forum posts, or other materials you publicly publish on the platform remain associated with your account profile.
              </li>
              <li>
                <strong>Communication Records:</strong> If you contact us directly for support or inquiries, we retain records of those communications to assist you effectively.
              </li>
            </ul>
          </section>

          {/* 4. How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">2. How We Use Your Information</h2>
            <p className="mb-4">We utilize the information we collect for the following operational and commercial purposes:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Service Delivery:</strong> To operate, maintain, and provision the core features of the BlogVerse platform, including content publishing and user authentication.</li>
              <li><strong>Experience Personalization:</strong> To tailor content recommendations and interface layouts based on your reading history and stated preferences.</li>
              <li><strong>Analytics and Improvement:</strong> To conduct aggregate analysis on user behavior to diagnose technical issues, optimize site performance, and develop new features.</li>
              <li><strong>Communication:</strong> To send administrative emails (e.g., password resets, security alerts) and, subject to your consent, promotional materials or newsletters regarding new content.</li>
              <li><strong>Security and Compliance:</strong> To detect and prevent fraudulent activities, enforce our Terms of Service, and comply with legal obligations.</li>
            </ul>
          </section>

          {/* 5. Cookies Policy */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">3. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We employ cookies, web beacons, and similar tracking technologies to track activity on our platform and store certain information locally on your device. Cookies are small data files that a website transfers to your device's hard drive for record-keeping purposes.
            </p>
            <p>
              We use <strong>Session Cookies</strong> to operate our service (such as maintaining your login state) and <strong>Preference Cookies</strong> to remember your settings. You have the right to accept or decline cookies. Most web browsers automatically accept them, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the platform.
            </p>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">4. Data Security and Integrity</h2>
            <p>
              We implement robust, industry-standard technical and organizational security measures designed to protect your Personal Data against unauthorized access, destruction, loss, alteration, or misuse. This includes encryption of data in transit (via SSL/TLS) and hashing of sensitive credentials. However, no method of transmission over the Internet or method of electronic storage is absolutely secure. Therefore, while we strive to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* 7. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">5. Third-Party Integrations and Disclosures</h2>
            <p className="mb-4">
              We do not sell your personal data to third parties. We may, however, share your information with trusted third-party service providers under strict confidentiality agreements to facilitate our operations:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Infrastructure and Hosting:</strong> To securely host our application databases and media files.</li>
              <li><strong>Analytics Providers:</strong> Services like Google Analytics to track user engagement and platform metrics.</li>
              <li><strong>Email Delivery:</strong> Transactional email services to reliably deliver account notifications and newsletters.</li>
            </ul>
            <p className="mt-4">
              We may also disclose your data if legally required to do so in response to lawful requests by public authorities, including to meet national security or law enforcement requirements.
            </p>
          </section>

          {/* 8. User Rights */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2">6. Your Data Protection Rights</h2>
            <p className="mb-4">
              Depending on your location (such as under the GDPR or CCPA), you possess specific rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
              <li><strong>The Right to Erasure ("Right to be Forgotten"):</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>The Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact our privacy compliance team. We will respond to your request within 30 days.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section className="bg-slate-50 p-8 rounded-xl border border-slate-200 mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">7. Contact Us</h2>
            <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or our data processing practices, please contact our designated Privacy Officer:</p>
            <div className="flex items-center gap-3 text-lg">
              <strong>Email:</strong> 
              <a href="mailto:privacy@blogverse.com" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                privacy@blogverse.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
