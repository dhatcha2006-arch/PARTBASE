import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryChips from './components/CategoryChips';
import JobSearchSection from './components/JobSearchSection';
import HowItWorks from './components/HowItWorks';
import ShopCTA from './components/ShopCTA';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ApplyModal from './components/ApplyModal';
import PostJobModal from './components/PostJobModal';
import { HIRING_JOBS } from './data/mockData';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [applyingJob, setApplyingJob] = useState(null);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);

  const scrollToJobs = () => {
    const el = document.getElementById('jobs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectJobFromPanel = (panelJob) => {
    // Map panel job to a full hiring job or create a matching object
    const found = HIRING_JOBS.find(j => j.role.toLowerCase().includes(panelJob.role.toLowerCase())) || {
      role: panelJob.role,
      shop: panelJob.shop,
      rate: panelJob.wage,
      distance: panelJob.distance,
      timing: 'Morning or Evening shifts available',
      days: 'Flexible schedule',
      category: 'retail',
      badge: panelJob.status
    };
    setApplyingJob(found);
  };

  return (
    <div className="min-h-screen bg-midnight text-white flex flex-col font-sans selection:bg-lime selection:text-midnight">
      {/* Top Navbar */}
      <Navbar 
        onFindJobsClick={scrollToJobs} 
        onPostJobClick={() => setPostJobModalOpen(true)} 
      />

      {/* Hero Section with 3D Tilted Panels and Radial Beam Lights */}
      <main className="flex-1">
        <Hero
          onFindJobsClick={scrollToJobs}
          onPostJobClick={() => setPostJobModalOpen(true)}
          onSelectJob={handleSelectJobFromPanel}
        />

        {/* Category Chips Bar */}
        <CategoryChips
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Search, Interactive Filters, List/Map View and Job Cards Grid */}
        <JobSearchSection
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onApplyJob={(job) => setApplyingJob(job)}
        />

        {/* How It Works - 3 Step Process */}
        <HowItWorks />

        {/* Shop Owners CTA - "Post a job in 2 minutes" */}
        <ShopCTA onPostJobClick={() => setPostJobModalOpen(true)} />

        {/* Testimonials */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* 1-Tap Application Modal */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
        />
      )}

      {/* Post a Job Modal */}
      {postJobModalOpen && (
        <PostJobModal
          onClose={() => setPostJobModalOpen(false)}
        />
      )}
    </div>
  );
}
