import { useCallback, useEffect, useState } from 'react';
import { ErrorCode, type NonSubscriptionTransaction, type Package, Purchases, PurchasesError } from '@revenuecat/purchases-js';
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

// Credit packs from the current RevenueCat offering ("credits"), cheapest first. Logged-out
// visitors browse with an anonymous RevenueCat id; startCredits swaps in the real user on login.
export const useCreditPacks = (loggedIn: boolean, authReady: boolean) => {
  const [packs, setPacks] = useState<Package[] | null>(null);

  useEffect(() => {
    if (!authReady) return;
    (async () => {
      if (loggedIn) await ready;
      else if (!Purchases.isConfigured()) {
        Purchases.configure({ apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY!, appUserId: Purchases.generateRevenueCatAnonymousAppUserId() });
      }
      const offerings = await Purchases.getSharedInstance().getOfferings();
      setPacks([...offerings.current?.availablePackages ?? []]
        .sort((a, b) => a.webBillingProduct.currentPrice.amountMicros - b.webBillingProduct.currentPrice.amountMicros));
    })().catch(error => { console.error('Could not load credit packs:', error); setPacks([]); });
  }, [loggedIn, authReady]);

  return packs;
};

// "credits_25" -> 25
export const productCredits = (productId: string) => Number(productId.split('_').pop());
export const packCredits = (pack: Package) => productCredits(pack.webBillingProduct.identifier);

// Opens RevenueCat's checkout. Resolves false if the user closed it; credits land via RevenueCat.
export const buyPack = async (pack: Package, email: string | null) => {
  try {
    await Purchases.getSharedInstance().purchase({ rcPackage: pack, customerEmail: email ?? undefined });
    return true;
  } catch (error) {
    if (error instanceof PurchasesError && error.errorCode === ErrorCode.UserCancelledError) return false;
    throw error;
  }
};

// Credit pack purchases, newest first.
export const usePurchaseHistory = () => {
  const [purchases, setPurchases] = useState<NonSubscriptionTransaction[] | null>(null);

  useEffect(() => {
    (async () => {
      await ready;
      if (!Purchases.isConfigured()) return setPurchases([]);
      const info = await Purchases.getSharedInstance().getCustomerInfo();
      setPurchases([...info.nonSubscriptionTransactions].sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime()));
    })().catch(error => { console.error('Could not load purchases:', error); setPurchases([]); });
  }, []);

  return purchases;
};
