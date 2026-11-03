# Mind Explorer 4.0 — Wisdom & Insight Studio

An interactive, privacy-conscious Buddhist psychology learning platform built as a static GitHub Pages app.

**Live site:** https://obiwandac0-d.github.io/Budhism-Psychology/

## What's included

The original **Emotion Explorer**, **Wisdom Library**, **Learning Lab 3.0**, and **Practice** sections remain available. The new **Insight Studio** provides:

| Module | What it does |
| --- | --- |
| Overview | Daily learning hub, review queue, course progress, and recorded practice time |
| Recall | Confidence-rated, locally scheduled reviews using the existing 28-question concept bank |
| Dhamma Atlas | Interactive breakdowns of the Twelve Links, Five Aggregates, Four Truths, Five Hindrances, Seven Awakening Factors, and Eightfold Path |
| Mind Simulator | Three branching scenarios plus an explicitly hypothetical factor visualization |
| Research | Searchable glossary of 38 Pali terms and 16 canonical discourse references |
| Comparisons | Six careful comparisons between Buddhist concepts and approaches in modern psychology |
| Journal | Local reflection entries, feeling-tone labels, tags, search, edit/delete, and CSV export |
| Assessments | Matching, ordering, and honest self-assessed short-answer recall |
| Analytics | Actual review attempts, question accuracy, confidence statistics, and meditation logs |
| Meditation | Configurable sitting, walking, goodwill, and impermanence practice with an optional 4–7 BPM visual breath cue |
| Settings | Light/dark theme, JSON backup/import, local data controls, and app installation guidance |

## Technology

No build tooling, backend, account, or dependency framework is necessary. The app uses plain HTML, CSS, and JavaScript.

- `index.html`: entrypoint and original modules
- `wisdom-details.js`: extended Wisdom Library lessons
- `learning-data.js`, `learning-lab.js`: Learning Lab 3.0
- `studio-content.js`: Buddhist frameworks, sources, glossary, scenarios, modern comparisons
- `studio-core.js`: navigation, browser-local data, theme and shared functions
- `studio-learn.js`: review scheduler, diagrams, assessments, analytics
- `studio-explore.js`: simulator, research, psychology comparisons
- `studio-reflect.js`: journal and meditation
- `studio-settings.js`: backups, import/export, installation controls
- `studio.css`: responsive Studio design and dark theme
- `manifest.webmanifest`, `service-worker.js`, `icon*.png`, `icon.svg`: installable/offline-capable app shell

## Offline access and installation

Open the GitHub Pages site online first. After the service worker successfully installs, bundled application code and educational summaries can be available without an internet connection. External canonical texts and research links still require access to their host websites. Browser support and installation prompts vary.

To install, use your browser's **Install app** option, or **Add to Home Screen** on supported mobile browsers. The Settings page includes guidance.

## Privacy and backups

Review schedules, scores, notes and practice logs are stored using the browser's **localStorage** on the current origin. There is no server-side data sync. The app does not send your journal entries to an analytics provider.

**LocalStorage is not encrypted.** Other users of the same browser profile may be able to access it; clearing browser data or changing devices can erase it. Export a backup under **Insight Studio → Settings** and store it securely. JSON backups contain readable journal text. Backups import only after confirmation. CSV exports are available for journal entries, reviews, assessments and practice sessions.

Earlier Wisdom Library bookmarks and Learning Lab progress are preserved and included in a full backup when present.

## Scientific and traditional qualifications

- The adaptive review intervals are a **heuristic** based on success, confidence and prior interval, not an experimentally validated memory score or clinical assessment.
- The Mind Simulator offers **illustrative** scenarios. Its factor slider weights and 0–100 score are invented as a conceptual teaching aid, not a psychometric or causal model.
- In-app quiz accuracy measures recall of this app's small question pool; it does not establish long-term retention or spiritual attainment.
- Traditional Buddhist doctrines and modern psychological constructs may share helpful analogies but should not be treated as identical.
- Primary-source summaries are paraphrased; translations differ, and interpretations vary across Buddhist traditions.
- Contemplative practices can be uncomfortable or distressing for some people. Modify or stop practice if needed. Nothing here diagnoses or treats a mental-health condition.

## Reading references

- [SuttaCentral: original texts, translations and parallels](https://suttacentral.net/)
- [Dhamma Talks: translations of early Buddhist discourses](https://www.dhammatalks.org/suttas/)
- [SN 56.11: Four Noble Truths](https://suttacentral.net/sn56.11)
- [SN 12.2: Dependent Origination](https://suttacentral.net/sn12.2)
- [NCCIH: Meditation and Mindfulness—Effectiveness and Safety](https://www.nccih.nih.gov/health/meditation-and-mindfulness-effectiveness-and-safety)
- [Macri & Rogge (2024): ACT psychological flexibility review](https://pubmed.ncbi.nlm.nih.gov/38615492/)

## Running locally

Serve this directory with any static HTTP server (service workers are typically restricted to HTTPS or localhost):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser.

## License

MIT — see [LICENSE](LICENSE).
