# Kelvin Imalenowa’s developer portfolio

I’m a creative software developer with a background in digital marketing and operations. I build full-stack web apps with the same questions I brought to websites and campaigns: who’s using this, what are they trying to do, and where might they get stuck?

[Live portfolio](https://kelvin.staticdomains.app/) · [GitHub profile](https://github.com/kelvinimalenowa) · [LinkedIn](https://www.linkedin.com/in/kelvin-imalenowa)

## Featured software

- **Web Seek · In development** — Business discovery, saved leads, outreach notes, and follow-up status for freelance web developers. [Source code](https://github.com/kelvinimalenowa/webseek)
- **Vinyl Room** — A full-stack music recommendation app with sign-in, upvotes, and Spotify album art. [Open app](https://vinyl-room.onrender.com/) · [Source code](https://github.com/kelvinimalenowa/vinyl-room)
- **Civical** — A community events board built with Express, Mongoose, and EJS. Visitors can browse upcoming events, and the app supports creating, viewing, editing, and deleting listings. [Open app](https://civical.onrender.com/) · [Source code](https://github.com/kelvinimalenowa/civical)

The site also includes the Flynn Digital Playbill, earlier software projects, and selected digital marketing work.

## Local preview

This is a static HTML, CSS, and JavaScript site. Serve it from the repository root with Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://127.0.0.1:8000/).

## Automatic deployment

The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) updates
the existing site at https://kelvin.staticdomains.app when site files are pushed
to `main`. It can also be started from GitHub’s Actions tab using **Run workflow**.

### One-time connection

1. Generate an API key in your paid Static.app account. Ensure the workspace
   containing `kelvin.staticdomains.app` is active.
2. In this GitHub repository, open **Settings → Secrets and variables → Actions**.
   Create a repository secret named `STATIC_API_KEY` containing that key.
3. Commit and push the workflow and the site files, including any new images.
4. Open **Actions → Deploy portfolio to Static.app** and check the deployment result.

The workflow finds the existing site by its exact hostname and requires a single
match before uploading. It packages committed `index.html`, `assets/`, and
`images/`. The API key belongs in GitHub Secrets.

The deployment uses Static.app’s documented
[site listing and ZIP upload API](https://static.app/api/docs).
