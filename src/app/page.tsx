import { SplineSceneBasic } from "@/components/ui/demo";
import { ChatComponent } from "@/components/chat";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black py-12">
      <main className="w-full max-w-6xl p-4 flex flex-col gap-8">
        <SplineSceneBasic />
        <ChatComponent />
      </main>
    </div>
  );
}

