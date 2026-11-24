# Contributing to PARTBASE

Thank you for contributing to PARTBASE. Follow these guidelines to set up your environment, write tests, and submit changes.

## 1. Quick Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhatcha2006-arch/PARTBASE.git
   cd PARTBASE
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed database with Chennai pilot data:**
   ```bash
   python seed.py
   # Or using Flask CLI:
   flask seed-data
   ```

5. **Start the local development server:**
   ```bash
   flask run --host=0.0.0.0 --port=5000 --debug
   ```

---

## 2. Running Test Suites

We enforce high test coverage across all blueprints, services, and models.

Run the complete test suite:
```bash
pytest tests/ -v
```

Run specific test modules:
```bash
pytest tests/test_jobs.py
pytest tests/test_moderation.py
pytest tests/test_payment.py
```

---

## 3. Commit Convention

Commit messages should follow Conventional Commits:
- `feat(scope): ...` for new features
- `fix(scope): ...` for bug fixes
- `test(scope): ...` for tests
- `docs(scope): ...` for documentation
- `refactor(scope): ...` for code quality improvements


## Pull Request Guidelines

1. Ensure branch names follow `feat/<feature-slug>` or `fix/<fix-slug>`.
2. All commits must include conventional commit prefixes.
3. Test suite must pass 100% via `pytest`.
