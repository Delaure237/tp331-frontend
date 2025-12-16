import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md min-h-[550px] p-8 rounded-2xl bg-white shadow-2xl shadow-black/20 flex items-center">
        <LoginForm />
      </div>
    </div>
  );
}
