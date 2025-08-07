
'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';

export function NextNProgressClient() {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
      const currentUrl = window.location.href;
      if (targetUrl !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation: MutationCallback = () => {
      const anchorElements = document.querySelectorAll('a');
      anchorElements.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    // Ensure cleanup happens correctly
    return () => {
        mutationObserver.disconnect();
        const anchorElements = document.querySelectorAll('a');
        anchorElements.forEach((anchor) => anchor.removeEventListener('click', handleAnchorClick));
    };

  }, []);

  return null;
}
