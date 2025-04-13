import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ScrollAwareDialogContent: React.FC<{ 
  children: React.ReactNode; 
  onAgree: () => void;
  setOpen: (open: boolean) => void;
}> = ({ children, onAgree, setOpen }) => {
  const [canClose, setCanClose] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const isAtBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 2;
    
    console.log({
      scrollHeight: target.scrollHeight,
      clientHeight: target.clientHeight,
      scrollTop: target.scrollTop,
      difference: target.scrollHeight - target.clientHeight - target.scrollTop,
      isAtBottom
    });

    if (isAtBottom) {
      setCanClose(true);
      setErrorMessage(null);
    }
  };

  const handleAgree = () => {
    onAgree();
    setOpen(false); // Close the dialog
  };

  useEffect(() => {
    setCanClose(false); // Reset when the dialog is opened
    setErrorMessage(null); // Clear error message when the dialog is reopened
  }, []);

  return (
    <DialogContent
      className="sm:max-w-[600px] max-h-[80vh]"
      onCloseAutoFocus={(event) => {
        if (!canClose) {
          event.preventDefault();
          setErrorMessage("Please scroll to the bottom before closing the dialog.");
        }
      }}
      onEscapeKeyDown={(event) => {
        if (!canClose) {
          event.preventDefault();
          setErrorMessage("Please scroll to the bottom before closing the dialog.");
        }
      }}
      onInteractOutside={(event) => {
        if (!canClose) {
          event.preventDefault();
          setErrorMessage("Please scroll to the bottom before closing the dialog.");
        }
      }}
    >
      <DialogHeader>
        {/* ...existing header content... */}
      </DialogHeader>
      <div 
        ref={viewportRef}
        className="h-[60vh] overflow-y-auto pr-4"
        onScroll={handleScroll}
      >
        {children}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleAgree}
          disabled={!canClose}
        >
          Agree
        </Button>
      </div>
    </DialogContent>
  );
};

export const TermsDialog: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <ScrollAwareDialogContent 
        onAgree={() => document.body.click()} 
        setOpen={setOpen}
      >
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>Welcome to Vyra Health. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
          <p>By accessing or using the Vyra Health platform and services, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you may not access or use our services.</p>
          
          <h3 className="text-lg font-semibold">2. Medical Disclaimer</h3>
          <p>The content provided on Vyra Health is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
          
          <h3 className="text-lg font-semibold">3. User Accounts</h3>
          <p>To access certain features of our platform, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          
          <h3 className="text-lg font-semibold">4. User Responsibilities</h3>
          <p>You agree to provide accurate and complete information when creating an account and to update your information to keep it accurate and current. You are solely responsible for all content you upload, post, email, transmit, or otherwise make available via the Vyra Health platform.</p>
          
          <h3 className="text-lg font-semibold">5. Privacy Policy</h3>
          <p>Your use of Vyra Health is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.</p>
          
          <h3 className="text-lg font-semibold">6. Intellectual Property</h3>
          <p>All content, features, and functionality on the Vyra Health platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, are the exclusive property of Vyra Health or its licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          
          <h3 className="text-lg font-semibold">7. Limitation of Liability</h3>
          <p>In no event shall Vyra Health, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any (i) errors, mistakes, or inaccuracies of content; (ii) personal injury or property damage of any nature whatsoever resulting from your access to and use of our platform; (iii) any unauthorized access to or use of our secure servers and/or any personal information and/or financial information stored therein.</p>
          
          <h3 className="text-lg font-semibold">8. Governing Law</h3>
          <p>These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law principles.</p>
          
          <h3 className="text-lg font-semibold">9. Changes to Terms</h3>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect.</p>
          
          <h3 className="text-lg font-semibold">10. Contact Information</h3>
          <p>If you have any questions about these Terms, please contact us at support@vyrahealth.com.</p>
        </div>
      </ScrollAwareDialogContent>
    </Dialog>
  );
};

export const PrivacyDialog: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <ScrollAwareDialogContent 
        onAgree={() => document.body.click()} 
        setOpen={setOpen}
      >
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>At Vyra Health, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
          
          <h3 className="text-lg font-semibold">1. Information We Collect</h3>
          <p>We collect personal information that you voluntarily provide to us when using our services, including but not limited to your name, email address, phone number, health information, and any other information you choose to provide.</p>
          
          <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
          <p>We may use the information we collect for various purposes, including to:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Process appointments and transactions</li>
            <li>Communicate with you about our services, updates, and other relevant information</li>
            <li>Personalize your experience on our platform</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Protect against, identify, and prevent fraud and other illegal activities</li>
          </ul>
          
          <h3 className="text-lg font-semibold">3. Information Sharing and Disclosure</h3>
          <p>We may share your information with:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Healthcare providers to facilitate your medical care</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Legal and regulatory authorities, as required by law</li>
            <li>Business partners with your consent</li>
          </ul>
          
          <h3 className="text-lg font-semibold">4. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          
          <h3 className="text-lg font-semibold">5. Data Retention</h3>
          <p>We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to comply with legal, regulatory, accounting, or reporting requirements.</p>
          
          <h3 className="text-lg font-semibold">6. Your Rights</h3>
          <p>Depending on your location, you may have certain rights regarding your personal information, including the right to:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Access the personal information we have about you</li>
            <li>Correct inaccurate personal information</li>
            <li>Delete your personal information</li>
            <li>Object to or restrict certain processing of your personal information</li>
            <li>Data portability</li>
          </ul>
          
          <h3 className="text-lg font-semibold">7. Cookies and Tracking Technologies</h3>
          <p>We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          
          <h3 className="text-lg font-semibold">8. Children's Privacy</h3>
          <p>Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.</p>
          
          <h3 className="text-lg font-semibold">9. Changes to This Privacy Policy</h3>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.</p>
          
          <h3 className="text-lg font-semibold">10. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@vyrahealth.com.</p>
        </div>
      </ScrollAwareDialogContent>
    </Dialog>
  );
};

export const HIPAAComplianceDialog: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <ScrollAwareDialogContent 
        onAgree={() => document.body.click()} 
        setOpen={setOpen}
      >
        <DialogHeader>
          <DialogTitle>HIPAA Compliance</DialogTitle>
          <DialogDescription>
            Effective Date: April 12, 2025 | Last Revised: April 12, 2025
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <h3 className="text-lg font-semibold">Introduction</h3>
          <p>
            This Telehealth Platform, operated by VyraHealth, facilitates virtual consultations with licensed Canadian healthcare providers for non-critical conditions (e.g., prescriptions, weight loss, erectile dysfunction). By using this Platform, you consent to the collection, use, and disclosure of your Personal Health Information (PHI) in compliance with:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>PIPEDA (Personal Information Protection and Electronic Documents Act);</li>
            <li>PHIPA (Personal Health Information Protection Act, Ontario) or applicable provincial health privacy laws;</li>
            <li>Other federal/provincial regulations.</li>
          </ul>

          <h3 className="text-lg font-semibold">2. Scope of Services</h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Conditions Treated: Non-critical, telehealth-appropriate conditions diagnosed through virtual consultations.</li>
            <li>AI Tools:
              <ul className="list-disc list-inside pl-4">
                <li>VAPI AI Agent: Conducts pre-screening questions to assess eligibility for care.</li>
                <li>Mistral AI OCR: Analyzes and summarizes medical records/documents you upload.</li>
              </ul>
            </li>
            <li>Data Collection: You may upload PHI, including medical history, provincial health card numbers, prescriptions, lab results, and other records.</li>
          </ul>

          <h3 className="text-lg font-semibold">3. Personal Health Information (PHI)</h3>
          <p>PHI includes any information that identifies you and relates to your physical/mental health, care, or payments (e.g., name, diagnoses, health card number, medical records).</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>AI Processing:
              <ul className="list-disc list-inside pl-4">
                <li>PHI processed by VAPI AI and Mistral AI OCR is used only for providing care, billing, or platform operations.</li>
                <li>AI tools are bound by Data Processing Agreements requiring compliance with Canadian privacy laws.</li>
              </ul>
            </li>
            <li>De-Identified Data: Summaries stripped of identifiers (per PIPEDA/PHIPA guidelines) may be used for internal analytics.</li>
          </ul>

          <h3 className="text-lg font-semibold">4. Consent & Permitted Uses</h3>
          <p>By using this Platform, you explicitly consent to:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Collection, use, and disclosure of your PHI for virtual care, AI processing, and billing.</li>
            <li>Storage of PHI on secure Canadian servers (or jurisdictions with comparable privacy laws).</li>
          </ul>
          <p>Permitted Disclosures:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Treatment: Virtual consultations, prescriptions, and referrals.</li>
            <li>Payment: Billing provincial health plans or insurers (e.g., OHIP, if applicable).</li>
            <li>Legal Obligations: Responding to court orders or public health mandates (e.g., disease reporting).</li>
          </ul>
          <p>Withdrawal of Consent: You may withdraw consent at any time by contacting [Privacy Officer Email], but this may limit access to services.</p>

          <h3 className="text-lg font-semibold">5. Your Rights Under Canadian Law</h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Access/Correction: Request a copy of your PHI or correct inaccuracies.</li>
            <li>Restrictions: Limit how your PHI is used/shared (e.g., opt out of AI pre-screening*). *Note: Opting out may affect service eligibility.</li>
            <li>Complaints: File complaints with:
              <ul className="list-disc list-inside pl-4">
                <li>Our Privacy Officer ([Contact Info]);</li>
                <li>The Office of the Privacy Commissioner of Canada or your provincial Privacy Commissioner (e.g., IPC Ontario).</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-semibold">6. Security Safeguards</h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>AI Systems:
              <ul className="list-disc list-inside pl-4">
                <li>VAPI AI and Mistral AI OCR use encryption, access controls, and audit logs compliant with Canadian standards.</li>
                <li>PHI is retained only as long as necessary for your care or legal requirements (e.g., provincial retention laws).</li>
              </ul>
            </li>
            <li>Platform Protections:
              <ul className="list-disc list-inside pl-4">
                <li>End-to-end encryption for data in transit/storage.</li>
                <li>Multi-factor authentication for accounts.</li>
                <li>Regular risk assessments and staff training on PHIPA/PIPEDA.</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-semibold">7. Third-Party Vendors</h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Data Processors: Third-party vendors (e.g., AI providers, cloud hosts) sign agreements requiring:
              <ul className="list-disc list-inside pl-4">
                <li>PHI protection per Canadian law;</li>
                <li>Breach notification within 72 hours of discovery.</li>
              </ul>
            </li>
            <li>Cross-Border Data: If PHI is transferred outside Canada (e.g., U.S.-based AI tools), we ensure equivalent safeguards via contracts or legal mechanisms.</li>
          </ul>

          <h3 className="text-lg font-semibold">8. Breach Notification</h3>
          <p>In the event of a PHI breach posing significant harm, we will:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Notify you and the Privacy Commissioner of Canada (or provincial authority) promptly.</li>
            <li>Mitigate risks and provide credit monitoring if applicable.</li>
          </ul>

          <h3 className="text-lg font-semibold">9. Data Retention & Deletion</h3>
          <p>PHI is retained for 10 years (or longer if required by provincial law, e.g., Ontario’s 10-year retention under PHIPA). Request deletion of non-essential PHI via [Platform Portal].</p>

          <h3 className="text-lg font-semibold">10. Limitations</h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Not for Emergencies: This Platform does not treat critical/life-threatening conditions.</li>
            <li>Provincial Variations: Services may differ based on provincial health regulations.</li>
          </ul>

          <h3 className="text-lg font-semibold">11. Amendments</h3>
          <p>Updates to these terms will be posted on the Platform. Continued use implies acceptance.</p>

          <h3 className="text-lg font-semibold">12. Contact Information</h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Privacy Officer: vyrahealth@gmail.com</li>
            <li>Technical Support: vyrahealth@gmail.com</li>
            <li>Privacy Commissioner of Canada: 30 Victoria Street, Gatineau, QC K1A 1H3 | 1-800-282-1376</li>
          </ul>
        </div>
      </ScrollAwareDialogContent>
    </Dialog>
  );
};
