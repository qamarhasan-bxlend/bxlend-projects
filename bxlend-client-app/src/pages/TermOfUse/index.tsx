import React from 'react';
import { Link } from 'react-router-dom';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';

import './index.css';

const TermOfUse = () => {
  return (
    <Glass maxWidth="80vw" margin="0 auto" padding="0 2.5rem">
      <div className="container d-flex flex-column align-items-center mt-5 pb-5">
        <Container fontSize="1.75rem" textAlign="center" paddingBottom="1.25rem">
          ZenithChain Terms of Use
        </Container>
        <Container>
          <div className="content-subtitle">
            Please read these terms of use carefully. By accessing or using the site you agree to be
            bound by the terms described herein and all terms incorporated by reference. If you do
            not agree to these terms, do not use this website.
          </div>
          <div className="content-subcontent">
            These Terms of Use (&apos;Terms&apos;) apply to your access to, and use of, the websites
            of ZenithChain and its subsidiaries and affiliated companies (&apos;ZenithChain&apos;,
            &apos;we&apos;, or &apos;us&apos;), including&nbsp;
            <Link to="/">https://bxlend.com/</Link> (collectively, the &quot;Site&quot;).
          </div>
          <div className="content-subcontent">
            ZenithChain reserves the right to change or modify the terms and conditions contained in
            these Terms or any policy or guideline of the Site, at any time and in its sole
            discretion. We will provide notice of these changes by posting the revised Terms to the
            Site and changing the &quot;Last Revised&quot; date at the top of the Terms, or by
            providing other means of notice as ZenithChain will determine each time in its sole
            discretion. Using a particular form of notice in some instances does not obligate us to
            use the same form in other instances. Any changes or modifications will be effective
            immediately upon posting the revisions to the Site, and will apply to your subsequent
            use of the Site. You waive any right you may have to receive specific notice of such
            changes or modifications. Your continued use of this Site will confirm your acceptance
            of such changes or modifications; therefore, you should review the Terms and applicable
            policies whenever you use the Site to understand the terms that apply to such use. The
            most current version of the Terms can be reviewed by clicking on the &quot;Terms of
            Use&quot; hypertext link located at the bottom of our web pages. If you do not agree to
            the Terms in effect when you access or use the Site, you must stop using the Site.
          </div>
          <div className="fw-bold content-subtitle">Preface</div>
          <div className="content-subcontent">
            ZenithChain is an online tool, which enables to store, use, exchange and manage
            different cryptocurrencies such as Bitcoin, Litecoin, Ethereum and others using our
            wallet service. Our Services may evolve over time. This means we may make changes,
            replace, or discontinue (temporarily or permanently) our Services at any time for any
            reason with or without notice. In this case, you may be prevented from accessing or
            using our Services. If, in our sole discretion, we decide to permanently discontinue our
            Services, we will provide you with notice via our website.
          </div>
          <div className="fw-bold content-subtitle">Eligibility</div>
          <div className="content-subcontent">
            By accessing or using the Site, you represent and warrant that you have not previously
            been suspended or removed from the Site. You must be an individual of at least 13 years
            of age. You can use our Services only if you can lawfully enter into an agreement to
            these Terms under applicable law. If you use our Services, you agree to do so in
            compliance with these Terms and with applicable laws and regulations. You further
            represent and warrant that you will not use the Site if the laws of your country
            prohibit you from doing so in accordance with these Terms.
          </div>
          <div className="fw-bold content-subtitle">Registration and Account</div>
          <div className="content-subcontent">
            In order to access and use certain features on the Site, you must create an account with
            ZenithChain (&quot;Account&quot;). You agree to: (a) provide accurate, current and
            complete information when creating or updating an Account; (b) maintain and promptly
            update your Account information; (c) maintain the security and confidentiality of your
            login credentials and restrict access to your Account and your computer; (d) promptly
            notify ZenithChain if you discover or otherwise suspect any security breaches related to
            the Site; (e) activate Two-Step-Verification via a mobile application or SMS text
            messages; and (d) take responsibility for all activities that occur under your Account
            and accept all risks of unauthorized access without active Two-Step-Verification.
            <span className="fw-bold">
              &nbsp;ZenithChain will not be in any case responsible for an unauthorized access to
              accounts with inactive Two-Step Verification.
            </span>
          </div>
          <div className="fw-bold content-subtitle">Account Suspension & Closure</div>
          <div className="content-subcontent">
            We may, without liability to you or any third party, refuse to let you open an account,
            suspend your account, or terminate your account or your use of one or more of the
            Services. Such actions may be taken as a result of account inactivity, failure to
            positively identify yourself, if we believe your account has been compromised, in order
            for us to comply with laws or regulations, or your violation of the terms of this
            Agreement. If you have cryptocurrency remaining in an account, which has been suspended
            or closed, you will be able to access such cryptocurrency and withdraw them to an
            external cryptocurrency address (unless prohibited by law or a court order). If you are
            unable to login to your account because it has been suspended, you must contact us
            at&nbsp;
            <a href="mailto:support@bxlend.com">support@bxlend.com</a> to process such withdrawal.
            If you have linked a bank account, debit card, or credit card to your account, we
            reserve the right to require you to provide further identifying information before
            processing such withdrawal or transfer.
          </div>
          <div className="content-subcontent">
            You may terminate this Agreement at any time by closing your account and discontinuing
            use of the Services. Upon termination of this Agreement and your account, you remain
            liable for all transactions made while the account was open.
          </div>
          <div className="fw-bold content-subtitle">Dormant Accounts</div>
          <div className="content-subcontent">
            A Dormant Account is defined as a user account with no login or other activity for more
            than 180 days. ZenithChain may, but shall not be obligated to, move funds out of the
            account and into a secure Cold Storage account for safe keeping. When a user resumes
            activity on a dormant account, the Cold Storage funds can be retrieved by contacting
            support for a security review and reinstatement.
          </div>
          <div className="fw-bold content-subtitle">Transaction Limits and Refunds</div>
          <div className="content-subcontent">
            ZenithChain reserves the right to change the deposit, withdrawal, conversion, storage,
            and velocity limits on your account as well as the availability of the Services as we
            deem reasonably necessary. Once a cryptocurrency transaction has been initiated, it
            cannot be reversed or refunded.
          </div>
          <div className="fw-bold content-subtitle">Privacy Policy</div>
          <div className="content-subcontent">
            Please refer to our <Link to="/privacy-policy">Privacy Policy</Link> for information
            about how we collect, use, and share your personal information.
          </div>
          <div className="fw-bold content-subtitle">
            Confidentiality of Transmissions Over the Internet
          </div>
          <div className="fw-bold content-subcontent">
            The transmission of data or information (including communications by e-mail) over the
            Internet or other publicly accessible networks is not one hundred percent secure, and is
            subject to possible loss, interception, or alteration while in transit. Accordingly,
            ZenithChain does not assume any liability for any damage you may experience or costs you
            may incur as a result of any transmissions over the Internet or other publicly
            accessible networks, including without limitation transmissions involving the exchange
            of e-mail with ZenithChain containing your personal information. While ZenithChain shall
            take commercially reasonable efforts to safeguard the privacy of the information you
            provide to ZenithChain and shall treat such information in accordance with
            ZenithChain&apos;s Privacy Policy, in no event will the information you provide to
            ZenithChain be deemed to be confidential, create any fiduciary obligations to you on
            ZenithChain&apos;s part, or result in any liability to you on ZenithChain&apos;s part in
            the event that such information is inadvertently released by ZenithChain or accessed by
            third parties without ZenithChain&apos;s consent.
          </div>
          <div className="fw-bold content-subtitle">Cryptocurrency Transactions</div>
          <div className="content-subcontent">
            ZenithChain cannot and does not guarantee the value of cryptocurrency. You acknowledge
            and agree that the value of cryptocurrency is highly volatile and that buying, selling,
            and holding cryptocurrency involves a high risk. Additionally, the cryptocurrency
            consensus network is solely responsible for verifying and confirming proposed
            transactions that you submit via the Services, and ZenithChain cannot and does not
            confirm, cancel, or reverse cryptocurrency-to-cryptocurrency transactions, other than
            confirmation of the cryptocurrency network’s completion of a transaction.
          </div>
          <div className="content-subcontent">
            The cryptocurrency network is operated by a decentralized network of independent third
            parties. Once a transaction request has been submitted to the cryptocurrency network via
            the Services, the cryptocurrency network will automatically complete or reject the
            request and you will not be able to cancel or otherwise modify your transaction request.
            You acknowledge and agree that ZenithChain is not responsible for any errors or
            omissions that you make in connection with any cryptocurrency transaction initiated via
            the Services. The Services help you submit your cryptocurrency transaction request for
            confirmation to the cryptocurrency network. However, ZenithChain has no control over the
            cryptocurrency network and therefore cannot and does not ensure that any transaction
            request you submit via the Services will be completed. You acknowledge and agree that
            the transaction requests you submit via the Services may not be completed, or may be
            substantially delayed, by the cryptocurrency network. When you complete a transaction
            request via the Services, you authorize us to submit your transaction request to the
            cryptocurrency network in accordance with the instructions you provide via the Services.
          </div>
          <div className="fw-bold content-subtitle">Third Party Applications</div>
          <div className="content-subcontent">
            If you grant express permission to a third party to connect to your account, either
            through the third party&apos;s product or through ZenithChain, you acknowledge that
            granting permission to a third party to take specific actions on your behalf does not
            relieve you of any of your responsibilities under this Agreement. Further, you
            acknowledge and agree that you will not hold ZenithChain responsible for, and will
            indemnify ZenithChain from, any liability arising from the actions or inactions of this
            third party in connection with the permissions you grant.
          </div>
          <div className="fw-bold content-subtitle">Application Programming Interface</div>
          <div className="content-subcontent">
            Any person or entity who uses ZenithChain&apos;s Application Programming Interface
            (&quot;ZenithChain API&quot;) must comply with the terms of this User Agreement and/or
            any other conditions as ZenithChain may put into place in its sole discretion from time
            to time. The ZenithChain API is owned by ZenithChain and is licensed to ZenithChain API
            users on a non-exclusive, non-sublicensable basis.
          </div>
          <div className="fw-bold content-subtitle">Changes to this Agreement</div>
          <div className="content-subcontent">
            You can review the most current version of the Terms of Service at any time at this
            page. We reserve the right, at our sole discretion, to update, change or replace any
            part of these Terms of Service by posting updates and changes to our website. It is your
            responsibility to check our website periodically for changes. Your continued use of or
            access to our website or the Service following the posting of any changes to these Terms
            of Service constitutes acceptance of those changes.
          </div>
          <div className="fw-bold content-subtitle">Force Majeure</div>
          <div className="content-subcontent">
            We shall not be liable for delays, failure in performance or interruption of service
            which result directly or indirectly from any cause or condition beyond our reasonable
            control, including but not limited to, any delay or failure due to any act of God, act
            of civil or military authorities, act of terrorists, civil disturbance, war, strike or
            other labor dispute, fire, interruption in telecommunications or Internet services or
            network provider services, failure of equipment and/or software, other catastrophe or
            any other occurrence which is beyond our reasonable control and shall not affect the
            validity and enforceability of any remaining provisions.
          </div>
          <div className="fw-bold content-subtitle">Change of Control</div>
          <div className="content-subcontent">
            In the event that ZenithChain is acquired by or merged with a third party entity, we
            reserve the right, in any of these circumstances, to transfer or assign the information
            we have collected from you as part of such merger, acquisition, sale, or other change of
            control.
          </div>
          <div className="fw-bold content-subtitle">Export Controls</div>
          <div className="content-subcontent">
            The ZenithChain Services may be subject to export control regulations under applicable
            law. By using the ZenithChain Services you represent that you are not an individual or
            entity that is, or an entity owned or controlled by persons or entities that are, (i)
            the subject of any sanctions administered or enforced by the U.S. Department of the
            Treasury’s Office of Foreign Assets Control, the U.S. Department of State, the United
            Nations Security Council, the European Union, Her Majesty’s Treasury, the Hong Kong
            government, or any other governmental authority with jurisdiction over ZenithChain or
            the ZenithChain Services; (ii) identified on the Denied Persons, Entity, or Unverified
            Lists of the U.S. Department of Commerce’s Bureau of Industry and Security; or (iii)
            located, organized or resident in a country or territory that is, or whose government
            is, the subject of U.S. economic sanctions, including, without limitation, Cuba, Iran,
            North Korea, Sudan, or Syria. You further represent that you will not use the
            ZenithChain Services to conduct any transaction with or on behalf of any person or
            entity listed in clauses (i) through (iii) above or otherwise in violation of law.
            ZenithChain may cease to provide the ZenithChain Services to you for any reason, and
            with no notice, if it determines that you have violated any of the above
            representations. You understand and consent that ZenithChain may be legally required to
            detain, to deny your access to, and to report to one or more governmental authorities,
            such of your property or property interests as are in ZenithChain&apos;s possession or
            control in the event of certain sanctions imposing these obligations. These
            representations, covenants, and obligations are continuing and you agree to notify
            ZenithChain immediately in writing if your status under any of the above covenants
            changes.
          </div>
          <div className="fw-bold content-subtitle">Arbitration</div>
          <div className="content-subcontent text-uppercase">
            PLEASE READ THE FOLLOWING PARAGRAPH CAREFULLY BECAUSE IT REQUIRES YOU TO ARBITRATE
            DISPUTES WITH ZenithChain INTERNATIONAL AND IT LIMITS THE MANNER IN WHICH YOU CAN SEEK
            RELIEF.
          </div>
          <div className="content-subcontent">
            Any controversy or claim arising out of or relating to these Terms, or the breach of
            these Terms, shall be settled by binding arbitration in accordance with the rules of{' '}
            <span className="color-yellow fw-bold">XXX</span>. The costs of arbitration shall be
            initially borne by the party initiating arbitration and later apportioned by the
            arbitrator. The arbitrator&apos;s decision will be binding and may not be appealed. A
            judgment of a court having jurisdiction may be entered upon the arbitrator&apos;s award.
          </div>
          <div className="fw-bold content-subtitle">Modifications to the Site</div>
          <div className="content-subcontent">
            ZenithChain reserves the right to modify or discontinue, temporarily or permanently, the
            Site or any features or portions thereof without prior notice. You agree that
            ZenithChain will not be liable for any modification, suspension or discontinuance of the
            Site or any part thereof.
          </div>
          <div className="fw-bold content-subtitle">Indemnification</div>
          <div className="content-subcontent">
            You agree to defend, indemnify and hold harmless ZenithChain, its independent
            contractors, service providers and consultants, and their respective directors,
            employees and agents, from and against any claims, damages, costs, liabilities and
            expenses (including, but not limited to, reasonable attorneys’ fees) arising out of or
            related to: (a) your use of the Site; (b) any User Content or Feedback you provide; (c)
            your violation of these Terms; (d) your violation of any rights of another; or (e) your
            conduct in connection with the Site. Some jurisdictions limit consumer indemnities, so
            some or all of the indemnity provisions above may not apply to you. If you are obligated
            to indemnify us, we will have the right, in our sole and unfettered discretion, to
            control any action or proceeding and determine whether we wish to settle it, and if so,
            on what terms.
          </div>
          <div className="fw-bold content-subtitle">Disclaimer of Warranties</div>
          <div className="content-subcontent text-uppercase">
            BXLEND PROVIDES NO GUARANTEE AS TO THE PERFORMANCE OR THE UNINTERRUPTED AVAILABILITY OF
            THE SITE OR THE BXLEND MATERIALS. THE SITE AND BXLEND MATERIALS ARE PROVIDED ON AN
            &quot;AS IS,&quot; &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED. BXLEND DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING,
            WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, TITLE AND NON-INFRINGEMENT AS TO THE SITE AND THE INFORMATION, CONTENT AND
            MATERIALS CONTAINED THEREIN. BXLEND DOES NOT REPRESENT OR WARRANT THAT BXLEND MATERIALS
            OR THE SITE ARE ACCURATE, COMPLETE, RELIABLE, CURRENT OR ERROR-FREE. WHILE BXLEND
            ATTEMPTS TO MAKE YOUR ACCESS AND USE OF THE SITE SAFE, BXLEND CANNOT AND DOES NOT
            REPRESENT OR WARRANT THAT THE SITE OR ITS SERVER(S) ARE FREE OF VIRUSES OR OTHER HARMFUL
            COMPONENTS; THEREFORE, YOU SHOULD USE INDUSTRY-RECOGNIZED SOFTWARE TO DETECT AND
            DISINFECT VIRUSES FROM ANY DOWNLOAD.
          </div>
          <div className="content-subcontent">
            BXLEND reserves the right to change any and all content contained in the Site at any
            time without notice. Reference to any products, services, processes or other
            information, by trade name, trademark, manufacturer, supplier or otherwise does not
            constitute or imply endorsement, sponsorship or recommendation thereof, or any
            affiliation therewith, by BXLEND.
          </div>
          <div className="content-subcontent text-uppercase">
            SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OF IMPLIED TERMS IN CONTRACTS WITH
            CONSUMERS, SO SOME OR ALL OF THE DISCLAIMERS IN THIS SECTION MAY NOT APPLY TO YOU.
          </div>
          <div className="fw-bold content-subtitle">Limitation of Liability</div>
          <div className="content-subcontent text-uppercase">
            IN NO EVENT WILL BXLEND, ITS DIRECTORS, EMPLOYEES OR AGENTS BE LIABLE FOR ANY DIRECT,
            SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY OTHER DAMAGES OF ANY KIND, INCLUDING
            BUT NOT LIMITED TO LOSS OF USE, LOSS OF PROFITS OR LOSS OF DATA, WHETHER IN AN ACTION IN
            CONTRACT, TORT (INCLUDING BUT NOT LIMITED TO NEGLIGENCE) OR OTHERWISE, ARISING OUT OF OR
            IN ANY WAY CONNECTED WITH THE USE OF OR INABILITY TO USE THE SITE, THE BXLEND MATERIALS
            OR THE CONTENT OR THE MATERIALS CONTAINED IN OR ACCESSED THROUGH THE SITE, INCLUDING
            WITHOUT LIMITATION ANY DAMAGES CAUSED BY OR RESULTING FROM RELIANCE BY USER ON ANY
            INFORMATION OBTAINED FROM BXLEND, OR THAT RESULT FROM MISTAKES, OMISSIONS,
            INTERRUPTIONS, DELETION OF FILES OR EMAIL, ERRORS, DEFECTS, VIRUSES, DELAYS IN OPERATION
            OR TRANSMISSION OR ANY FAILURE OF PERFORMANCE, WHETHER OR NOT RESULTING FROM ACTS OF
            GOD, COMMUNICATIONS FAILURE, THEFT, DESTRUCTION OR UNAUTHORIZED ACCESS TO BXLEND&apos;S
            RECORDS, PROGRAMS OR SITE. IN NO EVENT WILL THE AGGREGATE LIABILITY OF BXLEND, WHETHER
            IN CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE, WHETHER ACTIVE, PASSIVE OR IMPUTED),
            PRODUCT LIABILITY, STRICT LIABILITY OR OTHER THEORY, ARISING OUT OF OR RELATING TO THE
            USE OF OR INABILITY TO USE THE SITE EXCEED ANY COMPENSATION YOU PAY, IF ANY, TO BXLEND
            FOR ACCESS TO OR USE OF THE SITE. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF
            LIABILITY IN CONTRACTS WITH CONSUMERS, SO SOME OR ALL OF THESE LIMITATIONS OF LIABILITY
            MAY NOT APPLY TO YOU. DOWNLOAD.
          </div>
          <div className="fw-bold content-subtitle">Survival</div>
          <div className="content-subcontent">
            Upon termination of your account or this Agreement for any other reason, all rights and
            obligations of the parties that by their nature are continuing will survive such
            termination.
          </div>
          <div className="fw-bold content-subtitle">Website Accuracy</div>
          <div className="content-subcontent">
            Although we intend to provide accurate and timely information on the ZenithChain Site,
            the ZenithChain Site (including, without limitation, the Content) may not always be
            entirely accurate, complete or current and may also include technical inaccuracies or
            typographical errors. In an effort to continue to provide you with as complete and
            accurate information as possible, information may be changed or updated from time to
            time without notice, including without limitation information regarding our policies,
            products and services. Accordingly, you should verify all information before relying on
            it, and all decisions based on information contained on the ZenithChain Site are your
            sole responsibility and we shall have no liability for such decisions.
          </div>
          <div className="fw-bold content-subtitle">
            Limited License and Intellectual Property Rights
          </div>
          <div className="content-subcontent">
            We grant you a limited, non-exclusive, non-sublicensable, and non-transferable license,
            subject to the terms and conditions of this Agreement, to access and use the the
            Services solely for approved purposes as determined by ZenithChain. Any other use of the
            Services is expressly prohibited. ZenithChain and its licensors reserve all rights in
            the Services and you agree that this Agreement does not grant you any rights in or
            licenses to the Services except for the limited license set forth above. Except as
            expressly authorized by ZenithChain, you agree not to modify, reverse engineer, copy,
            frame, scrape, rent, lease, loan, sell, distribute, or create derivative works based on
            the Services, in whole or in part. If you violate any portion of this Agreement, your
            permission to access and use the Services may be terminated pursuant to this Agreement.
            &quot;
            <Link to="/">https://bxlend.com</Link>
            &quot;, &quot;ZenithChain&quot;, and all logos related to the Services are either
            trademarks, or registered marks of ZenithChain or its licensors. You may not copy,
            imitate, or use them without ZenithChain&apos;s prior written consent. All right, title,
            and interest in and to the ZenithChain website, any content thereon, the Services, and
            all technology and any content created or derived from any of the foregoing is the
            exclusive property of ZenithChain and its licensors.
          </div>
          <div className="fw-bold content-subtitle">Section Headings</div>
          <div className="content-subcontent">
            Section headings in this Agreement are for convenience only, and shall not govern the
            meaning or interpretation of any provision of this Agreement.
          </div>
          <div className="fw-bold content-subtitle">Governing Language and Translation</div>
          <div className="content-subcontent">
            You agree that these Terms of Use, ZenithChain&apos;s Privacy Policy and other notices
            posted through the Services have been drawn up in English. Although translations in
            other languages of any of the foregoing documents may be available, such translations
            may not be up to date or complete. Accordingly, you agree that in the event of any
            conflict between the English language version of the foregoing documents and any other
            translations thereto, the English language version of such documents shall govern.
          </div>
          <div className="fw-bold content-subtitle">Contacting us</div>
          <div className="content-subcontent color-yellow">Address</div>
          <a href="mailto:support@bxlend.com" className="content-subcontent text-decoration-none">
            support@bxlend.com
          </a>
          <em className="d-block content-subcontent font-italic">
            This document was last updated on October 1st, 2023
          </em>
        </Container>
      </div>
    </Glass>
  );
};

export default TermOfUse;
