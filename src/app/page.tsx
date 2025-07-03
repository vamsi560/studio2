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
  { icon: FileText, label: 'Local Content', style: { top: '15%', left: '10%' }, y: [0, -20, 0], duration: 5 },
  { icon: BookOpenCheck, label: 'Lesson Planner', style: { top: '25%', right: '8%' }, y: [0, 25, 0], duration: 6 },
  { icon: Bot, label: 'Worksheets', style: { bottom: '30%', left: '5%' }, y: [0, -15, 0], duration: 7 },
  { icon: Lightbulb, label: 'Knowledge Base', style: { bottom: '15%', right: '12%' }, y: [0, 20, 0], duration: 4 },
  { icon: ImageIcon, label: 'Visual Aids', style: { top: '50%', left: '20%' }, x: [0, -20, 0], duration: 5 },
  { icon: Sparkles, label: 'Story Weaver', style: { top: '60%', right: '22%' }, x: [0, 20, 0], duration: 8 },
  { icon: FileCheck2, label: 'Paper Grader', style: { top: '5%', right: '30%' }, y: [0, -15, 0], duration: 6 },
  { icon: FileQuestion, label: 'Assessments', style: { bottom: '10%', left: '35%' }, y: [0, 15, 0], duration: 5.5 },
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted p-4">
      {/* Floating feature cards */}
      {features.map(({ icon: Icon, label, style, x, y, duration }) => (
        <motion.div
          key={label}
          className="absolute z-10 hidden items-center gap-2 rounded-lg border border-primary/10 bg-card/60 p-2 text-sm text-card-foreground shadow-lg backdrop-blur-sm md:flex"
          style={style}
          animate={{ x, y }}
          transition={{
            duration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-body font-medium">{label}</span>
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
