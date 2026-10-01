import { useCallback, useEffect, useState } from 'react';
import { Purchases } from '@revenuecat/purchases-js';
import { supabase } from '../lib/supabase';

// Credits are RevenueCat in-app currency CRED; the RevenueCat app user id is the Supabase user id.
// The browser can only read the balance; spending happens in the generate-story function.
export const STORY_COST = 5;

let ready: Promise<void> = Promise.resolve();

// Called on sign-in. Settles once the customer exists in RevenueCat and the one-time free
// credits have been requested, so the first balance read already includes them.
export const startCredits = (userId: string) => {
  ready = (async () => {
    if (!Purchases.isConfigured()) {
      Purchases.configure({ apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY!, appUserId: userId });
    } else if (Purchases.getSharedInstance().getAppUserId() !== userId) {
      await Purchases.getSharedInstance().changeUser(userId);
    }
    await Purchases.getSharedInstance().getCustomerInfo();
    const { data: profile } = await supabase.from('profiles').select('welcome_granted').eq('id', userId).single();
    if (profile && !profile.welcome_granted) await supabase.functions.invoke('welcome-credits');
  })().catch(error => console.error('Credits setup failed:', error));
};

export const useCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    await ready;
    if (!Purchases.isConfigured()) return;
    const purchases = Purchases.getSharedInstance();
    purchases.invalidateVirtualCurrenciesCache();
    const currencies = await purchases.getVirtualCurrencies();
    setCredits(currencies.all.CRED?.balance ?? 0);
  }, []);

  useEffect(() => { refresh().catch(error => console.error('Could not load credits:', error)); }, [refresh]);

  return { credits, refresh };
};
