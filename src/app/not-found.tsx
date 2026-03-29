import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <div className="text-5xl">🍺</div>
      <div>
        <h1 className="text-2xl font-bold">ページが見つかりません</h1>
        <p className="text-xs text-[var(--text-dim)] mt-2">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
      </div>
      <Link
        href="/"
        className="btn-primary inline-block text-center"
        style={{ width: "auto", padding: "0.75rem 2rem" }}
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
