import logo from "../assets/logo.png";


// //WITH TOP AND BOTTOM ACCENT
const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F7FA]">
      {/* =========================
          BACKGROUND
      ========================== */}

      {/* Soft gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(20,184,166,0.14),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(14,165,233,0.10),transparent_32%)]" />

      {/* Large decorative gradient shape */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-1/2
          h-[650px]
          w-[650px]
          -translate-y-1/2
          rounded-full
          bg-gradient-to-br
          from-[#99F6E4]/30
          via-[#C4B5FD]/15
          to-transparent
          blur-3xl
        "
      />

      {/* Top right shape */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-[500px]
          w-[500px]
          rounded-full
          bg-gradient-to-br
          from-[#C4B5FD]/30
          via-[#93C5FD]/15
          to-transparent
          blur-3xl
        "
      />

      {/* Bottom right shape */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-48
          right-[15%]
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#5EEAD4]/10
          blur-3xl
        "
      />

      {/* =========================
          MAIN
      ========================== */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_430px] lg:gap-20 xl:grid-cols-[1fr_460px] xl:gap-28">
          {/* =========================
              LEFT SIDE
          ========================== */}

          <section className="hidden lg:block">
            <div className="max-w-xl">
              {/* Logo */}
              <div className="mb-14">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Small label */}
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#0F766E]" />

                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                  Helpdesk workspace
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-[54px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#0F172A] xl:text-[64px]">
                Everything your
                <br />
                support team
                <br />

                <span className="bg-gradient-to-r from-[#0F766E] via-[#0891B2] to-[#6366F1] bg-clip-text text-transparent">
                  needs to move.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-md text-[15px] leading-7 text-[#64748B]">
                A simple workspace for managing customer requests,
                collaborating on tickets, and keeping support operations
                organized.
              </p>

              {/* Decorative visual */}
              <div className="relative mt-12 h-32 w-full max-w-md">
                {/* Main line */}
                <div className="absolute left-0 top-8 h-px w-full bg-gradient-to-r from-[#0F766E]/30 via-[#6366F1]/20 to-transparent" />

                {/* Floating card 1 */}
                <div className="absolute left-5 top-0 w-44 rotate-[-3deg] rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />

                    <span className="text-[9px] text-slate-400">
                      TICKET
                    </span>
                  </div>

                  <div className="h-2 w-24 rounded-full bg-slate-200" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-slate-100" />
                </div>

                {/* Floating card 2 */}
                <div className="absolute left-36 top-10 w-44 rotate-[3deg] rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)] backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
                      <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
                    </span>

                    <div>
                      <div className="h-2 w-16 rounded-full bg-slate-200" />
                      <div className="mt-1.5 h-1.5 w-10 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              AUTH
          ========================== */}

          <section className="w-full">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <img
                src={logo}
                alt="Company Logo"
                className="h-14 w-auto object-contain"
              />
            </div>

            {/* Card */}
            <div
              className="
                relative
                rounded-[26px]
                border
                border-slate-200/80
                bg-white
                px-6
                py-7
                shadow-[0_25px_70px_rgba(15,23,42,0.10)]
                sm:px-9
                sm:py-9
              "
            >
              {/* Top accent */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden rounded-t-[26px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F766E]/60 to-transparent" />
              </div>

              {/* Bottom accent */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-b-[26px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F766E]/35 to-transparent" />
              </div>

              {/* Top glow */}
              <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-64 -translate-x-1/2 rounded-full bg-[#0F766E]/[0.06] blur-2xl" />

              {/* Bottom glow */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-16 w-64 -translate-x-1/2 rounded-full bg-[#0F766E]/[0.04] blur-2xl" />

              {children}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />

              <p className="text-[11px] font-medium text-slate-400">
                Secure support workspace
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};



// const AuthLayout = ({ children }) => {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#F5F7FA]">
//       {/* =========================
//           BACKGROUND
//       ========================== */}

//       {/* Soft gradient wash */}
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(20,184,166,0.14),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(14,165,233,0.10),transparent_32%)]" />

//       {/* Large decorative gradient shape */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           -left-40
//           top-1/2
//           h-[650px]
//           w-[650px]
//           -translate-y-1/2
//           rounded-full
//           bg-gradient-to-br
//           from-[#99F6E4]/30
//           via-[#C4B5FD]/15
//           to-transparent
//           blur-3xl
//         "
//       />

//       {/* Top right shape */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           -right-32
//           -top-32
//           h-[500px]
//           w-[500px]
//           rounded-full
//           bg-gradient-to-br
//           from-[#C4B5FD]/30
//           via-[#93C5FD]/15
//           to-transparent
//           blur-3xl
//         "
//       />

//       {/* Bottom right shape */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           -bottom-48
//           right-[15%]
//           h-[400px]
//           w-[400px]
//           rounded-full
//           bg-[#5EEAD4]/10
//           blur-3xl
//         "
//       />

//       {/* =========================
//           MAIN CONTENT
//       ========================== */}

//       <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center px-5 py-8 sm:px-8 lg:px-12">
//         <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_430px] lg:gap-20 xl:grid-cols-[1fr_460px] xl:gap-28">
//           {/* =========================
//               LEFT SIDE
//           ========================== */}

//           <section className="hidden lg:block">
//             <div className="max-w-xl">
//               {/* Logo */}
//               <div className="mb-14">
//                 <img
//                   src={logo}
//                   alt="Company Logo"
//                   className="h-16 w-auto object-contain"
//                 />
//               </div>

//               {/* Small label */}
//               <div className="mb-6 flex items-center gap-3">
//                 <span className="h-2 w-2 rounded-full bg-[#0F766E]" />

//                 <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
//                   Helpdesk workspace
//                 </span>
//               </div>

//               {/* Heading */}
//               <h1 className="text-[54px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#0F172A] xl:text-[64px]">
//                 Everything your
//                 <br />
//                 support team
//                 <br />

//                 <span className="bg-gradient-to-r from-[#0F766E] via-[#0891B2] to-[#6366F1] bg-clip-text text-transparent">
//                   needs to move.
//                 </span>
//               </h1>

//               {/* Description */}
//               <p className="mt-7 max-w-md text-[15px] leading-7 text-[#64748B]">
//                 A simple workspace for managing customer requests,
//                 collaborating on tickets, and keeping support operations
//                 organized.
//               </p>

//               {/* Decorative visual */}
//               <div className="relative mt-12 h-32 w-full max-w-md">
//                 {/* Main line */}
//                 <div className="absolute left-0 top-8 h-px w-full bg-gradient-to-r from-[#0F766E]/30 via-[#6366F1]/20 to-transparent" />

//                 {/* Floating card 1 */}
//                 <div className="absolute left-5 top-0 w-44 rotate-[-3deg] rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
//                   <div className="mb-3 flex items-center justify-between">
//                     <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />

//                     <span className="text-[9px] text-slate-400">
//                       TICKET
//                     </span>
//                   </div>

//                   <div className="h-2 w-24 rounded-full bg-slate-200" />
//                   <div className="mt-2 h-2 w-16 rounded-full bg-slate-100" />
//                 </div>

//                 {/* Floating card 2 */}
//                 <div className="absolute left-36 top-10 w-44 rotate-[3deg] rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)] backdrop-blur-md">
//                   <div className="flex items-center gap-2">
//                     <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
//                       <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
//                     </span>

//                     <div>
//                       <div className="h-2 w-16 rounded-full bg-slate-200" />
//                       <div className="mt-1.5 h-1.5 w-10 rounded-full bg-slate-100" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* =========================
//               AUTH SECTION
//           ========================== */}

//           <section className="w-full">
//             {/* Mobile logo */}
//             <div className="mb-8 flex justify-center lg:hidden">
//               <img
//                 src={logo}
//                 alt="Company Logo"
//                 className="h-14 w-auto object-contain"
//               />
//             </div>

//             {/* Auth Card */}
//             <div
//               className="
//                 relative
//                 rounded-[26px]
//                 border
//                 border-slate-200/80
//                 bg-white
//                 px-6
//                 py-7
//                 shadow-[0_25px_70px_rgba(15,23,42,0.10)]
//                 sm:px-9
//                 sm:py-9
//               "
//             >
//               {/* =========================
//                   CARD ACCENTS
//               ========================== */}

//               {/* Top accent */}
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden rounded-t-[26px]">
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F766E]/60 to-transparent" />
//               </div>

//               {/* Bottom accent */}
//               <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-b-[26px]">
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F766E]/35 to-transparent" />
//               </div>

//               {/* Left accent */}
//               <div className="pointer-events-none absolute bottom-8 left-0 top-8 w-[2px] overflow-hidden rounded-l-full">
//                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F766E]/35 to-transparent" />
//               </div>

//               {/* Right accent */}
//               <div className="pointer-events-none absolute bottom-8 right-0 top-8 w-[2px] overflow-hidden rounded-r-full">
//                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F766E]/35 to-transparent" />
//               </div>

//               {/* Top glow */}
//               <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-64 -translate-x-1/2 rounded-full bg-[#0F766E]/[0.06] blur-2xl" />

//               {/* Bottom glow */}
//               <div className="pointer-events-none absolute bottom-0 left-1/2 h-16 w-64 -translate-x-1/2 rounded-full bg-[#0F766E]/[0.04] blur-2xl" />

//               {children}
//             </div>

//             {/* Footer */}
//             <div className="mt-6 flex items-center justify-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />

//               <p className="text-[11px] font-medium text-slate-400">
//                 Secure support workspace
//               </p>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

export default AuthLayout;