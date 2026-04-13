export default function About() {
  const skills = [
    'JavaScript', 'React', 'Node.js', 'Express',
    'MongoDB', 'Tailwind CSS', 'REST APIs', 'Git',
  ];

return (
    <div className='min-h-screen'>

      {/* Hero */}
      <div className='relative bg-gradient-to-br from-indigo-500 to-blue-700 text-white py-24 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,white,transparent_60%)]' />
        <div className='relative max-w-3xl mx-auto'>
          <div className='w-24 h-24 rounded-full bg-white/20 border-4 border-white/50 mx-auto mb-6 flex items-center justify-center text-4xl font-bold'>
            A
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold mb-4'>Hey, I'm Ankit 👋</h1>
          <p className='text-lg sm:text-xl text-white/90 leading-relaxed'>
            A developer who loves turning ideas into clean, functional code —
            and writing about the journey along the way.
          </p>
        </div>
      </div>

      {/* About body */}
      <div className='max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16'>

        {/* Who am I */}
        <div className='flex flex-col sm:flex-row gap-8 items-start'>
          <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center text-white text-xl'>
            🙋
          </div>
          <div>
            <h2 className='text-2xl font-semibold mb-3'>Who am I?</h2>
            <p className='text-gray-500 leading-relaxed'>
              I'm Ankit Kumar — a passionate developer and writer based in India.
              I created <span className='text-indigo-500 font-medium'>Verso</span> as
              a space to document what I learn, share ideas, and connect
              with people who love exploring new perspectives and building things.
            </p>
          </div>
        </div>

        {/* What I write about */}
        <div className='flex flex-col sm:flex-row gap-8 items-start'>
          <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl'>
            ✍️
          </div>
          <div>
            <h2 className='text-2xl font-semibold mb-3'>What I write about</h2>
            <p className='text-gray-500 leading-relaxed'>
              I write about things that interest me — ideas, experiences, and topics
              I'm curious about. No fixed niche, just honest writing on whatever
              feels worth sharing. There's always something here for the curious mind.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className='flex flex-col sm:flex-row gap-8 items-start'>
          <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl'>
            🛠️
          </div>
          <div className='w-full'>
            <h2 className='text-2xl font-semibold mb-4'>My Tech Stack</h2>
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill) => (
                <span
                  key={skill}
                  className='px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-400 text-indigo-600 dark:text-indigo-400 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Community */}
        <div className='flex flex-col sm:flex-row gap-8 items-start'>
          <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl'>
            🤝
          </div>
          <div>
            <h2 className='text-2xl font-semibold mb-3'>Join the community</h2>
            <p className='text-gray-500 leading-relaxed'>
              This blog isn't just about me — it's about all of us growing together.
              Drop a comment, share your perspective, ask questions. Every conversation
              makes the community better.
            </p>
          </div>
        </div>

      </div>

      {/* CTA */}
      <div className='bg-gradient-to-r from-indigo-500 to-blue-700 text-white text-center py-14 px-6'>
        <h2 className='text-3xl font-bold mb-3'>Let's build something together</h2>
        <p className='text-white/80 mb-6'>Explore the latest posts and start learning today.</p>
        <a
          href='/search'
          className='inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'
        >
          Browse Articles →
        </a>
      </div>

    </div>
  );
}
