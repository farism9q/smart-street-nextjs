import { ModeToggle } from "@/components/theme-toggle";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="absolute top-0 right-0 p-4">
        <ModeToggle />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 p-24">
        <div className="md:w-[760px] lg:w-[870px] mx-auto duration-300 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
          <span
            className={
              "absolute -left-16 -top-16 h-60 w-60 rounded-full z-50 blur-3xl animate-blob animation-delay-300 bg-primary/50 opacity-100"
            }
          />
        </div>

        {children}
      </div>
    </main>
  );
};

export default layout;
