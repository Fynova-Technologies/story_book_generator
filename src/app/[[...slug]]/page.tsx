import { ClientOnly } from './client-only';

// The React Router SPA owns every non-API path.
export default function Page() {
  return <ClientOnly />;
}
