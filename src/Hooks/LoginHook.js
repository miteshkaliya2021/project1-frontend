import { useGoogleLogin } from "react-google-login";

const { signIn, loaded } = useGoogleLogin({
  onSuccess,
  onAutoLoadFinished,
  clientId,
  cookiePolicy,
  loginHint,
  hostedDomain,
  autoLoad,
  isSignedIn,
  fetchBasicProfile,
  redirectUri,
  discoveryDocs,
  onFailure,
  uxMode,
  scope,
  accessType,
  responseType,
  jsSrc,
  onRequest,
  prompt,
});
