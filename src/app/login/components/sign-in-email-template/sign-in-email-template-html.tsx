import { renderAsync } from "@react-email/render";
import {
  SignInEmailTemplate,
  type SignInEmailTemplateProps,
} from "./sign-in-email-template";

export const emailTemplateHtml = ({ to, url }: SignInEmailTemplateProps) => {
  return renderAsync(<SignInEmailTemplate to={to} url={url} />, {
    pretty: true,
  });
};
