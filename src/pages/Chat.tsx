import { useState } from "react";
import { Composer } from "@/features/chat/ui/Composer/Composer";
import { Header } from "@/features/chat/ui/Header/Header";
import { Messages } from "@/features/chat/ui/Messages/Messages";
import { Sidebar } from "@/features/chat/ui/Sidebar/Sidebar";

const Chat = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="relative grid h-[100dvh] grid-cols-1 md:grid-cols-[320px_1fr] bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:block border-r border-slate-200/80 bg-slate-50/60 backdrop-blur-sm">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* overlay */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Закрыть меню"
          />
          {/* sheet */}
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] bg-white border-r border-slate-200 shadow-xl">
            <Sidebar onAfterSelect={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* main */}
      <main className="relative flex min-h-0 h-full flex-col">
        {/* передаём триггер открытия в Header */}
        <Header onOpenSidebarMobile={() => setSidebarOpen(true)} />
        <Messages />
        <Composer />
      </main>
    </section>
  );
};

export default Chat;
