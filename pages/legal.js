import Head from 'next/head';
import { getSession } from 'next-auth/react';
import ThemeProvider from '@/theme/ThemeProvider';
import Layout from '@/components/common/Layout';
import LargeInnerContent from '@/components/presentation/LargeInnerContent';
import styled from '@emotion/styled';
import PageTitle from '@/components/common/PageTitle';
import { Typography } from '@mui/material';
export default function privacyPolicy() {
  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <LargeInnerContent>
          <CMSSection>
            <PageTitle title="Legal" subtitle="Policy" images_icon={'../location.png'}></PageTitle>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              Legal
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              Effective Date: This Privacy Policy was last updated on December 1, 2022.
              <br /> <br />
              We at UniRide LLC, including our parents, subsidiaries, affiliates, representatives,
              managers and members (collectively, “UniRide,” “we,” “us,” or “our”), respect your
              privacy and are committed to protecting your personal information. Therefore, we work
              hard to safeguard your information and have created this Privacy Policy to help you
              understand what information we collect, why we collect it, and how you can update,
              manage, and delete your information. This Privacy Policy relates to your use of and
              access to our rideshare technology platform and all related content and services, such
              as our platform, applications, website, social media, and content, which includes, but
              is not limited to, downloading or logging into our application (the “Services,” as
              more fully described in our Terms and Conditions). For the sake of clarity, by
              visiting our sites and pages, talking with our representatives, using or accessing the
              rideshare technology platform, whether as Rider or Driver, registering for a user
              account, or otherwise as it relates to us, you engage in our “Service.”{' '}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.General.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The UniRide Terms and Conditions (the “Terms”) are incorporated herein by reference.
              Your use of the Services is subject to the Terms and this Privacy Policy and indicates
              your consent to them. In this Privacy Policy, the term “personal information” means
              information which you provide to us which personally identifies you, such as your
              name, number of rides and years using Services, ratings, profile photo, email address,
              billing information, certain driver information requested within the application,
              certain rider information requested with the application, credit card number, banking
              information, telephone number, and all other data which can be reasonably linked to
              such information by UniRide, such as vehicle information and license plate. In
              addition, UniRide will share certain, non-sensitive information with the Riders and
              Drivers you connect with in our rideshare platform community so that you may be
              properly connected with your Rider or Driver. You can choose to delete any personal
              information we may have collected about you by contacting us. Please note that Stripe
              is our primary payment processor, which is party that you agree we can share your
              information with so as to offer you the benefits of our Services; provided, however,
              that you also agree that at any time, without notice, we may change our payment
              processor, and that your continued use and/or access to our Services will constitute
              your consent to share your information with the other payment processors as well.{' '}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.2 Information Collected
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              When you use our Services, such as signing up for a UniRide user account or accessing
              the rideshare platform, we may collect and securely save your name, mailing address,
              billing address, telephone number, e-mail, billing information, such as your debit or
              credit number (including expiration date and security code), any information you enter
              in a chat box or live chat or send to us through our contact form, any information
              that we request from you to verify your identity, any information about your vehicles,
              and all other information necessary to provide you with our Services and contact you
              when necessary. Specifically, when you communicate with us through our website,
              whether through our contact form or through live chat, or through the UniRide mobile
              application, we will collect and securely store all information you choose to send us.
              When you communicate with us through Facebook or other social media platform, we will
              likewise collect and securely store all information that you send us so that we may
              best offer you our Services. In the event you call us or we call you, all calls will
              be recorded for quality assurance purposes, as well any time, type, and quantity of
              the orders you make and the banking information associated with that order, among
              other things set forth in this Privacy Policy. Also, when you save as favorites
              certain locations and destinations, we will also receive that information.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.3 Driver Information
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              In addition to basic information collected, which is in addition to any registration
              data as a Driver on our platform, we will also ask for your gender, date of birth,
              social security number, vehicle make, vehicle model, vin number, year of vehicle, tag
              and license plate number, driver license number, driver license expiration date, car
              insurance name, car insurance policy number, car registration, account username,
              password for account, and profile picture, among other items. This information will be
              shared with our third parties so that we may ensure a safe community amongst the
              participants in our rideshare technology platform. This information will thus be
              shared with companies that run driving record background checks and criminal
              background checks on our drivers, may be shared with law enforcement and the county in
              which you will be driving in, and may be shared with other third parties in our
              discretion. We also keep you bank, bank account, bank routing, tax information, and
              other payment information in order to ensure prompt payment to you.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.4 Location Information Collected.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              Location information is automatically collected in the form of GPS signals (combined
              with a time-stamp) and other information sent by your mobile device on which the
              Services are installed, activated, and used. However, collection of this location
              information only occurs when permission is given through the user settings on your
              device; in other words, you may control the collection of this GPS information by
              turning off location information and sharing by accessing the privacy, user, or other
              appropriate settings on the device you are using to access the Services. Please note
              that we may also collect the precise location of your device when the application is
              running in the foreground or background of your device. We will also use your location
              information for things like matching riders with drivers, determining drop off and
              pick up locations, measuring your distance travelled, and suggesting destinations
              based on previous trips. This means that in addition to knowing where you are going in
              terms of GPS location, we may also know the precise places that you visit. Of course,
              your safety is paramount to us, which is why we may share your location information
              with law enforcement or emergency medical services.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.5 Other Information Collected
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              As a technology company, UniRide will make available to you the rideshare technology
              platform in order to connect you with Riders or Drivers, and as a consequence, can
              also view your personal data. Once you install the application or use the Services,
              information will be immediately and automatically collected about the use of the
              Services. For example, information may be collected and recorded regarding how often
              you use the app and for how long, your device type, unique identifiers, operating
              system type and version, battery usage, the third party web pages or applications you
              visit or use or interact with via the Services, the recording of your clicks within
              the application and Services information that you viewed on our Services, the fact
              that you used the Services to communicate with other users and the fact that you used
              third parties application/services via our Services to communicate with third parties
              and the duration of such communications, the Internet Protocol (IP) address and the
              name of the domain used access the Services, the geographic location of the device
              that you are using to log in and use the Services.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.6 Why we collect.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              Your personal information and practices through the use of our Services are collected,
              analyzed, and shared to us and to third parties in order to best customize, tailor,
              learn from, analyze, manage, report and optimize the Services. In other words, we use
              your information to deliver our Services. For example, we collect your information for
              the purposes of communication with you and our Third Parties, support, scheduling,
              history, location, and general rideshare use, whether as a Rider or Driver. We also
              use your information to ensure our Services are working as intended, such as tracking
              outages or troubleshooting issues you report to us. And we use your information to
              improve the service or to develop new features or services, use data for analytics and
              measurement to understand how our services are used. For example, we analyze data
              about your usage of the Services to do things like optimize our website and
              application design. We also use your information to send you updates, notices,
              announcements, and additional information related to the Services. If you contact us,
              we may keep a record of your request in order to help solve any issues you might be
              facing. We also use the information we collect to send you push notifications and text
              messages. We collect all this information in order to personalize our Services to you,
              and of course to better connect our drivers and riders with each other. Please note
              that if you disable push notifications from within your mobile phone, or opt-out of
              receiving them, you may not be able to effectively use the Services, such as when you
              are notified that your ride has arrived.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.7 Address Book Information
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              If you permit UniRide to access the address book on your device through the permission
              system used by your mobile platform, we may access and store names and contact
              information from your address book to facilitate invitations and social interactions
              that you initiate through our Platform and for other purposes.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.8 Testimonials and Reviews{' '}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              UniRide will share any testimonials and reviews received with their respective drivers
              and riders, and the community as a whole. We do this because we want both riders and
              drivers to enjoy great rides and drives, and to give to each honest testimonials and
              reviews about their individual experience.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              1.9 Calls and Text Messages
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              You may need to contact your driver or rider in the event you leave something behind
              or locating the pickup location. For these purposes, you can contact riders and
              drivers through the rideshare technology platform. We do not share your phone number,
              but with your consent, we may share such information with the relevant riders or
              drivers. If you communicate with your driver or rider from within the application and
              rideshare technology platform, we will be able to view the content of any messages
              sent or received. In addition, for any calls from within our platform, we may record
              such calls for security purposes, and we will let you know before we do so.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              UniRide will be primarily involved in the processing of data that is related to or in
              connection with the Services. Therefore, in order to offer you the benefit of our
              Services, we may use various third parties and external companies to enable or provide
              the Services to us and for your use, process payments, provide customer support,
              provide location information to participating restaurants, provide marketing services,
              and provide website-related services (including, but not limited to, maintenance,
              database management, web analysis, and improving website functions) or to support us
              in analyzing the use of our services. These service providers have access to only such
              information needed to perform their functions, and you hereby consent to the sharing
              of your information with these third parties. In addition, our Services may contain
              links leading to other websites. Our Policy does not apply to the practices of such
              websites. UniRide is not responsible for the actions of, or the content displayed on,
              websites which are not our own. We encourage you to exercise caution on the Internet,
              to be aware of when you&apos;re leaving our Site, and to read the privacy policies of
              each website you visit.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              2.1 Third Party Analytics
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              We use third party services such as Google Analytics and Google Maps to measure
              traffic on our website and applications and as part of our Services, although Google
              is not the only third party we use for our analytics. Specifically, we use analytics
              software and code to enable us to continually improve the content and Services we
              offer to you, for systems administration purposes, to evaluate your use of the
              Services, to compile reports on activity, to analyze performance metrics, and to
              collect and evaluate other information related to the Services. Some of our analytics
              can be used to track users over time, for geo-location purposes, and across third
              party websites. We allow these third-party services to use cookies, web beacons, pixel
              tags, and similar technologies to record information about your interaction with us on
              our website and social media and elsewhere on the Internet (“Tracking Data”) and use
              such Tracking Data to display ads for UniRide when you visit other websites. These
              third-party companies may not recognize browser “Do Not Track” signals. By using the
              Services, you agree to be bound by the Google terms of service and privacy policy,
              found here (https://policies.google.com/?hl=en-US) and here
              (https://www.google.com/help/terms_maps/) If you would like to opt-out of Google
              Analytics, please visit the following website:
              https://tools.google.com/dlpage/gaoptout/. The Facebook policies are found here
              (https://www.facebook.com/privacy/explanation) and here
              (https://www.facebook.com/policies?ref=pf).
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              3. Cookies.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              UniRide may receive aggregated, non-personally identifiable information and analysis
              from third party measurement services which help us understand how our users interact
              with the Services, such as Google Analytics and Google Ads. We use various
              technologies to collect and store information, including, cookies, local storage,
              browser web storage, application data caches, databases, and server logs, among other
              techniques identified herein. Regarding cookies, cookies are small text files that a
              website places on your computer or mobile device when you visit a page or website for
              the first time. Cookies help us to recognize your device the next time you visit the
              website. Cookies have different functions. With the information provided to us through
              cookies, we will be able to learn your interests and attitudes. Cookies can help us to
              analyze how well our website works and allows us to adapt our content so that the
              relevant information is provided to you. Most browsers can be set in the settings so
              that they no longer accept cookies or you will be notified when you receive a cookie.
              If you decide to deactivate or delete cookies in the future, you must take into
              account that some or all of the Services may no longer be available to you.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              4. Aggregated Information.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              We may use anonymous, statistical or aggregated information (including anonymous
              location information) in a form that does not enable the identification of a specific
              user, and to properly operate the Services, to improve the quality of the Services, to
              enhance your experience, to create new services and features, including customized
              services, to change or cancel existing content or service, and for further internal,
              commercial and statistical purposes (including advertising and marketing). We may also
              use anonymous, statistical or aggregated information collected on the Services, in a
              form that does not enable the identification of a specific user, by posting,
              disseminating, transmitting or otherwise communicating or making available such
              information to users of the Services, to our providers, partners and any other third
              party.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              5. Sharing your Information.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              We do not sell, rent, or lease your personal information to third parties. We will not
              share your personal information with others, without your permission, except for the
              following purposes and to the extent necessary in our good-faith and sole discretion:
              as necessary for the Services; to communicate with third parties, including without
              limitation or payment processors and our affiliates; to detect, prevent, or otherwise
              address fraud, security, or technical issues; to detect and prevent fraud,
              misappropriation, infringements, identity theft and other illegal activities and
              misuse of the Services; if we organize the operation of the Services within a
              different framework, company, or through another legal structure or entity; if we are
              acquired by, or merged into or with another entity; to collect, store, hold and manage
              your personal information through cloud based or hosting services; to enforce the
              Terms of Use or Privacy Policy; to contact you when we believe it to be necessary; to
              comply with any applicable law and assist law enforcement agencies under any
              applicable law, when we have a good faith belief that our cooperation with the law
              enforcement agencies is legally mandated or meets the applicable legal standards and
              procedures; to detect abuse and illegal activity; to handle breakdowns and
              malfunctions; to take any action in any case of dispute, or legal proceeding of any
              kind between you and the Services, or between you and third parties with respect to,
              or in relation with the Services; for purposes provided under this Privacy Policy and
              Terms and Conditions; to help improve the safety and reliability of our Services. This
              includes detecting, preventing, and responding to security risks, and technical issues
              that could harm us, our users, third party providers, or the public; to create
              aggregated and/or anonymous data (where such data does not enable the identification
              of a specific user).
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              6. Controlling your Information
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              You can always review and update certain information by contacting us. If you find
              that the information associated with you and your use of our Services is not accurate,
              complete or updated, then you should make all necessary changes to correct it. Please
              keep in mind that false, incorrect, or outdated information may prevent you or impair
              your ability to provide you with Services, and may even be a violation of the law.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              7. Information Security.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              We consider your information security to be a top priority. We have taken appropriate
              technical and organizational security measures against the loss or unlawful processing
              of your personal data, and to that effect, we have implemented systems, applications,
              and procedures to secure your personal information, to minimize the risk of theft,
              damage, loss of information, or unauthorized access or use of information. Your
              personal data will be securely stored in our database. We use industry standards and
              appropriate security measures, such as firewalls and SSL (Secure Socket Layers), and
              also physically secure the locations where the data is stored. However, as effective
              as our security measures are, no security system is infallible and as such we are not
              able to give you absolute assurance in regard to your information security. Therefore,
              although we take great efforts to protect your personal information, we cannot
              guarantee and you cannot reasonably expect that the databases will be immune from any
              wrongdoings, malfunctions, unlawful interceptions or access, or other kinds of abuse
              and misuse. The transfer of your data to us is always at your own risk. Furthermore,
              e-mail, our contact forms, Facebook Messenger, and other platforms are not secure
              forms of communication. Please do not send us your Social Security number, credit card
              number, or other sensitive personal information via these platforms. Although we will
              take reasonable measures to protect your personal information, we cannot guarantee the
              security of your data transmitted to and from our website or over mobile networks; any
              transmission is at your own risk. You understand that data and communications,
              including email and other electronic communications, may be accessed by unauthorized
              third parties when communicated over the Internet. Your use of our Services is your
              express and voluntary consent to and acknowledgment of these risks.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              8. Data Storage.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              Unless otherwise stated herein, we store your data until you expressly advise us of
              your intention to have your account and data deleted. If you would like to delete your
              account and/or request that we no longer use your data in the future to provide
              Services to you, please contact us. Upon receiving your request to delete your
              personal information, we will use reasonable efforts to delete such information;
              however please note that information may not be deleted immediately from our backup
              systems. We aim to initiate the deletion process immediately after your request unless
              we determine at our discretion that we need your information to comply with legal
              obligations or to settle disputes.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              9. Payment Processing.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              If you use our Services, your credit card data and data of other payment methods will
              be forwarded by us to a PCI-compliant payment processing provider and processed by the
              latter in order to process payments as a result of your use of our Services. Please
              note that by using the Services, you are consenting to allow us to transfer the credit
              card details or data of other payment methods you have registered to our PCI-compliant
              payment processors, such as Stripe, Square, or PayPal.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              10. Marketing and Customer Service.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              By using our Services, you consent for us to use your personal data and contact
              information to send you general information about us for marketing and promotional
              purposes. We may use your information to send you news, newsletters, special offers,
              promotions, updates, and announcements related to our Services and your use of the
              same, among other things. As stated herein, we will use the information we learn about
              you to determine how best we can serve you and our community through the use of the
              Services. You can unsubscribe from these notifications at any time by contacting us.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              11. Contact and Notices.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              If you have any questions about this Privacy Policy, or if you believe that your
              privacy has been compromised in the course of using the Services, please contact
              UniRide LLC by e-mail to info@unirideus.com. You can also send UniRide other requests,
              responses, praise, questions, and complaints by e-mail at: info@unirideus.com. If you
              need to reach us by mail, please send your correspondence by U.S. Postal Service
              Certified Mail, Return Receipt Requested, to UniRide LLC, 7950 NW 53rd Street, Ste.
              337, Doral, FL 33166.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              12. European requirements.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              If the European Union (EU) data protection law applies to the processing of your
              information, we provide the controls described in this policy so you can exercise your
              right to request access to, update, remove, delete, and restrict the processing of
              your information. As detailed herein, you also have the right to object to the
              processing of your information. We ask for your agreement to process your information
              for specific purposes—and your consent is given by use of our Services—and you have
              the right to withdraw your consent at any time. You can manage your settings at any
              time, and contact us for questions regarding the same. We process your information for
              our legitimate interests and those of third parties while applying appropriate
              safeguards that protect your privacy. We process your data pursuant to a contract,
              including this Privacy Policy and the Terms and Conditions.
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              13. Transmission of Data.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              Your personal data will be transmitted to and processed in the United States and in
              other places such as Switzerland or the European Union, and perhaps others that do not
              have data protection laws comparable to Switzerland, the European Union, or the United
              States. You hereby consent to the transfer and processing of your personal data to
              such countries (whether known to you or not), particularly to the United States. Among
              other reasons outlined herein, data may be transmitted to third parties for
              helpdesk/support, business intelligence, payment processor compliance, hosting (for
              both data and applications), and communications services, all of which are geared and
              done to provide you with the benefits of the Services.{' '}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              14. Changes to this Privacy Policy
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              We may from time to time change the terms of this Privacy Policy. Changes will take
              effect immediately after we have posted the changed or amended Privacy Policy to our
              website and/or application. You agree to be bound by any of the changes made in the
              terms of this Privacy Policy. Continuing to use the Services will indicate your
              acceptance of the amended terms. If you do not agree with any of the amended terms,
              you must avoid any further use of the Services.
            </Typography>
          </CMSSection>
        </LargeInnerContent>
      </Layout>
    </ThemeProvider>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    // Handle unauthenticated access
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      userAuth: session.user || null,
    },
  };
}
const CMSSection = styled.div`
  ${({ theme }) => `
  border-radius: 16px 0px 16px 16px; box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10); background-color:${theme.colors.palette.white}; padding:24px;  margin-top:60px;

}

  `}
`;
