import { db } from '@/db';
import { lessons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { markLessonComplete } from '@/actions/progress';
import { PronounceButton } from '@/components/PronounceButton';

export default async function A1LessonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const lessonId = parseInt(params.id, 10);
  
  if (isNaN(lessonId)) {
    redirect('/a1-course');
  }

  const lessonResults = await db.select().from(lessons).where(eq(lessons.id, lessonId));
  const lesson = lessonResults[0];

  if (!lesson || lesson.type !== 'video' || !lesson.content) {
    redirect('/a1-course');
  }

  const content: any = lesson.content;
  const videoId = content.videoId;
  const vocabList = content.vocab || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <Link href="/a1-course">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-semibold text-lg">{lesson.title}</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        
        {/* Video Player Section */}
        <section className="space-y-4">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {videoId ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <span className="mb-2">No video source available</span>
              </div>
            )}
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-2">About this lesson</h2>
            <p className="text-muted-foreground">{content.info}</p>
          </div>
        </section>

        {/* Vocabulary Section */}
        {vocabList.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold px-2">Key Vocabulary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vocabList.map((word: string, i: number) => (
                <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-medium text-lg">{word}</span>
                  </div>
                  <PronounceButton text={word} className="shrink-0 text-white/50 hover:text-amber-400" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Extended Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {content.summary && (
            <section className="glass-card rounded-2xl p-6 md:col-span-2">
              <h2 className="text-xl font-bold mb-3 text-amber-400">Chapter Summary</h2>
              <p className="text-muted-foreground leading-relaxed">{content.summary}</p>
            </section>
          )}

          {content.grammar && content.grammar.length > 0 && (
            <section className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-emerald-400">Grammar Focus</h2>
              <ul className="space-y-3">
                {content.grammar.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {content.tips && content.tips.length > 0 && (
            <section className="glass-card rounded-2xl p-6 border-l-4 border-l-orange-500 border-t-0 border-r-0 border-b-0">
              <h2 className="text-xl font-bold mb-4 text-orange-400">Tips & Tricks</h2>
              <ul className="space-y-3">
                {content.tips.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

      </main>

      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-4 z-50">
        <div className="max-w-4xl mx-auto flex justify-end">
          <form action={async () => {
            'use server';
            await markLessonComplete(lessonId);
            redirect('/a1-course');
          }}>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold gap-2 rounded-full px-8">
              <CheckCircle2 className="w-5 h-5" />
              Mark as Completed
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
