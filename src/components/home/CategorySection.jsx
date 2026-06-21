"use client";

import NextLink from "next/link";

export default function CategorySection() {
  // আপনার ফিক্সড ৪টি ক্যাটাগরি এবং তাদের জন্য ডামি আইকন/ইমেজ
  const categories = [
    { name: "Painting", count: "5 Items", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { name: "Sculpture", count: "3 Items", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { name: "Digital Art", count: "5 Items", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "Photography", count: "5 Items", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  ];

  return (
    <section className="bg-[#2f3f48] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Browse by <span className="text-[#df6742]">Category</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Explore our curated collections across different art forms</p>
        </div>

        {/* Responsive Grid: Mobile-1, Tablet-2, Desktop-4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <NextLink
              key={cat.name}
              // এখানে URL Query Parameter (?category=...) পাস করা হচ্ছে
              href={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="group bg-[#1e262b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between items-start transition-all duration-300 hover:-translate-y-1 hover:border-[#df6742]/40 hover:shadow-xl cursor-pointer"
            >
              <div className="space-y-4 w-full">
                {/* Visual Category Badge/Icon Indicator */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-lg ${cat.bg}`}>
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#df6742] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{cat.count}</p>
                </div>
              </div>

              {/* Action Button Indicator */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#df6742] group-hover:underline">
                Explore Collection
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
}