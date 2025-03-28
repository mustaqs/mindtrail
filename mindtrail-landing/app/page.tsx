import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Demo from '../components/Demo';
import EarlyAccess from '../components/EarlyAccess';
import Reviews from '../components/Reviews';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Hero />
        <Features />
        <Demo />
        <EarlyAccess />
        <Reviews />
        {/* Additional sections will be added here */}
      </main>
    </>
  );
}
