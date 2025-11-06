import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebase';
import { getNextReportNumber, formatReportId } from '@/lib/reportUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Shield, Phone, UserX, User, Users, AlertTriangle, BookOpen, Home, Heart, Mic } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = [
  { value: 'bullying', label: 'Bullying / Harassment', icon: Users },
  { value: 'abuse', label: 'Physical/Emotional Abuse', icon: AlertTriangle },
  { value: 'academic', label: 'Academic Pressure', icon: BookOpen },
  { value: 'family', label: 'Family Issues', icon: Home },
  { value: 'safety', label: 'Safety Concerns', icon: Shield },
  { value: 'other', label: 'Other', icon: Heart },
];

const intensityLevels = [
  { value: 'low', label: 'Low', description: 'Minor concern', color: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300' },
  { value: 'medium', label: 'Medium', description: 'Moderate concern', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300' },
  { value: 'high', label: 'High', description: 'Serious concern', color: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300' },
  { value: 'extreme', label: 'Extreme', description: 'Critical/urgent', color: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300' },
];

const formSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  intensity: z.string().min(1, 'Please select an intensity level'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  age: z.string().optional(),
  location: z.string().optional(),
  name: z.string().optional(),
  contact: z.string().optional(),
  isAnonymous: z.boolean().default(true),
});

const Report = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const isRecordingRef = useRef(false);
  const inputModeRef = useRef<'text' | 'voice'>('text');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      intensity: '',
      description: '',
      age: '',
      location: '',
      name: '',
      contact: '',
      isAnonymous: true,
    },
  });

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionInstance.onresult = (event: any) => {
        let fullTranscript = '';
        
        // Get all results (both final and interim)
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        
        console.log('Transcript:', fullTranscript);
        setTranscript(fullTranscript);
        form.setValue('description', fullTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Don't show error for aborted (user stopped)
        if (event.error === 'aborted') {
          return;
        }
        
        setIsRecording(false);
        isRecordingRef.current = false;
        
        let errorMessage = 'Recording failed. ';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your device.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = `Error: ${event.error}. Please try again.`;
        }
        toast.error(errorMessage, { duration: 5000 });
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended, should restart?', isRecordingRef.current);
        
        // Auto-restart if still in voice mode
        if (isRecordingRef.current && inputModeRef.current === 'voice') {
          console.log('Auto-restarting speech recognition...');
          setTimeout(() => {
            try {
              recognitionInstance.start();
            } catch (error) {
              console.log('Failed to restart recognition:', error);
            }
          }, 100);
        } else {
          setIsRecording(false);
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.log('Speech recognition not supported in this browser');
    }
  }, [form]);

  const startRecording = async () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      // Clear transcript and start fresh
      setTranscript('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      recognition.start();
      setIsRecording(true);
      isRecordingRef.current = true;
      toast.success('🎤 Recording... Speak now!');
    } catch (error: any) {
      console.error('Microphone permission error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone access in your browser settings.', { duration: 5000 });
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone and try again.', { duration: 5000 });
      } else {
        toast.error('Failed to access microphone. Please try again.', { duration: 5000 });
      }
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      isRecordingRef.current = false; // Set ref FIRST
      setIsRecording(false);
      recognition.stop();
    }
  };

  // Auto-start recording when voice mode is selected
  useEffect(() => {
    inputModeRef.current = inputMode;
    
    if (inputMode === 'voice' && !isRecording && recognition) {
      startRecording();
    } else if (inputMode === 'text' && isRecording) {
      stopRecording();
    }
  }, [inputMode]);
  
  // Sync recording state with ref
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
    
    try {
      console.log('Starting report submission...', { category: values.category, isAnonymous: values.isAnonymous });
      
      const reportNumber = await getNextReportNumber();
      const reportId = formatReportId(reportNumber);
      
      console.log('Generated report ID:', reportId);
      
      const reportsRef = ref(database, 'reports');
      const reportData = {
        reportId,
        reportNumber,
        ...values,
        timestamp: serverTimestamp(),
        status: 'pending',
      };
      
      console.log('Submitting to Firebase...', reportData);
      await push(reportsRef, reportData);

      console.log('Report submitted successfully!');
      toast.success(`Report submitted successfully! Your report ID is: ${reportId}`, {
        duration: 5000,
      });
      
      // Smooth reset
      form.reset();
      setIsAnonymous(true);
      setInputMode('text');
      inputModeRef.current = 'text';
      setTranscript('');
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('❌ Error submitting report:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      
      let errorMessage = 'Failed to submit report. ';
      if (error?.message?.includes('Firebase')) {
        errorMessage += 'Please check Firebase configuration. See FIREBASE_SETUP.md for help.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300">
              Submit a Confidential Report
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-300">
              Your safety is our priority. All reports are handled with care and confidentiality.
            </p>
          </div>

          {/* Anonymous Toggle Card */}
          <Card className="border-primary/20 shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="transition-all duration-300">
                    {isAnonymous ? <UserX className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg transition-all duration-300">
                      {isAnonymous ? 'Anonymous Report' : 'Named Report'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You can stay completely private if you want - it's up to you!
                    </p>
                  </div>
                </div>
                <Switch
                  checked={!isAnonymous}
                  onCheckedChange={(checked) => {
                    setIsAnonymous(!checked);
                    form.setValue('isAnonymous', !checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-4 animate-fade-in">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        What do you want to tell us about? <span className="text-destructive">*</span>
                      </FormLabel>
                      <p className="text-muted-foreground mb-4">Pick the one that fits best</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat, index) => {
                          const Icon = cat.icon;
                          return (
                            <Card
                              key={cat.value}
                              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 ${
                                field.value === cat.value
                                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                  : 'border-border bg-card'
                              }`}
                              onClick={() => field.onChange(cat.value)}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-lg transition-all duration-300 ${
                                  field.value === cat.value ? 'bg-primary/10 scale-110' : 'bg-muted'
                                }`}>
                                  <Icon className={`h-6 w-6 transition-all duration-300 ${
                                    field.value === cat.value ? 'text-primary' : 'text-muted-foreground'
                                  }`} />
                                </div>
                                <span className="font-medium transition-all duration-300">{cat.label}</span>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Intensity Level Selection */}
              <div className="space-y-4 animate-fade-in">
                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        How serious is this? <span className="text-destructive">*</span>
                      </FormLabel>
                      <p className="text-muted-foreground mb-4">Help us understand the urgency</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {intensityLevels.map((level, index) => (
                          <Card
                            key={level.value}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                              field.value === level.value
                                ? `${level.color} shadow-md border-2 scale-105`
                                : 'border-border bg-card hover:border-primary/30'
                            }`}
                            onClick={() => field.onChange(level.value)}
                            style={{ animationDelay: `${index * 75}ms` }}
                          >
                            <CardContent className="p-4 text-center transition-all duration-300">
                              <div className="font-semibold text-base mb-1">{level.label}</div>
                              <div className="text-xs opacity-80">{level.description}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <Card className="border-primary/20 shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold">
                          Tell us what happened <span className="text-destructive">*</span>
                        </FormLabel>
                        
                        {/* Input Mode Toggle */}
                        <div className="flex gap-2 mb-4">
                          <Button
                            type="button"
                            variant={inputMode === 'text' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setInputMode('text')}
                            className="flex-1 transition-all duration-300 hover:scale-105"
                          >
                            Text Input
                          </Button>
                          <Button
                            type="button"
                            variant={inputMode === 'voice' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setInputMode('voice')}
                            className="flex-1 transition-all duration-300 hover:scale-105"
                          >
                            <Mic className="mr-2 h-4 w-4" />
                            Voice Input
                          </Button>
                        </div>

                        <FormControl>
                          <div className="space-y-3">
                            {inputMode === 'text' ? (
                              <Textarea
                                placeholder="Please describe your concern in detail... We're here to listen and help."
                                className="min-h-40 resize-none transition-all duration-300 focus:scale-[1.01]"
                                {...field}
                              />
                            ) : (
                              <div className="space-y-3 animate-fade-in">
                                <div className="relative">
                                  <Textarea
                                    placeholder="Your spoken words will appear here..."
                                    className="min-h-40 resize-none bg-primary/5 transition-all duration-300"
                                    {...field}
                                    readOnly
                                  />
                                  {isRecording && (
                                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse shadow-lg">
                                      <Mic className="h-4 w-4 animate-pulse" />
                                      Recording...
                                    </div>
                                  )}
                                </div>
                                {isRecording && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={stopRecording}
                                    className="w-full transition-all duration-300 hover:scale-105 animate-fade-in"
                                  >
                                    Stop Recording
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        
                        <FormDescription>
                          {inputMode === 'voice' 
                            ? isRecording 
                              ? "🎤 Listening... Your words appear above. Switch to Text mode to stop."
                              : "Starting voice recording..."
                            : "Type your message here. Switch to Voice mode to speak instead."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Age Input */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold">How old are you?</FormLabel>
                        <p className="text-sm text-muted-foreground mb-2">You don't have to tell us if you don't want to</p>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="5" 
                            max="99" 
                            placeholder="Enter your age" 
                            className="max-w-xs"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location Input */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold">Where are you from?</FormLabel>
                        <p className="text-sm text-muted-foreground mb-2">Your school or area (optional)</p>
                        <FormControl>
                          <Input placeholder="e.g., Delhi Public School, Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Info for Named Reports */}
                  {!isAnonymous && (
                    <div className="space-y-4 p-6 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in transition-all duration-300">
                      <h3 className="font-semibold text-lg">Contact Information</h3>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Information</FormLabel>
                            <FormControl>
                              <Input placeholder="Email or phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
                <div className="flex items-start gap-3 p-5 bg-primary/5 rounded-xl border border-primary/20 transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  <Shield className="h-6 w-6 text-primary mt-0.5 flex-shrink-0 transition-all duration-300" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1 text-base">Your Security Matters</p>
                    <p className="text-muted-foreground">
                      All reports are encrypted with 256-bit encryption and stored securely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-5 bg-destructive/5 rounded-xl border border-destructive/20 transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  <Phone className="h-6 w-6 text-destructive mt-0.5 flex-shrink-0 transition-all duration-300" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1 text-base">Emergency? Call Now</p>
                    <p className="text-muted-foreground">
                      Childline: <strong>1098</strong> | Emergency: <strong>112</strong>
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in" 
                size="lg" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Submit Report Safely
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Report;
