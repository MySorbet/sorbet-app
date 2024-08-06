export function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export const decodeIfTruthy = (paramVal: any) => {
  if (paramVal === 'true' || paramVal === 'false') return paramVal === 'true';
  if (paramVal) {
    return decodeURIComponent(paramVal);
  }

  return paramVal;
};

export function isUrlNotJavascriptProtocol(url: any) {
  if (!url) {
    return true;
  }
  try {
    const urlProtocol = new URL(url).protocol;
    // eslint-disable-next-line no-script-url
    if (urlProtocol === 'javascript:') {
      console.log(
        'Invalid URL protocol:',
        urlProtocol,
        'URL cannot execute JavaScript'
      );
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export const deleteOidcKeyPairOnLocalStorage = () => {
  const itemCount = localStorage.length;
  for (let i = 0; i < itemCount; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith('near-api-js:keystore:oidc_keypair')) {
      console.log(`removing ${key} from localStorage`);
      localStorage.removeItem(key);
    }
  }
};

// Use this function to implement wait logic for async process
export const withTimeout = async (promise: any, timeoutMs: any) => {
  // Create a promise that resolves with false after timeoutMs milliseconds
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve(false), timeoutMs);
  });

  // Race the input promise against the timeout
  return Promise.race([promise, timeoutPromise]);
};
