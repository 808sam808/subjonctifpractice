# Deploying Subjonctif Coach on Render

## 🚀 Option 1: Static Site (Recommended)

### Step-by-step:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/subjonctif-coach.git
   git push -u origin main
   ```

2. **Go to [render.com](https://render.com)** and sign up / log in with GitHub

3. **Create a new Static Site**
   - Click **"New"** → **"Static Site"**
   - Connect your GitHub repo
   - Settings:
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
   - Click **"Create Static Site"**

4. **Done!** Render will build and deploy. You'll get a URL like:
   `https://subjonctif-coach.onrender.com`

---

## 🐍 Option 2: With Python Backend (if you want a real API later)

If you want to move the verb logic to a real Python/Flask backend:

### Project Structure:
```
├── backend/
│   ├── app.py           # Flask API
│   ├── requirements.txt # Python deps
│   └── verbs.py         # Verb data
├── src/                 # React frontend
├── package.json
├── render.yaml          # Render config
└── vite.config.ts
```

### render.yaml for full-stack:
```yaml
services:
  - type: web
    name: subjonctif-api
    runtime: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: "3.11.0"

  - type: web
    name: subjonctif-coach
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
```

### backend/app.py (example):
```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from verbs import VERBS

app = Flask(__name__)
CORS(app)

@app.route("/api/verb")
def get_random_verb():
    verb = random.choice(VERBS)
    return jsonify({
        "infinitive": verb["infinitive"],
        "translation": verb["translation"],
        "group": verb["group"],
        "stemHint": verb.get("stemHint"),
    })

@app.route("/api/check", methods=["POST"])
def check_conjugation():
    data = request.json
    infinitive = data["infinitive"]
    person = data["person"]
    answer = data["answer"].strip().lower()
    
    verb = next(v for v in VERBS if v["infinitive"] == infinitive)
    correct_answers = verb["subjunctive"][person]
    
    return jsonify({
        "correct": answer in correct_answers,
        "expected": correct_answers,
    })

if __name__ == "__main__":
    app.run(debug=True)
```

### backend/requirements.txt:
```
flask==3.0.0
flask-cors==4.0.0
gunicorn==21.2.0
```

---

## 💡 Tips

- **Free tier:** Render's free static sites are fast and unlimited
- **Custom domain:** Add your own domain in Render dashboard → Settings
- **Auto-deploy:** Render auto-deploys on every push to main
- **PR previews:** Render creates preview deploys for pull requests
