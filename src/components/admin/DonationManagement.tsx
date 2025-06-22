import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, RefreshCw, Filter } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Donation = Tables<"donations"> & {
  donors: Tables<"donors"> | null;
};

type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export const DonationManagement = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, [statusFilter]);

  const fetchDonations = async () => {
    try {
      let query = supabase
        .from("donations")
        .select(`
          *,
          donors (*)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setDonations(data || []);
      
      // Calculate total amount
      const total = (data || []).reduce((sum, donation) => {
        if (donation.status === 'completed') {
          return sum + (donation.amount || 0);
        }
        return sum;
      }, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast({
        title: "Error",
        description: "Failed to load donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-green-600">{formatAmount(totalAmount)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-blue-600">{donations.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {donations.filter(d => d.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Donation History</CardTitle>
            <Select value={statusFilter} onValueChange={(value: PaymentStatus | "all") => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Donations</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No donations found
              </div>
            ) : (
              donations.map((donation) => (
                <Card key={donation.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {formatAmount(donation.amount || 0)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Donor: {donation.donors?.name || donation.donors?.email || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(donation.created_at || "").toLocaleString()}
                            </p>
                            {donation.donation_notes && (
                              <p className="text-xs text-gray-600 mt-1">
                                Note: {donation.donation_notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(donation.status || "unknown")}
                            {donation.is_recurring && (
                              <Badge variant="outline" className="text-blue-600">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {donation.stripe_payment_intent_id && (
                          <p>Payment ID: {donation.stripe_payment_intent_id.slice(-8)}</p>
                        )}
                        {donation.refund_amount && donation.refund_amount > 0 && (
                          <p className="text-red-600">
                            Refunded: {formatAmount(donation.refund_amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
