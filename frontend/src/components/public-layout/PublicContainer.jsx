export default function PublicContainer({ children }) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        {children}
      </div>
    </main>
  );
}