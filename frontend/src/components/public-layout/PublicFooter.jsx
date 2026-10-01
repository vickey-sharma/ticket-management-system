export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CRM Helpdesk. All rights reserved.
      </div>
    </footer>
  );
}