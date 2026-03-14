import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Activity, Heart, ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';

type StepType = 'intro' | 'check-in' | 'exercise' | 'breathing' | 'check-out' | 'completion';

interface Step {
  id: string;
  type: StepType;
  title?: string;
  content?: string[];
  duration?: number; // in seconds for auto-advancing, or 0 for manual
}

const steps: Step[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Welcome to Soma',
    content: ['A gentle journey to regulate your nervous system.', 'Find a quiet space and get comfortable.'],
  },
  {
    id: 'check-in',
    type: 'check-in',
    title: 'Check In',
    content: ['How activated does your nervous system feel right now?', '1 is completely calm, 10 is overwhelmed.'],
  },
  {
    id: 'grounding',
    type: 'exercise',
    title: 'Grounding',
    content: [
      'Let\'s start by orienting to the present moment.',
      'Feel the weight of your body supported by the surface beneath you.',
      'Notice the points of contact: your feet on the floor, your back against the chair.',
      'Allow gravity to hold you. You are safe here.'
    ],
  },
  {
    id: 'breathing',
    type: 'breathing',
    title: 'Coherent Breathing',
    content: ['Follow the expanding and contracting circle.', 'Breathe in... and breathe out...'],
  },
  {
    id: 'somatic-tracking',
    type: 'exercise',
    title: 'Somatic Tracking',
    content: [
      'Bring your attention to your physical body.',
      'Scan from the top of your head down to your toes.',
      'Notice any areas of tension, warmth, or coolness.',
      'Just observe these sensations without trying to change them.',
      'Breathe into the spaces that feel tight.'
    ],
  },
  {
    id: 'micro-movements',
    type: 'exercise',
    title: 'Gentle Release',
    content: [
      'Slowly invite micro-movements into your body.',
      'Gently wiggle your fingers and toes.',
      'Let your jaw soften and drop slightly.',
      'Roll your shoulders back, releasing any carried weight.',
      'Allow your body to move intuitively, however it wants to right now.'
    ],
  },
  {
    id: 'check-out',
    type: 'check-out',
    title: 'Check Out',
    content: ['How does your nervous system feel now?', 'Notice any shifts, however small.'],
  },
  {
    id: 'completion',
    type: 'completion',
    title: 'Integration',
    content: [
      'You have completed this cycle of regulation.',
      'Take this sense of groundedness with you.',
      'Remember, calmness is always accessible within you.'
    ],
  }
];

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [initialStress, setInitialStress] = useState(5);
  const [finalStress, setFinalStress] = useState(5);

  const currentStep = steps[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'intro':
        return <IntroStep step={currentStep} onNext={nextStep} />;
      case 'check-in':
        return <CheckInStep step={currentStep} value={initialStress} setValue={setInitialStress} onNext={nextStep} />;
      case 'exercise':
        return <ExerciseStep step={currentStep} onNext={nextStep} />;
      case 'breathing':
        return <BreathingStep step={currentStep} onNext={nextStep} />;
      case 'check-out':
        return <CheckInStep step={currentStep} value={finalStress} setValue={setFinalStress} onNext={nextStep} isCheckOut />;
      case 'completion':
        return <CompletionStep step={currentStep} initialStress={initialStress} finalStress={finalStress} onRestart={() => setCurrentStepIndex(0)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="atmosphere"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl flex flex-col items-center justify-center text-center"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function IntroStep({ step, onNext }: { step: Step, onNext: () => void }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="mb-12 relative"
      >
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <Sparkles className="w-16 h-16 text-indigo-300 relative z-10" strokeWidth={1} />
      </motion.div>
      
      <h1 className="text-5xl md:text-6xl serif text-white mb-6 tracking-wide">{step.title}</h1>
      
      <div className="space-y-4 mb-16 text-indigo-100/80 text-lg md:text-xl font-light">
        {step.content?.map((text, i) => (
          <motion.p 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.5, duration: 1 }}
          >
            {text}
          </motion.p>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white"
      >
        <span className="tracking-widest uppercase text-sm font-medium">Begin</span>
        <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}

function CheckInStep({ step, value, setValue, onNext, isCheckOut = false }: { step: Step, value: number, setValue: (v: number) => void, onNext: () => void, isCheckOut?: boolean }) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-8">
        {isCheckOut ? <Heart className="w-12 h-12 text-indigo-300/70" strokeWidth={1} /> : <Activity className="w-12 h-12 text-indigo-300/70" strokeWidth={1} />}
      </div>
      
      <h2 className="text-4xl serif text-white mb-6">{step.title}</h2>
      
      <div className="space-y-2 mb-16 text-indigo-100/80 text-lg font-light">
        {step.content?.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>

      <div className="w-full max-w-md glass-panel p-8 mb-12">
        <div className="flex justify-between text-sm text-indigo-200/60 mb-6 uppercase tracking-widest">
          <span>Calm</span>
          <span>Overwhelmed</span>
        </div>
        
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={value} 
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-full mb-8"
        />
        
        <div className="text-center">
          <span className="text-5xl serif text-white">{value}</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white"
      >
        <span className="tracking-widest uppercase text-sm font-medium">Continue</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function ExerciseStep({ step, onNext }: { step: Step, onNext: () => void }) {
  const [currentLine, setCurrentLine] = useState(0);
  const lines = step.content || [];

  useEffect(() => {
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 5000); // Show each line for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentLine, lines.length]);

  return (
    <div className="flex flex-col items-center w-full min-h-[60vh] justify-center relative">
      <h2 className="text-2xl uppercase tracking-[0.2em] text-indigo-300/50 mb-16 absolute top-0">{step.title}</h2>
      
      <div className="h-40 flex items-center justify-center w-full px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentLine}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 1.5 }}
            className="text-2xl md:text-4xl serif text-white leading-relaxed max-w-xl"
          >
            {lines[currentLine]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div 
        className="absolute bottom-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentLine === lines.length - 1 ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <button
          onClick={onNext}
          disabled={currentLine !== lines.length - 1}
          className={`group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white ${currentLine !== lines.length - 1 ? 'pointer-events-none' : ''}`}
        >
          <span className="tracking-widest uppercase text-sm font-medium">Next</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}

function BreathingStep({ step, onNext }: { step: Step, onNext: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);
  const maxCycles = 4;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (cycles >= maxCycles) return;

    if (phase === 'inhale') {
      timer = setTimeout(() => setPhase('hold'), 4000);
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('exhale'), 2000);
    } else if (phase === 'exhale') {
      timer = setTimeout(() => {
        setPhase('inhale');
        setCycles(c => c + 1);
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [phase, cycles]);

  return (
    <div className="flex flex-col items-center w-full min-h-[60vh] justify-center relative">
      <h2 className="text-2xl uppercase tracking-[0.2em] text-indigo-300/50 mb-16 absolute top-0">{step.title}</h2>
      
      <div className="relative flex items-center justify-center w-64 h-64 mb-16">
        {/* Breathing Circle */}
        <motion.div
          className="absolute rounded-full bg-indigo-500/20 border border-indigo-400/30"
          animate={{
            scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 0.8,
            opacity: phase === 'inhale' ? 0.8 : phase === 'hold' ? 0.6 : 0.3
          }}
          transition={{
            duration: phase === 'inhale' ? 4 : phase === 'hold' ? 2 : 6,
            ease: "easeInOut"
          }}
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Core */}
        <div className="w-16 h-16 rounded-full bg-indigo-400/50 blur-md absolute"></div>
        
        <div className="absolute text-white/80 uppercase tracking-widest text-sm font-medium">
          {cycles >= maxCycles ? 'Done' : phase}
        </div>
      </div>

      <motion.div 
        className="absolute bottom-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: cycles >= maxCycles ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <button
          onClick={onNext}
          disabled={cycles < maxCycles}
          className={`group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white ${cycles < maxCycles ? 'pointer-events-none' : ''}`}
        >
          <span className="tracking-widest uppercase text-sm font-medium">Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}

function CompletionStep({ step, initialStress, finalStress, onRestart }: { step: Step, initialStress: number, finalStress: number, onRestart: () => void }) {
  const stressReduction = initialStress - finalStress;
  
  return (
    <div className="flex flex-col items-center w-full">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="mb-12"
      >
        <CheckCircle2 className="w-16 h-16 text-emerald-400/70" strokeWidth={1} />
      </motion.div>
      
      <h2 className="text-4xl md:text-5xl serif text-white mb-6">{step.title}</h2>
      
      <div className="space-y-4 mb-12 text-indigo-100/80 text-lg font-light">
        {step.content?.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>

      <div className="glass-panel p-8 mb-16 w-full max-w-sm">
        <h3 className="text-sm uppercase tracking-widest text-indigo-300/60 mb-6">Your Journey</h3>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-3xl serif text-white mb-1">{initialStress}</div>
            <div className="text-xs uppercase tracking-wider text-indigo-200/50">Before</div>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400/30" />
          <div className="text-center">
            <div className="text-3xl serif text-emerald-300 mb-1">{finalStress}</div>
            <div className="text-xs uppercase tracking-wider text-indigo-200/50">After</div>
          </div>
        </div>
        {stressReduction > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10 text-sm text-emerald-200/80">
            Your nervous system activation decreased by {stressReduction} {stressReduction === 1 ? 'point' : 'points'}.
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="text-sm uppercase tracking-widest text-indigo-300/60 hover:text-white transition-colors"
      >
        Begin Again
      </button>
    </div>
  );
}
