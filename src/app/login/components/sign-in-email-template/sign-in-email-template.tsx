import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type SignInEmailTemplateProps = {
  lang?: string;
  to: string;
  url: string;
};

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

export function SignInEmailTemplate({
  lang = "en",
  to,
  url,
}: SignInEmailTemplateProps) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>Fin Control sign in</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hi {to},</Text>
            <Text style={text}>
              You requested to sign in to Fin Control. To continue, click the
              button bellow.
            </Text>
            <Button style={button} href={url}>
              Sign in
            </Button>
            <Text style={text}>
              If you don&apos;t want to log in or didn&apos;t request this, just
              ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
