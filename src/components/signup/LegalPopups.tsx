
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TermsDialog: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export const PrivacyDialog: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
