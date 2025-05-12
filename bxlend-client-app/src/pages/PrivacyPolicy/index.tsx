import React from 'react';
import { Link } from 'react-router-dom';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';

import './index.css';

const PrivacyPolicy = () => {
  return (
    <Glass maxWidth="80vw" margin="0 auto" padding="0 2.5rem">
      <div className="container d-flex flex-column align-items-center mt-5 pb-5">
        <Container fontSize="1.75rem" textAlign="center" paddingBottom="1.25rem">
          ZenithChain Privacy Policy
        </Container>
        <div className="terms-content">
          <div className="content-subtitle">
            This Privacy Policy governs the manner in which ZenithChain collects, uses, maintains
            and discloses information collected from users (each, a &quot;User&quot;) of the
            bxlend.com website (&quot;Site&quot;). This privacy policy applies to the Site and all
            products and services offered by ZenithChain.
          </div>
          <div className="fw-bold content-subtitle">Personal identification information</div>
          <div className="content-subcontent">
            We may collect personal identification information from Users in a variety of ways,
            including, but not limited to, when Users visit our site, register on the site, place an
            order, fill out a form, and in connection with other activities, services, features or
            resources we make available on our Site. Users may be asked for, as appropriate, name
            and an email address. Users may, however, visit our Site anonymously. We will collect
            personal identification information from Users only if they voluntarily submit such
            information to us. Users can always refuse to supply personally identification
            information, except that it may prevent them from engaging in certain Site related
            activities.
          </div>
          <div className="fw-bold content-subtitle">Non-personal identification information</div>
          <div className="content-subcontent">
            We may collect non-personal identification information about Users whenever they
            interact with our Site. Non-personal identification information may include the browser
            name, the type of computer and technical information about Users means of connection to
            our Site, such as the operating system and the Internet service providers utilized and
            other similar information.
          </div>
          <div className="fw-bold content-subtitle">Web browser cookies</div>
          <div className="content-subcontent">
            Our Site may use &quot;cookies&quot; to enhance User experience. User&apos;s web browser
            places cookies on their hard drive for record-keeping purposes and sometimes to track
            information about them. User may choose to set their web browser to refuse cookies, or
            to alert you when cookies are being sent. If they do so, note that some parts of the
            Site may not function properly.
          </div>
          <div className="fw-bold content-subtitle">How we use collected information</div>
          <div className="content-subcontent">
            ZenithChain may collect and use Users personal information for the following purposes:
          </div>
          <ul className="content-subcontent">
            <li className="ms-4 content-subcontent">
              To improve customer service: Information you provide helps us respond to your customer
              service requests and support needs more efficiently.
            </li>
            <li className="ms-4 content-subcontent">
              To personalize user experience: we may use information in the aggregate to understand
              how our Users as a group use the services and resources provided on our Site.
            </li>
            <li className="ms-4 content-subcontent">
              To improve our Site: we may use feedback you provide to improve our products and
              services.
            </li>
            <li className="ms-4 content-subcontent">
              To process payments: we may use the information Users provide about themselves when
              placing an order only to provide service to that order. We do not share this
              information with outside parties except to the extent necessary to provide the
              service.
            </li>
            <li className="ms-4 content-subcontent">
              To run a promotion, contest, survey or other Site feature
            </li>
            <li className="ms-4 content-subcontent">
              To send Users information they agreed to receive about topics we think will be of
              interest to them.
            </li>
            <li className="ms-4 content-subcontent">To send periodic emails</li>
            <li className="ms-4 content-subcontent">
              We may use the email address to send User information and updates pertaining to their
              order. It may also be used to respond to their inquiries, questions, and/or other
              requests. If User decides to opt-in to our mailing list, they will receive emails that
              may include company news, updates, related product or service information, etc. If at
              any time the User would like to unsubscribe from receiving future emails, they may do
              so by contacting us via our Site.
            </li>
          </ul>
          <div className="fw-bold content-subtitle">How we protect your information</div>
          <div className="content-subcontent">
            We adopt appropriate data collection, storage and processing practices and security
            measures to protect against unauthorized access, alteration, disclosure or destruction
            of your personal information, username, password, transaction information and data
            stored on our Site.
          </div>
          <div className="content-subcontent">
            Sensitive and private data exchange between the Site and its Users happens over a SSL
            secured communication channel and is encrypted and protected with digital signatures.
            Our Site is also in compliance with PCI vulnerability standards in order to create as
            secure of an environment as possible for Users.
          </div>
          <div className="fw-bold content-subtitle">Sharing your personal information</div>
          <div className="content-subcontent">
            We do not sell, trade, or rent Users personal identification information to others. We
            may share generic aggregated demographic information not linked to any personal
            identification information regarding visitors and users with our business partners,
            trusted affiliates and advertisers for the purposes outlined above.
          </div>
          <div className="fw-bold content-subtitle">Managing your personal information</div>
          <div className="content-subcontent">
            You may update, correct or delete your online account information at any time by logging
            into your account or by contacting us at the information below. Please note that we may
            retain certain information as required by law or for legitimate business purposes. We
            may also retain cached or archived copies of information about you for a certain period
            of time.
          </div>
          <div className="fw-bold content-subtitle">Third party websites</div>
          <div className="content-subcontent">
            Users may find advertising or other content on our Site that link to the sites and
            services of our partners, suppliers, advertisers, sponsors, licensors and other third
            parties. We do not control the content or links that appear on these sites and are not
            responsible for the practices employed by websites linked to or from our Site. In
            addition, these sites or services, including their content and links, may be constantly
            changing. These sites and services may have their own privacy policies and customer
            service policies. Browsing and interaction on any other website, including websites
            which have a link to our Site, is subject to that website&apos;s own terms and policies.
          </div>
          <div className="fw-bold content-subtitle">
            Compliance with children&apos;s online privacy protection act
          </div>
          <div className="content-subcontent">
            Protecting the privacy of the very young is especially important. For that reason, we
            never collect or maintain information at our Site from those we actually know are under
            13, and no part of our website is structured to attract anyone under 13. If we become
            aware that a child under the age of 13 has provided us with personal information, we
            will delete such information from our files immediately.
          </div>
          <div className="fw-bold content-subtitle">Changes to this privacy policy</div>
          <div className="content-subcontent">
            ZenithChain has the discretion to update this privacy policy at any time. When we do, we
            will revise the updated date at the bottom of this page. We encourage Users to
            frequently check this page for any changes to stay informed about how we are helping to
            protect the personal information we collect. You acknowledge and agree that it is your
            responsibility to review this privacy policy periodically and become aware of
            modifications.
          </div>
          <div className="fw-bold content-subtitle">Your acceptance of these terms</div>
          <div className="content-subcontent">
            By using this Site, you signify your acceptance of this policy and{' '}
            <Link to="#">user agreement</Link>. If you do not agree to this policy, please do not
            use our Site. Your continued use of the Site following the posting of changes to this
            policy will be deemed your acceptance of those changes.
          </div>
          <div className="fw-bold content-subtitle">Contacting us</div>
          <div className="content-subcontent">
            If you have any questions about this Privacy Policy, the practices of this site, or your
            dealings with this site, including requests for access to personal information and/or
            correction of personal information, please contact us at:
          </div>
          <div className="fw-bold content-subcontent color-yellow">Address</div>
          <a href="mailto:support@bxlend.com" className="content-subcontent text-decoration-none">
            support@bxlend.com
          </a>
          <em className="d-block content-subcontent font-italic">
            This document was last updated on October 1st, 2023
          </em>
        </div>
      </div>
    </Glass>
  );
};

export default PrivacyPolicy;
