/**
 * Settings tab — two actions:
 *
 * 1. Sync from JSON  — reads src/data/site-content.json (bundled at build time)
 *    and pushes every field to Firestore. Use this when you've edited the JSON
 *    and want to push all changes at once.
 *
 * 2. Seed from static TS — same as above but reads the individual TS data files.
 *    Useful as a first-time setup or reset.
 *
 * Both are safe to run multiple times (merge: true).
 */
import { useState } from 'react';
import { collection, doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { getDb } from '../../services/firebase.firestore';

// ─── JSON source of truth ─────────────────────────────────────────────────────
import siteContent from '../../data/site-content.json';

// ─── TS static data (fallback seed source) ────────────────────────────────────
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

const STEP_LABELS = [
  'portfolio/about',
  'portfolio/summary',
  'portfolio/contact',
  'portfolio/skillCategories',
  'skills',
  'projects',
  'experience',
  'education',
  'achievements',
  'socialLinks',
];

export function SeedFirestore() {
  const [status, setStatus] = useState<SeedStatus>('idle');
  const [steps, setSteps] = useState<SeedStep[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'json' | 'ts'>('json');

  function initSteps() {
    setSteps(STEP_LABELS.map((label) => ({ label, status: 'pending' })));
    setStatus('running');
    setErrorMsg('');
  }

  function updateStep(index: number, s: SeedStep['status']) {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, status: s } : step)));
  }

  async function runSeed() {
    initSteps();
    const db = getDb();

    try {
      // ── Resolve data source ────────────────────────────────────────────────
      const src = mode === 'json' ? siteContent : null;

      const aboutData = src?.about ?? aboutContent;
      const summaryData = src?.summary ?? summary;
      const contactData = src?.contact ?? contactInfo;
      const skillCatData = src?.skillCategories ?? skillCategories;
      const skillsData = src?.skills ?? skills;
      const projectsData = src?.projects ?? projects;
      const achievementsData = src?.achievements ?? achievements;
      const socialLinksData = src?.socialLinks ?? socialLinks;

      // Experience & education: JSON has ISO strings, TS has Date objects
      const experienceData =
        src?.experience ??
        experiences.map((e: unknown) => {
          const ex = e as { startDate: Date; endDate?: Date; [k: string]: unknown };
          return {
            ...ex,
            startDate: ex.startDate.toISOString(),
            endDate: ex.endDate ? ex.endDate.toISOString() : null,
          };
        });

      const educationData =
        src?.education ??
        education.map((e: unknown) => {
          const ed = e as { startDate: Date; endDate: Date; [k: string]: unknown };
          return {
            ...ed,
            startDate: ed.startDate.toISOString(),
            endDate: ed.endDate.toISOString(),
          };
        });

      // ── Singletons ────────────────────────────────────────────────────────
      const singletons: [number, string, object][] = [
        [0, 'about', aboutData],
        [1, 'summary', summaryData],
        [2, 'contact', contactData],
        [3, 'skillCategories', skillCatData],
      ];

      for (const [i, key, data] of singletons) {
        updateStep(i, 'running');
        await setDoc(
          doc(db, 'portfolio', key),
          { ...data, updatedAt: serverTimestamp() },
          { merge: true }
        );
        updateStep(i, 'done');
      }

      // ── Collections ───────────────────────────────────────────────────────
      async function seedCol(stepIdx: number, colName: string, items: { id: string }[]) {
        updateStep(stepIdx, 'running');
        // Firestore batch limit is 500 writes; chunk if needed
        const chunks: { id: string }[][] = [];
        for (let i = 0; i < items.length; i += 400) chunks.push(items.slice(i, i + 400));
        for (const chunk of chunks) {
          const batch = writeBatch(db);
          for (const item of chunk) {
            batch.set(
              doc(collection(db, colName), item.id),
              { ...item, updatedAt: serverTimestamp() },
              { merge: true } as Parameters<typeof batch.set>[2]
            );
          }
          await batch.commit();
        }
        updateStep(stepIdx, 'done');
      }

      await seedCol(4, 'skills', skillsData as { id: string }[]);
      await seedCol(5, 'projects', projectsData as { id: string }[]);
      await seedCol(6, 'experience', experienceData as { id: string }[]);
      await seedCol(7, 'education', educationData as { id: string }[]);
      await seedCol(8, 'achievements', achievementsData as { id: string }[]);
      await seedCol(9, 'socialLinks', socialLinksData as { id: string }[]);

      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatus('error');
      setSteps((prev) => prev.map((s) => (s.status === 'running' ? { ...s, status: 'error' } : s)));
    }
  }

  const icon = (s: SeedStep['status']) =>
    ({ done: '✅', running: '⏳', error: '❌', pending: '○' })[s];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Sync Content to Firestore
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Push portfolio content into Firestore so it can be edited from the Content tab. Safe to
          run multiple times — data is merged, never duplicated.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 space-y-1">
        <p className="font-medium">💡 Workflow for bulk updates</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-400">
          <li>
            Edit{' '}
            <code className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">
              src/data/site-content.json
            </code>{' '}
            with your changes
          </li>
          <li>Deploy / rebuild the app (or just run locally)</li>
          <li>
            Come back here and click <strong>Sync from JSON</strong>
          </li>
          <li>All changes are live in Firestore instantly</li>
        </ol>
      </div>

      {/* Source selector */}
      {status === 'idle' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <label
              className={`flex-1 flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${mode === 'json' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'}`}
            >
              <input
                type="radio"
                name="mode"
                value="json"
                checked={mode === 'json'}
                onChange={() => setMode('json')}
                className="mt-0.5"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Sync from JSON</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Reads <code className="font-mono">site-content.json</code> — use after editing the
                  file
                </p>
              </div>
            </label>

            <label
              className={`flex-1 flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${mode === 'ts' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'}`}
            >
              <input
                type="radio"
                name="mode"
                value="ts"
                checked={mode === 'ts'}
                onChange={() => setMode('ts')}
                className="mt-0.5"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Seed from TS files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Reads individual <code className="font-mono">data/*.ts</code> files — good for
                  first-time setup
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={runSeed}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            🚀 {mode === 'json' ? 'Sync from JSON' : 'Seed from TS files'}
          </button>
        </div>
      )}

      {/* Progress */}
      {status !== 'idle' && (
        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{icon(step.status)}</span>
              <span
                className={
                  step.status === 'done'
                    ? 'text-green-600 dark:text-green-400'
                    : step.status === 'error'
                      ? 'text-red-500'
                      : step.status === 'running'
                        ? 'text-teal-600 dark:text-teal-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                }
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-300 space-y-3">
          <p>✅ All content synced to Firestore successfully!</p>
          <button
            onClick={() => {
              setStatus('idle');
              setSteps([]);
            }}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg"
          >
            Run Again
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300 space-y-3">
          <p>❌ Sync failed: {errorMsg}</p>
          <div className="flex gap-2">
            <button
              onClick={runSeed}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => {
                setStatus('idle');
                setSteps([]);
              }}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-white px-4 py-1.5 rounded-lg text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
