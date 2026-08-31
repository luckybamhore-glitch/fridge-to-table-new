// All favorites routes run behind `protect`, so req.user is always set.

// GET /api/favorites
export async function getFavorites(req, res, next) {
  try {
    return res.status(200).json({ savedRecipes: req.user.savedRecipes });
  } catch (err) {
    next(err);
  }
}

// POST /api/favorites/:recipeId/toggle
export async function toggleFavorite(req, res, next) {
  try {
    const { recipeId } = req.params;
    if (!recipeId) {
      return res.status(400).json({ message: 'recipeId is required.' });
    }

    const index = req.user.savedRecipes.indexOf(recipeId);
    let saved;
    if (index === -1) {
      req.user.savedRecipes.push(recipeId);
      saved = true;
    } else {
      req.user.savedRecipes.splice(index, 1);
      saved = false;
    }

    await req.user.save();
    return res.status(200).json({ savedRecipes: req.user.savedRecipes, saved });
  } catch (err) {
    next(err);
  }
}
