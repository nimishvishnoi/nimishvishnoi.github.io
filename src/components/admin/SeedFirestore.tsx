/**
 * SeedFirestore — one-click seed of all static portfolio data into Firestore.
 * Runs in the browser while the admin is authenticated, so Firestore rules pass.
 * Safe to run multiple times — uses setDoc with merge:true so it won't duplicate.
 */
import { useState } from 'react';
import { collection, doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { getDb } from '../../services/firebase.firestore';

// ─── Static data ──────────────────────────────────────────────────────────────
import { aboutContent } from '../../data/about';
import { skills, skillCategories } from '../../data/skills';
import { projects } from '../../data/projects';
import { experiences } from '../../data/experience';
import { education, summary } from '../../data/education';
import { achievements } from '../../data/achievements';
import { contactInfo, socialLinks } from '../../data/contact';

type SeedStatus = 'idle' | 'running' | 'done' | 'error';

interface SeedStep {
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

export function SeedFirestore() {
  const [status, setStatus] = useState<SeedStatus>('idle');
  const [steps, setSteps] = useState<SeedStep[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  function updateStep(index: number, stepStatus: SeedStep['status']) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status: stepStatus } : s)));
  }

  async function runSeed() {
    const stepDefs = [
      'portfolio/about',
      'portfolio/summary',
      'portfolio/contact',
      'portfolio/skillCategories',
      'skills collection',
      'projects collection',
      'experience collection',
      'education collection',
      'achievements collection',
      'socialLinks collection',
    ];

    setSteps(stepDefs.map((label) => ({ label, status: 'pending' })));
    setStatus('running');
    setErrorMsg('');

    try {
      const db = getDb();

      // ── Singleton docs ──────────────────────────────────────────────────────
      const singletons: [string, object][] = [
        ['about', aboutContent],
        ['summary', summary],
        ['contact', contactInfo],
        ['skillCategories', skillCategories],
      ];

      for (let i = 0; i < singletons.length; i++) {
        updateStep(i, 'running');
        const [key, data] = singletons[i];
        await setDoc(
          doc(db, 'portfolio', key),
          { ...data, updatedAt: serverTimestamp() },
          { merge: true }
        );
        updateStep(i, 'done');
      }

      // ── Collections ─────────────────────────────────────────────────────────
      async function seedCollection(stepIndex: number, colName: string, items: { id: string }[]) {
        updateStep(stepIndex, 'running');
        const batch = writeBatch(db);
        for (const item of items) {
          batch.set(
            doc(collection(db, colName), item.id),
            { ...item, updatedAt: serverTimestamp() },
            { merge: true } as Parameters<typeof batch.set>[2]
          );
        }
        await batch.commit();
        updateStep(stepIndex, 'done');
      }

      await seedCollection(4, 'skills', skills);
      await seedCollection(5, 'projects', projects);

      // Dates must be serialised as ISO strings for Firestore
      const serialisedExp = experiences.map((e) => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
      }));
      await seedCollection(6, 'experience', serialisedExp);

      const serialisedEdu = education.map((e) => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
      }));
      await seedCollection(7, 'education', serialisedEdu);

      await seedCollection(8, 'achievements', achievements);
      await seedCollection(9, 'socialLinks', socialLinks);

      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatus('error');
      // Mark any still-running step as error
      setSteps((prev) => prev.map((s) => (s.status === 'running' ? { ...s, status: 'error' } : s)));
    }
  }

  const statusIcon = (s: SeedStep['status']) => {
    if (s === 'done') return '✅';
    if (s === 'running') return '⏳';
    if (s === 'error') return '❌';
    return '○';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Seed Firestore</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Uploads all static portfolio data to Firestore so you can edit it from the Content tab.
          Safe to run multiple times — existing data is merged, not duplicated.
        </p>
      </div>

      {status === 'idle' && (
        <button
          onClick={runSeed}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          🚀 Seed All Content to Firestore
        </button>
      )}

      {status !== 'idle' && (
        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{statusIcon(step.status)}</span>
              <span
                className={
                  step.status === 'done'
                    ? 'text-green-600 dark:text-green-400'
                    : step.status === 'error'
                      ? 'text-red-500'
                      : 'text-gray-700 dark:text-gray-300'
                }
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-300">
          ✅ All content seeded successfully! Switch to the <strong>Content</strong> tab to start
          editing.
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300 space-y-2">
          <p>❌ Seed failed: {errorMsg}</p>
          <button
            onClick={runSeed}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
