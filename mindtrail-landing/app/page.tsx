import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Demo from '../components/Demo';
import EarlyAccess from '../components/EarlyAccess';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Hero />
        <Features />
        <Demo />
        <EarlyAccess />
        {/* Additional sections will be added here */}
      </main>
    </>
  );
}
