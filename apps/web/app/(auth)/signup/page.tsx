// "use client";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import FormInput from "@/components/FormInput";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import Link from "next/link";
// import { client } from "@/lib/auth-client";
// import { ArrowRight, Sparkles } from "lucide-react";

// const RegisterSchema = z.object({
//   email: z.string().email("Invalid email address").min(1, "Email is required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   name: z.string().min(1, "Name is required"),
// });

// type RegisterForm = z.infer<typeof RegisterSchema>;

// const RegisterPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterForm>({
//     resolver: zodResolver(RegisterSchema),
//   });
//   const router = useRouter();

//   const onSubmit = async (data: RegisterForm) => {
//     setIsLoading(true);
//     try {
//       await client.signUp.email({
//         ...data,
//         fetchOptions: {
//           onResponse: () => setIsLoading(false),
//           onRequest: () => setIsLoading(true),
//           onError: (ctx) => {
//             toast.error(ctx.error.message);
//           },
//           onSuccess: async () => {
//             toast.success("Account created successfully");
//             router.replace("/dashboard");
//           },
//         },
//       });
//     } catch (error) {
//       console.error("An error occurred during registration:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="relative flex min-h-screen w-full items-center justify-center bg-[#FAF9F4] px-4 text-[#15172B]"
//       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
//       `}</style>

//       <Sparkles
//         className="absolute left-8 top-16 hidden h-7 w-7 rotate-12 text-[#FFC94A] sm:block"
//         strokeWidth={1.5}
//       />

//       <div className="w-full max-w-md rounded-2xl border border-[#E7E3D8] bg-white p-8 shadow-[0_20px_60px_-20px_rgba(21,23,43,0.15)]">
//         <div className="mb-8 text-center">
//           <Link href="/" className="inline-flex items-center gap-2">
//             <span
//               className="text-2xl leading-none text-[#15172B]"
//               style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
//             >
//               sketchly
//             </span>
//             <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6B57]" />
//           </Link>
//           <h1 className="mt-4 text-2xl font-semibold tracking-tight">
//             Create your account
//           </h1>
//           <p className="mt-1 font-mono text-[12px] text-[#9C9A8E]">
//             free forever for teams under 5 · no credit card
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <FormInput
//             label="Name"
//             name="name"
//             type="text"
//             register={register}
//             errors={errors}
//           />
//           <FormInput
//             label="Email"
//             name="email"
//             type="email"
//             register={register}
//             errors={errors}
//           />
//           <FormInput
//             label="Password"
//             name="password"
//             type="password"
//             register={register}
//             errors={errors}
//           />

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#15172B] px-6 py-3 text-sm font-medium text-[#FAF9F4] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
//           >
//             {isLoading ? "Registering..." : "Start sketching free"}
//             {!isLoading && (
//               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//             )}
//           </button>
//         </form>

//         <div className="mt-5 flex items-center justify-center gap-1 font-mono text-[13px] text-[#5B5D6E]">
//           <p>already have an account?</p>
//           <Link href="/login" className="font-medium text-[#15172B] underline underline-offset-2">
//             Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { client } from "@/lib/auth-client";
import { ArrowRight, Sparkles } from "lucide-react";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await client.signUp.email({
        ...data,
        fetchOptions: {
          onResponse: () => setIsLoading(false),
          onRequest: () => setIsLoading(true),
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: async () => {
            toast.success("Account created successfully");
            router.replace(redirectTo);
          },
        },
      });
    } catch (error) {
      console.error("An error occurred during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-[#FAF9F4] px-4 text-[#15172B]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <Sparkles
        className="absolute left-8 top-16 hidden h-7 w-7 rotate-12 text-[#FFC94A] sm:block"
        strokeWidth={1.5}
      />

      <div className="w-full max-w-md rounded-2xl border border-[#E7E3D8] bg-white p-8 shadow-[0_20px_60px_-20px_rgba(21,23,43,0.15)]">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span
              className="text-2xl leading-none text-[#15172B]"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              sketchly
            </span>
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6B57]" />
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 font-mono text-[12px] text-[#9C9A8E]">
            free forever for teams under 5 · no credit card
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Name"
            name="name"
            type="text"
            register={register}
            errors={errors}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#15172B] px-6 py-3 text-sm font-medium text-[#FAF9F4] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Registering..." : "Start sketching free"}
            {!isLoading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-1 font-mono text-[13px] text-[#5B5D6E]">
          <p>already have an account?</p>
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-[#15172B] underline underline-offset-2">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;