# AdmitHub – Tamil Nadu College Admissions (black & gold theme)

Multi-college admission portal built from the the original admission-system SRS v1.0. Static site (HTML/CSS/JS), data kept in browser localStorage, so it runs anywhere and deploys free on GitHub Pages.
Colleges: SRM, VIT, CEG (Anna University), PSG, SSN, TCE, Velammal, Loyola, MCC, Stella Maris, Presidency.
NOTE: seats, cut-offs, fees and dates are SAMPLE data. Not affiliated with any listed institution.

## Run locally

Unzip -> double-click index.html (or: python -m http.server 8000 -> http://localhost:8000)

## Host on GitHub Pages

git init && git add . && git commit -m "AdmitHub" && git branch -M main
git remote add origin https://github.com/<user>/admithub.git && git push -u origin main
Repo -> Settings -> Pages -> Source: GitHub Actions. Live at https://<user>.github.io/admithub/

## Logins

admin@admithub.edu/admin123 · officer@admithub.edu/officer123 · accounts@admithub.edu/acc123
College heads (hod123): hod.srm, hod.vit, hod.ceg, hod.psg, hod.ssn, hod.tce, hod.vec, hod.loyola, hod.mcc, hod.stella, hod.pres @admithub.edu
Applicants register themselves (OTP shown on screen in demo mode).

## Workflow

Register(OTP) -> Apply (3 ranked college-programme choices, documents) -> Pay fee -> Officer verifies -> Merit -> Rank lists -> Allotment rounds -> College head approves -> Accept/Upgrade/Decline -> Admission fee -> Admission letter -> CSV export for SIS.
Demo: Admin > "Load 60 demo applicants" -> Officer > "Run allotment round" -> each college head > "Approve all".

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/surya-vec12">
        <img src="https://avatars.githubusercontent.com/u/351752823?v=4" width="100" height="100" alt="Surya"/><br />
        <sub><b>surya-vec12</b></sub>
      </a>
    </td>
  </tr>
</table>
