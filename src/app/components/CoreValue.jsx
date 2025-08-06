import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedHeader from './AnimatedHeader';
import Integrity from "../../../public/icons/values/integrity.png";
import Inclusivity from "../../../public/icons/values/inclusive.png";
import Empowerment from "../../../public/icons/values/empowerment.png";
import Customer from "../../../public/icons/values/Customer.png";
import Compassion from "../../../public/icons/values/Compassion.png";
import Innovation from "../../../public/icons/values/innovaation.png";
import Sustainability from "../../../public/icons/values/suatain.png";
import Accountability from "../../../public/icons/values/accountab.png";
import Image from 'next/image';

// Core values data
const coreValues = [
  { name: 'Integrity', desc: 'Upholding the highest standards of honesty and transparency in all our actions.', image: Integrity },
  { name: 'Inclusivity', desc: 'Promoting diversity and ensuring equal opportunities for all.', image: Inclusivity },
  { name: 'Empowerment', desc: 'Enabling our clients and teams to achieve their goals and make informed decisions.', image: Empowerment },
  { name: 'Customer-Centricity', desc: 'Putting customers at the heart of everything we do to deliver exceptional value.', image: Customer },
  { name: 'Compassion', desc: 'Demonstrating care and understanding in our interactions and support.', image: Compassion },
  { name: 'Innovation', desc: 'Continuously exploring new ideas to improve services and drive industry progress.', image: Innovation },
  { name: 'Sustainability', desc: 'Committing to eco-friendly practices that benefit society and the environment.', image: Sustainability },
  { name: 'Accountability', desc: 'Taking responsibility for our actions and ensuring transparency in our processes.', image: Accountability },
];

const CoreValue = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="flex flex-col items-center gap-10  p-6 w-full overflow-hidden">
      <AnimatedHeader text="Our Core Values" />
      <motion.div
        className="flex flex-wrap items-center gap-4 justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {coreValues.map((value, index) => (
          <motion.div
            key={index}
            className="relative w-80 h-80 text-black rounded-lg overflow-hidden group bg-white shadow-lg p-6 flex flex-col items-center justify-center text-center gap-4"
            
          >
                        <img src={value.image.src} alt={value.name} className="w-20 h-20" />
            <motion.div
              className='text-2xl font-semibold'>
              {value.name}
            </motion.div>


              
            {/* </motion.div> */}
            <p className="text-base text-gray-600">{value.desc}</p>

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CoreValue;
