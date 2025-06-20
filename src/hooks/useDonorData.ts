
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;
type Adoption = Tables<"adoptions">;
type Donor = Tables<"donors">;

interface AdoptionWithChild extends Adoption {
  children: Child;
}

interface DonorData {
  donor: Donor | null;
  adoptions: AdoptionWithChild[];
}

interface UseDonorDataReturn {
  donorData: DonorData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// In-memory cache with 5-minute TTL
const cache = new Map<string, { data: DonorData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useDonorData = (user: any): UseDonorDataReturn => {
  const [donorData, setDonorData] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDonorData = useCallback(async (useCache: boolean = true) => {
    if (!user?.id) {
      console.log("No user ID found");
      setDonorData(null);
      setLoading(false);
      return;
    }

    const cacheKey = `donor-${user.id}`;
    
    // Check cache first
    if (useCache) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log("Using cached donor data");
        setDonorData(cached.data);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching donor data for user:", user.id);

      // First, find the donor profile for this user
      const { data: donor, error: donorError } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .abortSignal(abortControllerRef.current.signal)
        .maybeSingle();

      if (donorError) {
        console.error("Error fetching donor profile:", donorError);
        throw donorError;
      }

      if (!donor) {
        console.log("No donor profile found for user");
        setDonorData({ donor: null, adoptions: [] });
        setError(null);
        setLoading(false);
        return;
      }

      console.log("Found donor profile:", donor);

      // Then get all adoptions for this donor with child details
      const { data: adoptions, error: adoptionsError } = await supabase
        .from("adoptions")
        .select(`
          *,
          children (*)
        `)
        .eq("donor_id", donor.id)
        .order("adopted_at", { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (adoptionsError) {
        console.error("Error fetching adoptions:", adoptionsError);
        throw adoptionsError;
      }

      console.log("Found adoptions:", adoptions);

      const data: DonorData = {
        donor,
        adoptions: adoptions as AdoptionWithChild[] || []
      };

      // Cache the result
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      setDonorData(data);
      setError(null);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      console.error("Error fetching donor data:", error);
      setError(error.message || "Failed to load donor data");
      
      toast({
        title: "Error",
        description: "Failed to load your adoption activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const refetch = useCallback(async () => {
    await fetchDonorData(false); // Skip cache on manual refetch
  }, [fetchDonorData]);

  useEffect(() => {
    fetchDonorData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDonorData]);

  return {
    donorData,
    loading,
    error,
    refetch,
  };
};
