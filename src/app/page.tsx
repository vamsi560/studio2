'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Loader2, Bot, FileText, Lightbulb, Image as ImageIcon, Sparkles, FileQuestion, BookOpenCheck, FileCheck2 } from 'lucide-react';

const features = [
  { icon: FileText, label: 'Local Content', style: { top: '10%', left: '5%' }, x: -10, y: 15, duration: 8, delay: 0 },
  { icon: BookOpenCheck, label: 'Lesson Planner', style: { top: '15%', right: '5%' }, x: 10, y: -15, duration: 9, delay: 2 },
  { icon: Bot, label: 'Worksheets', style: { bottom: '20%', left: '2%' }, x: -15, y: -10, duration: 10, delay: 4 },
  { icon: Lightbulb, label: 'Knowledge Base', style: { bottom: '10%', right: '8%' }, x: 15, y: 10, duration: 7, delay: 1 },
  { icon: ImageIcon, label: 'Visual Aids', style: { top: '40%', left: '12%' }, x: -20, y: 0, duration: 8.5, delay: 3 },
  { icon: Sparkles, label: 'Story Weaver', style: { top: '50%', right: '12%' }, x: 20, y: 0, duration: 11, delay: 5 },
  { icon: FileCheck2, label: 'Paper Grader', style: { top: '5%', right: '25%' }, x: 0, y: -15, duration: 9.5, delay: 6 },
  { icon: FileQuestion, label: 'Assessments', style: { bottom: '5%', left: '25%' }, x: 0, y: 15, duration: 7.5, delay: 2.5 },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      {/* Floating feature cards */}
      {features.map((feature) => (
        <motion.div
          key={feature.label}
          className="absolute z-10 hidden items-center gap-2 rounded-lg border border-primary/10 bg-card/60 p-2 text-sm text-card-foreground shadow-lg backdrop-blur-sm md:flex"
          style={feature.style}
          initial={{ opacity: 0 }}
          animate={{
            x: [0, feature.x, 0],
            y: [0, feature.y, 0],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: feature.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: feature.delay,
          }}
        >
          <feature.icon className="h-5 w-5 text-primary" />
          <span className="font-body font-medium">{feature.label}</span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="z-20"
      >
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <Logo />
            </motion.div>
            <CardTitle className="text-3xl font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Sahayak AI
            </CardTitle>
            <CardDescription className="font-body">
              Your AI Teaching Companion. Please login to continue.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="teacher@example.com" required defaultValue="teacher@example.com" />
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required placeholder="********" defaultValue="password" />
              </motion.div>
            </CardContent>
            <CardFooter>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-full"
                whileHover={{ scale: 1.05 }}
              >
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
