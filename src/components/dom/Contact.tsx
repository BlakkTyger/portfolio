'use client'

import SectionWrapper from './SectionWrapper';
import SocialLinks from './SocialLinks';
import ContactForm from './ContactForm';
import { personalInfo } from '@/data/content';

export default function Contact() {
  return (
    <SectionWrapper id="contact" animation="fade-up">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <span className="animate-item text-[var(--terminal-cyan)] text-sm font-mono uppercase tracking-widest mb-4 block">
          Get in Touch
        </span>
        
        <h2 className="animate-item font-heading text-5xl md:text-6xl text-[var(--photon-white)] mb-6">
          Contact
        </h2>
        
        <p className="animate-item text-xl text-[var(--tungsten-gray)] mb-12 max-w-2xl">
          Have a question or want to collaborate? Feel free to reach out through any of these channels.
        </p>
        
        {/* Social Links */}
        <div className="animate-item mb-16">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-6">
            Connect
          </h3>
          <SocialLinks />
        </div>
        
        {/* Contact Form (optional) */}
        <div className="animate-item">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--tungsten-gray)] mb-6">
            Or Send a Message
          </h3>
          <ContactForm />
        </div>
        
        {/* Location */}
        <div className="animate-item mt-16 pt-8 border-t border-[var(--tungsten-gray)]/20">
          <p className="text-[var(--tungsten-gray)]">
            Based in {personalInfo.location}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}