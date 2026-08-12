import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() { return <main className="mx-auto flex min-h-screen max-w-md items-center px-6"><Card className="w-full"><CardHeader><CardTitle>회원가입</CardTitle><CardDescription>나만의 포트폴리오 대시보드를 시작하세요.</CardDescription></CardHeader><CardContent><SignupForm /></CardContent></Card></main>; }
