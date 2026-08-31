/**
 * All pantry routes run behind `protect`, so req.user is always set.
 * Pantry is embedded on the User document (small, always fetched with the
 * owner, no independent lifecycle) — see server/models/User.js.
 */

// GET /api/pantry
export async function getPantry(req, res, next) {
  try {
    return res.status(200).json({ pantry: req.user.pantry });
  } catch (err) {
    next(err);
  }
}

// POST /api/pantry  Body: { name }
export async function addPantryItem(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Ingredient name is required.' });
    }

    const trimmed = name.trim();
    const alreadyExists = req.user.pantry.some(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      return res.status(409).json({ message: 'Ingredient already in pantry.' });
    }

    req.user.pantry.push({ name: trimmed, addedAt: new Date() });
    await req.user.save();
    return res.status(201).json({ pantry: req.user.pantry });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/pantry/:name
export async function removePantryItem(req, res, next) {
  try {
    const targetName = decodeURIComponent(req.params.name).toLowerCase();
    req.user.pantry = req.user.pantry.filter(
      (item) => item.name.toLowerCase() !== targetName
    );
    await req.user.save();
    return res.status(200).json({ pantry: req.user.pantry });
  } catch (err) {
    next(err);
  }
}

// PUT /api/pantry  Body: { ingredients: string[] }
// Bulk replace — used when syncing a full local pantry list on first login.
export async function replacePantry(req, res, next) {
  try {
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'ingredients must be an array of strings.' });
    }

    const seen = new Set();
    const deduped = [];
    for (const raw of ingredients) {
      const trimmed = String(raw ?? '').trim();
      const key = trimmed.toLowerCase();
      if (trimmed && !seen.has(key)) {
        seen.add(key);
        deduped.push({ name: trimmed, addedAt: new Date() });
      }
    }

    req.user.pantry = deduped;
    await req.user.save();
    return res.status(200).json({ pantry: req.user.pantry });
  } catch (err) {
    next(err);
  }
}
