const NETWORK_ERROR_MESSAGE =
  "Supabase 인증 서버에 연결할 수 없습니다. 인터넷 연결, Supabase 프로젝트 활성 상태, NEXT_PUBLIC_SUPABASE_URL 설정을 확인해 주세요.";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && /failed to fetch|networkerror|network error/i.test(error.message)) {
    return NETWORK_ERROR_MESSAGE;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.length > 0
  ) {
    return error.message;
  }

  return "인증 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}
