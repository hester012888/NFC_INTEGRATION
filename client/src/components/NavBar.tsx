export default function NavBar({
    active,
    onChange,
}: {
    active: "home" | "collection"
    onChange: (v: "home" | "collection") => void
}) {
    return (
        <div
            className="museum-nav flex-none flex justify-around items-center py-4 pb-8"
            style={{
                borderTop: "1px solid rgba(155,113,58,0.08)",
                paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            }}
        >
            {[
                { key: "home" as const, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l9-5 9 5H3zm2 3v8m7-8v8m7-8v8M3 21h18" /></svg>, label: "探馆" },
                { key: "collection" as const, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h14v18H5zM9 3v18" /><circle cx="14" cy="11" r="2.5" /><path d="M12 14v3l2-1 2 1v-3" /></svg>, label: "我的藏章" },
            ].map((item) => (
                <button
                    key={item.key}
                    onClick={() => onChange(item.key)}
                    className="flex flex-col items-center gap-1"
                    style={{
                        color: active === item.key ? "#88602f" : "#806a50",
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                    }}
                >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </div>
    )
}