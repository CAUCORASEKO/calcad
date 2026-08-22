# CalcAd

CalcAd is a multilingual educational calculator for learning-oriented mathematics. It is designed not only to calculate results, but also to show the formulas used and explain the reasoning step by step.

## Features

CalcAd currently includes:

- **Loans** — constant-amortization and annuity loans
- **Contribution Margin** — contribution margin, result, and margin percentage
- **Indexes** — absolute and percentage change
- **Inflation** — total inflation, annual factor, and annual inflation
- **Probability** — probability from favorable and total cases
- **Equations** — linear and quadratic equations, including discriminant-based solutions
- **Trigonometry** — tangent and angle calculation from opposite and adjacent sides
- **Exponential Functions** — values, powers, and growth/decrease behavior

Every module displays its formula and provides a step-by-step explanation. The web interface is responsive and mobile-first, with a dark graphite, calculator-inspired design. Calculations run locally in the browser, and the service worker caches the application assets for offline use after the app has been loaded once.

## Platforms

- **Web / PWA** — the browser application in `web/`
- **Android** — the web app packaged with Capacitor
- **Desktop** — a Python application using the modules in `modules/`

There is currently no native iOS application in this repository.

## Languages

- English
- Spanish
- Finnish

## Android

The Android target uses Capacitor 8 with the following configuration:

- Application ID: `fi.aisosu.calcad`
- Minimum Android SDK: 24
- Target Android SDK: 36
- Compile SDK: 36

The Gradle project provides the standard Android App Bundle task, `bundleRelease`, for preparing a Google Play distribution build. Signing credentials and private release information are not included in this documentation.

## Development

Serve the web version locally:

```bash
python3 -m http.server 8080 --directory web
```

Open <http://localhost:8080> in a browser.

Synchronize the Capacitor Android project:

```bash
npx cap sync android
```

Build the Android project in debug mode:

```bash
cd android
./gradlew assembleDebug
```

Build an Android App Bundle for a configured release build:

```bash
cd android
./gradlew bundleRelease
```

Run the desktop application:

```bash
python3 main.py
```

## Project structure

- `web/` — web/PWA HTML, CSS, JavaScript, translations, manifest, service worker, and icon assets
- `android/` — Capacitor Android project and native Android resources
- `modules/` — Python implementations of the calculator modules
- `app.py` — desktop application shell, navigation, and language selection
- `translations.py` — desktop translation catalog and lookup helper

## Privacy

CalcAd performs calculations locally in the browser or desktop application. The implementation contains no application code that sends calculation inputs or results to a remote service, and the web app has no analytics or account system. The PWA service worker only caches local application assets.

## Status

CalcAd is under active development. The Android version is being prepared for distribution through Google Play.

## License

CalcAd is released under the [MIT License](LICENSE). Copyright © 2026 CAUCO70.

## Author

CAUCO
