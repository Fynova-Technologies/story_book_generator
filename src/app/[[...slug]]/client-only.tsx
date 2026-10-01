'use client';

import dynamic from 'next/dynamic';

// The SPA touches window/localStorage at import time, so never render it on the server.
export const ClientOnly = dynamic(() => import('./client'), { ssr: false });
