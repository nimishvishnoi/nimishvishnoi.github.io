import React from 'react';

const Hero = () => {
  return (
    <section className="bg-cover bg-center h-screen text-white" style={{ backgroundImage: `url('/path-to-your-image')` }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Nimish Vishnoi</h1>
          <p className="mt-4 text-2xl">Software Engineer | React | TypeScript | .NET</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
