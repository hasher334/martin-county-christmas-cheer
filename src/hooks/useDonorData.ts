
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
    if (!user?.id || !user?.email) {
      console.log("No user ID or email found", { userId: user?.id, email: user?.email });
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

      console.log("Fetching donor data for user:", { userId: user.id, email: user.email });

      // First, try to find the donor by user_id
      let { data: donor, error: donorError } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .abortSignal(abortControllerRef.current.signal)
        .maybeSingle();

      if (donorError) {
        console.error("Error fetching donor profile by user_id:", donorError);
        throw donorError;
      }

      // If no donor found by user_id, try to find by email and update the user_id
      if (!donor) {
        console.log("No donor found by user_id, trying email lookup...");
        
        const { data: emailDonor, error: emailDonorError } = await supabase
          .from("donors")
          .select("*")
          .eq("email", user.email)
          .abortSignal(abortControllerRef.current.signal)
          .maybeSingle();

        if (emailDonorError) {
          console.error("Error fetching donor profile by email:", emailDonorError);
          throw emailDonorError;
        }

        if (emailDonor) {
          console.log("Found donor by email, updating user_id...");
          
          // Update the donor record with the current user_id
          const { data: updatedDonor, error: updateError } = await supabase
            .from("donors")
            .update({ user_id: user.id })
            .eq("id", emailDonor.id)
            .select()
            .single();

          if (updateError) {
            console.error("Error updating donor user_id:", updateError);
            throw updateError;
          }

          donor = updatedDonor;
          console.log("Successfully updated donor with user_id");
        }
      }

      // If still no donor found, create a new one
      if (!donor) {
        console.log("No donor profile found, creating new one...");
        
        const { data: newDonor, error: createError } = await supabase
          .from("donors")
          .insert({
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating donor profile:", createError);
          throw createError;
        }

        donor = newDonor;
        console.log("Successfully created new donor profile");
      }

      console.log("Found/created donor profile:", donor);

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

      console.log("Found adoptions:", adoptions?.length || 0);

      // Also check for adoptions linked to donors with the same email (legacy data)
      const { data: legacyAdoptions, error: legacyError } = await supabase
        .from("adoptions")
        .select(`
          *,
          children (*),
          donors!inner(email)
        `)
        .eq("donors.email", user.email)
        .neq("donor_id", donor.id)
        .order("adopted_at", { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (legacyError) {
        console.error("Error fetching legacy adoptions:", legacyError);
        // Don't throw here, just log the error
      }

      // Combine adoptions and legacy adoptions
      const allAdoptions = [
        ...(adoptions as AdoptionWithChild[] || []),
        ...(legacyAdoptions as AdoptionWithChild[] || [])
      ];

      console.log("Total adoptions found (including legacy):", allAdoptions.length);

      const data: DonorData = {
        donor,
        adoptions: allAdoptions
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
  }, [user?.id, user?.email, toast]);

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
