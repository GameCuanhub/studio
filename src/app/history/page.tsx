"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { HistoryItem } from "@/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("pintarai-history", []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle>Question History</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {sortedHistory.map((item) => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start text-left">
                      <p className="font-semibold">{item.summary}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.classLevel} &middot; {item.subject} &middot; {format(new Date(item.timestamp), "PPP p")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-2">Your Question:</h4>
                        <p className="text-sm whitespace-pre-wrap">{item.questionText}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">AI Answer:</h4>
                        <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap">{item.answer}</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center">You have no question history yet.</p>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
