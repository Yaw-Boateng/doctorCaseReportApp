import React, { useState, useEffect, useCallback } from "react";
import testService from "@/lib/testService";
import { TestModal } from "./components/TestModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FlaskConical, RefreshCw } from "lucide-react";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ToastContext";

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states (0-indexed internally to match Spring Boot backend Pageable)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const { addToast } = useToast();

  // Memoized data payload query orchestrator
  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);

      // Pass down parameters cleanly using your internal 0-indexed tracking index
      const res = await testService.getAllTests({ page: page, size: PAGE_SIZE });

      let arrayData = [];
      let backendTotalPages = 1;

      // Extract content mapping matching your backend Swagger schema context structure: res.data.content
      if (res && res.success && res.data) {
        const payloadData = res.data;
        if (Array.isArray(payloadData.content)) {
          arrayData = payloadData.content;
          backendTotalPages = payloadData.totalPages ?? 1;
        }
      } else if (res && Array.isArray(res.content)) {
        // Fallback safety parsing layer
        arrayData = res.content;
        backendTotalPages = res.totalPages ?? 1;
      }

      setTests(arrayData);
      setTotalPages(backendTotalPages);
    } catch (err) {
      console.error("Failed fetching diagnostic inventory matrices:", err);
      setTests([]);
      setTotalPages(0);
      
      addToast({
        type: "error",
        title: "Sync Failure",
        description: "Failed to connect to the diagnostic procedure catalog registry.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [page, addToast]);

  // Synchronize state requests on active layout tracking mutations
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleOpenCreate = () => {
    setSelectedTest(null);
    setIsModalOpen(true);
  };

  const handleOpenView = (testItem) => {
    setSelectedTest(testItem);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const apiPayload = {
        testName: formData.testName,
        price: formData.price,
        commission: formData.commission,
      };

      if (selectedTest) {
        await testService.updateTest(selectedTest.id, apiPayload);
        
        addToast({
          type: "success",
          title: "Procedure Updated",
          description: `Successfully modified properties for "${formData.testName}".`,
          duration: 4000
        });
      } else {
        await testService.createTest(apiPayload);
        
        addToast({
          type: "success",
          title: "Procedure Provisioned",
          description: `"${formData.testName}" has been successfully appended to system indexes.`,
          duration: 4500
        });
        
        // Reset to page 0 on new entry creation to show fresh data context
        setPage(0);
      }
      fetchTests();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Critical fault executing database mutation command context:", err);
      addToast({
        type: "error",
        title: "Mutation Blocked",
        description: err.response?.data?.message || "Failed to finalize catalog updates. Please verify configurations.",
        duration: 5000
      });
    }
  };

  const handleToggleStatus = async (testItem) => {
    try {
      const isActive = testItem.status === "ACTIVE" || testItem.active === true;
      if (isActive) {
        await testService.deactivateTest(testItem.id);
      } else {
        await testService.activateTest(testItem.id);
      }
      
      addToast({
        type: isActive ? "warning" : "success",
        title: isActive ? "Procedure Offline" : "Procedure Operational",
        description: `"${testItem.testName}" is now marked as ${isActive ? "Inactive" : "Active"}.`,
        duration: 4000
      });

      setIsModalOpen(false);
      fetchTests();
    } catch (err) {
      console.error("Error toggling item structural system state maps:", err);
      addToast({
        type: "error",
        title: "Lifecycle Alteration Failed",
        description: "Could not apply operational switch parameters to database node.",
        duration: 5000
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await testService.deleteTest(id);

      addToast({
        type: "error",
        title: "Procedure De-indexed",
        description: "The requested tracking card was dropped from the database layers.",
        duration: 4000
      });

      // Balance edge condition where current active page becomes suddenly empty after purging
      if (tests.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        fetchTests();
      }
    } catch (err) {
      console.error("Failed purging configuration specification index maps:", err);
      addToast({
        type: "error",
        title: "Purge Rejected",
        description: err.response?.data?.message || "Cannot drop parameters linked with active tracking metrics.",
        duration: 5000
      });
    }
  };

  return (
    <div className="space-y-6 p-1 text-foreground">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" /> Diagnostic Test
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure system laboratory execution profiles, billing costs, and commission.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTests}
            disabled={loading}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> Provision Test
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-60 flex items-center justify-center w-full">
          <Loader message="Fetching diagnostic indices..." />
        </div>
      ) : tests.length === 0 ? (
        <div className="border border-dashed border-border/60 rounded-xl p-12 text-center text-muted-foreground max-w-xl mx-auto mt-6">
          <FlaskConical className="h-8 w-8 mx-auto opacity-40 mb-3" />
          <p className="text-sm font-medium">No Diagnostic Procedures Logged</p>
          <p className="text-xs opacity-80 max-w-xs mx-auto mt-1">
            Provision structural execution guidelines to allow diagnostic case logging interfaces.
          </p>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            variant="outline"
            className="mt-4 text-xs h-8"
          >
            Add Initial Test Record
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold uppercase tracking-wider">
                    <th className="p-3 pl-4">Procedure Catalog Designation</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Commission Rate</th>
                    <th className="p-3 text-center">Lifecycle</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {tests.map((test) => {
                    const active = test.status === "ACTIVE" || test.active === true;
                    return (
                      <tr key={test.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="p-3 pl-4 font-semibold text-foreground/90">
                          {test.testName}
                        </td>
                        <td className="p-3 font-medium">
                          ₵{Number(test.price || 0).toFixed(2)}
                        </td>
                        <td className="p-3 font-medium">
                          ₵{Number(test.commission || 0).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge
                            variant={active ? "success" : "secondary"}
                            className="text-[10px] font-bold uppercase tracking-wide"
                          >
                            {active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-3 pr-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenView(test)}
                            className="h-7 px-3 text-[11px] font-medium tracking-tight border-border/80 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground transition-all rounded-md"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* NOTE ON PAGINATION INTERFACE:
            If your PaginationWrapper expects 1-based page numbering for display (e.g. Page 1, 2, 3),
            pass "page + 1" to currentPage, and execute "onPageChange={(p) => setPage(p - 1)}".
            
            If it uses 0-based indexing natively, leave it exactly as below:
          */}
          <PaginationWrapper
            currentPage={page} 
            totalPages={totalPages}
            onPageChange={(targetPage) => setPage(targetPage)}
            isLoading={loading}
          />
        </div>
      )}

      <TestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        testItem={selectedTest}
      />
    </div>
  );
}