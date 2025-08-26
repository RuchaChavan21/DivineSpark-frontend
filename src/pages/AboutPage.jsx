// import React from 'react'
// import { motion } from 'framer-motion'
// import { Sparkles, Heart, Sun, Globe } from 'lucide-react'
// import { Button } from '../components/ui/Button'
// import { Link } from 'react-router-dom'

// // // Placeholder images (to be replaced later)
// // import aboutHero from '../assets/about-hero.jpg'
// // import suvirImg from '../assets/suvir-sabnis.jpg'
// // import wsChildren from '../assets/workshop-children.jpg'
// // import wsThailand from '../assets/workshop-thailand.jpg'
// // import wsPune from '../assets/workshop-pune.jpg'
// // import wsKarad from '../assets/workshop-karad.jpg'
// // import meditationBg from '../assets/meditation.jpg'

// const AboutPage = () => {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero / Intro Section */}
//       <section
//         className="relative bg-no-repeat bg-cover bg-center min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-6 md:px-12 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/70 before:to-[#EDE9FE]/80"
//         style={{ backgroundImage: `url(${aboutHero})` }}
//       >
//         <div className="relative z-10 max-w-3xl mx-auto text-center">
//           <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
//             <div className="inline-flex items-center justify-center p-2 rounded-xl mb-4" style={{ backgroundColor: '#EDE9FE' }}>
//               <Sparkles className="h-6 w-6" color="#6D28D9" />
//             </div>
//             <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
//               About DivineSpark
//             </h1>
//             <p className="text-lg text-gray-700" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
//               Feed the Soul with Energy Healing
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Founder Story — Suvir Sabnis */}
//       <section className="py-16 md:py-20 px-6 md:px-12">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.2 }}
//           className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center"
//         >
//           <div>
//             <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//               <img src={suvirImg} alt="Suvir Sabnis" className="w-full h-80 object-cover" />
//             </div>
//           </div>
//           <div>
//             <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
//               Meet Suvir Sabnis — Healer and Trainer
//             </h2>
//             <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
//               Starting his healing journey at 24, Suvir has helped thousands — including many critical ICU cases — often offering support free of cost. His work blends compassion with practical techniques to bring tangible improvements in health and happiness.
//             </p>
//             <div className="mt-6 rounded-2xl border border-violet-200 bg-[#EDE9FE] p-5">
//               <p className="text-gray-800" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
//                 “Our mission is to spread peace, love, happiness, and good health.”
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Philosophy of Healing */}
//       <section className="py-16 md:py-20 px-6 md:px-12" style={{ backgroundColor: '#F6F3FF' }}>
//         <div className="max-w-5xl mx-auto text-center">
//           <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
//             <div className="inline-flex items-center justify-center p-2 rounded-xl mb-4" style={{ backgroundColor: '#EDE9FE' }}>
//               <Heart className="h-6 w-6" color="#6D28D9" />
//             </div>
//             <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
//               The Art of Energy Healing
//             </h3>
//             <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
//               Feed The Soul healing is an ancient art and science of no-touch, no-drug therapy using life force to build
//               immunity and bring happiness.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Workshops & Community Impact */}
//       <section className="py-16 md:py-20 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 md:mb-14">
//             <h3 className="text-3xl md:text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>Workshops & Outreach</h3>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[{
//               img: wsChildren,
//               title: 'Workshops for Children (Anand Ashram, Pune)'
//             }, {
//               img: wsThailand,
//               title: 'Workshops in Thailand (2018–2019)'
//             }, {
//               img: wsPune,
//               title: 'Healing Sessions in Pune'
//             }, {
//               img: wsKarad,
//               title: 'Community Healing in Karad'
//             }].map((c) => (
//               <motion.div
//                 key={c.title}
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
//               >
//                 <div className="h-40 w-full bg-gray-100">
//                   <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="p-4">
//                   <p className="text-gray-800 text-sm" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>{c.title}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Meditation Section */}
//       <section
//         className="relative bg-no-repeat bg-cover bg-center min-h-[40vh] md:min-h-[50vh] flex items-center px-6 md:px-12 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/60 before:to-[#EDE9FE]/80"
//         style={{ backgroundImage: `url(${meditationBg})` }}
//       >
//         <div className="relative z-10 max-w-3xl mx-auto">
//           <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
//             <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
//               Weekly Meditation on Peace & Illumination
//             </h3>
//             <p className="text-gray-800 mb-6" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
//               Every Sunday we invite everyone to join us for open meditation sessions.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Vision / Purpose */}
//       <section className="py-16 md:py-20 px-6 md:px-12">
//         <div className="max-w-5xl mx-auto text-center">
//           <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
//             <div className="inline-flex items-center justify-center p-2 rounded-xl mb-4" style={{ backgroundColor: '#EDE9FE' }}>
//               <Sun className="h-6 w-6" color="#6D28D9" />
//             </div>
//             <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
//               Our Purpose
//             </h3>
//             <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
//               To spread happiness, health, peace, and love through spiritual healing. To bring people closer to inner harmony.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Closing Call-to-Action */}
//       <section className="py-14 md:py-16" style={{ backgroundColor: '#EDE9FE' }}>
//         <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
//           <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
//             <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
//               Join Us in Spreading Peace and Healing
//             </h3>
//             <div className="flex flex-col sm:flex-row gap-3 justify-center">
//               <Link to="/sessions">
//                 <Button size="lg" className="min-w-[180px] bg-violet-700 hover:bg-violet-800 text-white rounded-xl hover:shadow-md">Book a Session</Button>
//               </Link>
//               <Link to="/contact">
//                 <Button variant="outline" size="lg" className="min-w-[180px] rounded-xl">Contact Us</Button>
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default AboutPage


