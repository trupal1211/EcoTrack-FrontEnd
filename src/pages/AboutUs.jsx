// import { useEffect, useState } from "react";

// export default function AboutUs() {
//   const [counts, setCounts] = useState({
//     reportsResolved: 0,
//     activeNGOs: 0,
//     usersJoined: 0,
//   });

//   useEffect(() => {
//     let resolved = 0, ngos = 0, users = 0;

//     const animate = () => {
//       const interval = setInterval(() => {
//         if (resolved < 1240) resolved += 20;
//         if (ngos < 85) ngos += 1;
//         if (users < 4300) users += 30;

//         setCounts({
//           reportsResolved: Math.min(resolved, 1240),
//           activeNGOs: Math.min(ngos, 85),
//           usersJoined: Math.min(users, 4300),
//         });

//         if (resolved >= 1240 && ngos >= 85 && users >= 4300) {
//           clearInterval(interval);
//         }
//       }, 40);
//     };

//     animate();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800 space-y-20">

//       {/* Hero / Intro */}
//       <section className="text-center space-y-4">
//         <h1 className="text-4xl sm:text-5xl font-bold text-green-700">About Us</h1>
//         <p className="text-lg max-w-3xl mx-auto text-gray-600">
//           We're committed to connecting communities with NGOs to solve real-world problems.
//           Our platform bridges the gap between the people and those who take action.
//         </p>
//       </section>

//       {/* Mission Section */}
//       <section className="grid md:grid-cols-2 gap-10 items-center">
//         <img
//           src="https://source.unsplash.com/600x400/?community,help"
//           alt="Our Mission"
//           className="rounded-lg shadow-md"
//         />
//         <div>
//           <h2 className="text-2xl font-semibold mb-2 text-green-600">Our Mission</h2>
//           <p className="text-gray-600 leading-relaxed">
//             We believe in the power of collective action. Our mission is to create a transparent,
//             user-friendly, and scalable platform where people can report issues in their
//             neighborhoods and NGOs can take the lead in resolving them.
//           </p>
//         </div>
//       </section>

//       {/* What We Do */}
//       <section>
//         <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">What We Do</h2>
//         <div className="grid sm:grid-cols-3 gap-6">
//           {[
//             { icon: "📣", title: "Report Problems", text: "Citizens report local issues with photos and location." },
//             { icon: "🤝", title: "NGO Involvement", text: "NGOs take up cases and resolve them effectively." },
//             { icon: "📊", title: "Transparency", text: "Track resolution, progress, and impact via dashboard." },
//           ].map(({ icon, title, text }) => (
//             <div key={title} className="bg-white p-6 rounded-lg shadow-md text-center">
//               <div className="text-green-600 text-3xl mb-2">{icon}</div>
//               <h3 className="text-lg font-semibold mb-1">{title}</h3>
//               <p className="text-sm text-gray-600">{text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Impact Numbers */}
//       <section>
//         <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Our Impact</h2>
//         <div className="grid sm:grid-cols-3 gap-6 text-center">
//           <div className="bg-green-50 py-8 rounded shadow">
//             <p className="text-4xl font-bold text-green-700">{counts.reportsResolved}+</p>
//             <p className="text-gray-600">Reports Resolved</p>
//           </div>
//           <div className="bg-blue-50 py-8 rounded shadow">
//             <p className="text-4xl font-bold text-blue-700">{counts.activeNGOs}+</p>
//             <p className="text-gray-600">Active NGOs</p>
//           </div>
//           <div className="bg-yellow-50 py-8 rounded shadow">
//             <p className="text-4xl font-bold text-yellow-700">{counts.usersJoined}+</p>
//             <p className="text-gray-600">Users Joined</p>
//           </div>
//         </div>
//       </section>

//       {/* FAQs */}
//       <section>
//         <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Frequently Asked Questions</h2>
//         <div className="space-y-4 max-w-3xl mx-auto">
//           {[
//             {
//               q: "How do I report a problem?",
//               a: "Simply sign in, go to the report section, upload a photo, and describe the issue. Your report will be visible to NGOs.",
//             },
//             {
//               q: "Can anyone become an NGO partner?",
//               a: "Yes, but your organization must apply and be verified through our request system for authenticity.",
//             },
//             {
//               q: "Is this platform free to use?",
//               a: "Absolutely. Both citizens and NGOs can use this platform without any charge.",
//             },
//           ].map(({ q, a }, i) => (
//             <div key={i} className="bg-gray-50 p-4 rounded shadow-sm">
//               <h3 className="font-semibold text-green-700 mb-1">Q: {q}</h3>
//               <p className="text-gray-600">A: {a}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="text-center space-y-4 bg-green-50 py-12 rounded-lg shadow-inner">
//         <h2 className="text-2xl font-semibold text-green-700">Want to get involved?</h2>
//         <p className="text-gray-700">
//           Whether you're an individual, NGO, or government body — we welcome your participation.
//         </p>
//         <a
//           href="/contact"
//           className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//         >
//           Contact Us
//         </a>
//       </section>
//     </div>
//   );
// }




import { useEffect, useState } from "react";

export default function AboutUs() {
  const [counts, setCounts] = useState({
    reportsResolved: 0,
    activeNGOs: 0,
    usersJoined: 0,
  });

  useEffect(() => {
    let resolved = 0, ngos = 0, users = 0;

    const animate = () => {
      const interval = setInterval(() => {
        if (resolved < 200) resolved += 5;
        if (ngos < 24) ngos += 1;
        if (users < 160) users += 5;

        setCounts({
          reportsResolved: Math.min(resolved, 1240),
          activeNGOs: Math.min(ngos, 85),
          usersJoined: Math.min(users, 4300),
        });

        if (resolved >= 1240 && ngos >= 85 && users >= 4300) {
          clearInterval(interval);
        }
      }, 40);
    };

    animate();
  }, []);

  return (
    <div className="h-[calc(100vh-68px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800 space-y-20">

        {/* Hero / Intro */}
        <section className="text-center space-y-4">
  <h1 className="text-4xl sm:text-5xl font-bold text-green-700">EcoTrack</h1>
  <p className="text-xl font-semibold text-green-600 mt-2 italic">"From Report to Resolved"</p>
  <p className="text-lg max-w-3xl mx-auto text-gray-600">
    We're committed to connecting communities with NGOs to solve real-world problems.
    Our platform bridges the gap between the people and those who take action.
  </p>
</section>


        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://www.istockphoto.com/photo/children-holding-a-planet-outdoors-gm1435661954-476936522?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fngo&utm_medium=affiliate&utm_source=unsplash&utm_term=ngo%3A%3A%3A"
            alt="Our Mission"
            className="rounded-lg shadow-md"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-green-600">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe in the power of collective action. Our mission is to create a transparent,
              user-friendly, and scalable platform where people can report issues in their
              neighborhoods and NGOs can take the lead in resolving them.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">What We Do</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 text-3xl mb-2">📣</div>
              <h3 className="text-lg font-semibold mb-1">Report Problems</h3>
              <p className="text-sm text-gray-600">
                Citizens report local issues with photos and location to bring attention to pressing concerns.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 text-3xl mb-2">🤝</div>
              <h3 className="text-lg font-semibold mb-1">NGO Involvement</h3>
              <p className="text-sm text-gray-600">
                Verified NGOs respond to reported problems and take actionable steps to resolve them.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 text-3xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-1">Transparency</h3>
              <p className="text-sm text-gray-600">
                Every issue and its resolution status are publicly visible, fostering trust and real-time accountability.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section>
          <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Our Impact</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="bg-green-50 py-8 rounded shadow">
              <p className="text-4xl font-bold text-green-700">{counts.reportsResolved}+</p>
              <p className="text-gray-600">Reports Resolved</p>
            </div>
            <div className="bg-blue-50 py-8 rounded shadow">
              <p className="text-4xl font-bold text-blue-700">{counts.activeNGOs}+</p>
              <p className="text-gray-600">Active NGOs</p>
            </div>
            <div className="bg-yellow-50 py-8 rounded shadow">
              <p className="text-4xl font-bold text-yellow-700">{counts.usersJoined}+</p>
              <p className="text-gray-600">Users Joined</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: "How do I report a problem?",
                a: "Sign in and submit a report by uploading a photo, selecting a location, and describing the issue.",
              },
              {
                q: "Can anyone become an NGO partner?",
                a: "Yes. Any verified NGO can request to join the platform and start resolving community problems.",
              },
              {
                q: "Is this platform free to use?",
                a: "Yes. Both users and NGOs can use the platform at no cost.",
              },
              {
                q: "How do I track my report?",
                a: "All reports are visible on your dashboard along with their real-time status updates.",
              },
              {
                q: "Can I see which NGO resolved my issue?",
                a: "Yes. Each resolved report displays the responsible NGO with details for transparency.",
              },
            ].map(({ q, a }, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded shadow-sm">
                <h3 className="font-semibold text-green-700 mb-1">Q: {q}</h3>
                <p className="text-gray-600">A: {a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center w-full space-y-4 bg-green-50 py-12 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-green-700">Want to get involved?</h2>
          <p className="text-gray-700">
            Whether you're an individual, NGO, or government body — we welcome your participation.
          </p>
          <a
            href="/contact"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  );
}
