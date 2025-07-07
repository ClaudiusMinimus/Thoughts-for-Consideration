# SVG Template and UI Guide for Phrase Set Export

## 1. Creating an SVG Template (Inkscape or Similar)

### **A. Design Your Template**
- Open Inkscape (or your preferred SVG editor).
- Design your layout for a single phrase entry (or for a full set, as desired).
- Use **text objects** for each field you want to populate (e.g., Letter, Title, Reference, Phrase, ReferenceURL).

### **B. Use Placeholders**
- In each text object, use a unique placeholder wrapped in curly braces, e.g.:
  - `{Letter}`
  - `{Title}`
  - `{Reference}`
  - `{Phrase}`
  - `{ReferenceURL}`
- Style and position these placeholders as you want them to appear in the final PDF.

### **C. Save Your Template**
- Save your file as `template.svg` (or any name you prefer).
- Make sure the SVG is **plain SVG** (not Inkscape SVG) for best compatibility.

### **D. Example SVG Snippet**
```xml
<text x="20" y="40" font-size="24">{Letter}</text>
<text x="60" y="40" font-size="24">{Title}</text>
<text x="20" y="80" font-size="16">{Reference}</text>
<text x="20" y="120" font-size="14">{Phrase}</text>
<text x="20" y="160" font-size="12">{ReferenceURL}</text>
```

---

## 2. UI Requirements for End Users

### **A. Phrase Set Selection and Generation**
- User selects a phrase set (e.g., Original, Christlike Living, etc.).
- User enters a name (must contain at least one alphabetical character).
- User clicks **Generate** to display the personalized phrase set.

### **B. Download Options**
- After generating, user sees download options:
  - **CSV** (enabled)
  - **TXT, ODT, DOCX** (disabled for now)
  - **SVG/PDF** (to be enabled when SVG template is supported)

### **C. SVG/PDF Export Flow**
- User clicks **Download SVG** or **Download PDF** (when available).
- The app:
  1. Loads the SVG template.
  2. Replaces all placeholders with the actual phrase data for each letter.
  3. (If PDF) Converts the populated SVG to PDF.
  4. Triggers a download for the user.

### **D. User Customization (Optional)**
- User can select a different phrase for each letter from alternate sets.
- The exported SVG/PDF will reflect these customizations.

### **E. Session Saving (Optional)**
- User can save their generated output and template selection to localStorage.
- User can restore their session on a future visit.

---

## 3. Tips for Template Designers
- Use clear, unique placeholders for each field.
- Avoid overlapping text objects.
- Test your SVG by opening it in a browser to ensure placeholders are visible.
- Keep the SVG simple for best compatibility with automated scripts.

---

## 4. Example Workflow
1. Designer creates `template.svg` with placeholders.
2. User generates phrases and customizes as desired.
3. User clicks **Download PDF**.
4. App fills in the SVG, converts to PDF, and downloads the result.

---

## 5. Future Enhancements
- Support for multiple SVG templates.
- User-uploaded SVG templates.
- Advanced formatting (fonts, colors, images).
- Batch export for multiple names. 