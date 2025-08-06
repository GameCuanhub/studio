
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/question-form";

export default function Home() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ajukan Pertanyaan</h1>
        </div>
        <QuestionForm />
      </div>
    </AppLayout>
  );
}
