import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() { return <main className="mx-auto flex min-h-screen max-w-md items-center px-6"><Card className="w-full"><CardHeader><CardTitle>로그인</CardTitle><CardDescription>포트폴리오를 안전하게 관리하세요.</CardDescription></CardHeader><CardContent><LoginForm /></CardContent></Card></main>; }
