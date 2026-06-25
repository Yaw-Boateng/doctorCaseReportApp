import React, { useState, useEffect } from "react";
import testService from "@/lib/testService";
import { TestModal } from "./components/TestModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, FlaskConical, RefreshCw } from "lucide-react";

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 const fetchTests = async () => {
  try {
    setLoading(true);
    const res = await testService.getAllTests();
    
    console.log("Raw API response received in component:", res); // Debug log to see the exact shape!

    // Extract the array carefully across raw axios responses, paged wrappers, or direct payloads
    let arrayData = [];
    
    if (res) {
      if (Array.isArray(res)) {
        arrayData = res;
      } else if (res.content && Array.isArray(res.content)) {
        arrayData = res.content;
      } else if (res.data && Array.isArray(res.data)) {
        // Captures raw axios responses if the interceptor bypassed formatting
        arrayData = res.data; 
      } else if (res.data?.content && Array.isArray(res.data.content)) {
        arrayData = res.data.content;
      }
    }

    setTests(arrayData);
  } catch (err) {
    console.error("Failed fetching diagnostic inventory matrices:", err);
    setTests([]); // Fallback to safe array on total failure
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTests();
  }, []);

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
      } else {
        await testService.createTest(apiPayload);
      }
      fetchTests();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Critical fault executing database mutation command context:", err);
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
      setIsModalOpen(false);
      fetchTests();
    } catch (err) {
      console.error("Error toggling item structural system state maps:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await testService.deleteTest(id);
      fetchTests();
    } catch (err) {
      console.error("Failed purging configuration specification index maps:", err);
    }
  };

  return (
    <div className="space-y-6 p-1 text-foreground">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" /> Diagnostic Test Engineering Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure system laboratory execution profiles, billing costs, and commission parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTests} disabled={loading} className="h-8 gap-1.5 text-xs">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleOpenCreate} className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" /> Provision Test
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-60 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs">Synchronizing diagnostic operational maps...</span>
        </div>
      ) : tests.length === 0 ? (
        <div className="border border-dashed border-border/60 rounded-xl p-12 text-center text-muted-foreground max-w-xl mx-auto mt-6">
          <FlaskConical className="h-8 w-8 mx-auto opacity-40 mb-3" />
          <p className="text-sm font-medium">No Diagnostic Procedures Logged</p>
          <p className="text-xs opacity-80 max-w-xs mx-auto mt-1">
            Provision structural execution guidelines to allow diagnostic case logging interfaces.
          </p>
          <Button onClick={handleOpenCreate} size="sm" variant="outline" className="mt-4 text-xs h-8">
            Add Initial Test Record
          </Button>
        </div>
      ) : (
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
                      <td className="p-3 pl-4 font-semibold text-foreground/90">{test.testName}</td>
                      <td className="p-3 font-medium">${Number(test.price || 0).toFixed(2)}</td>
                      <td className="p-3 font-medium">${Number(test.commission || 0).toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <Badge variant={active ? "success" : "secondary"} className="text-[10px] font-bold uppercase tracking-wide">
                          {active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenView(test)} className="h-7 px-2 text-[11px] hover:bg-background">
                          Manage Settings
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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