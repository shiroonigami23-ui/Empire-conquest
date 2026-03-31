# Free Asset Import Guide (Unity)

Use these free packs to quickly replace primitive placeholders.

## Recommended Free Sources

- Kenney (CC0): https://kenney.nl/assets
- OpenGameArt (check license per pack): https://opengameart.org/
- Quaternius (free 3D packs): https://quaternius.com/

## Suggested Packs For This Project

- Buildings / base kit: castle, medieval, or strategy building packs.
- Units: low-poly soldiers/knights/archers packs.
- Walls and props: medieval walls/fences/towers.
- Pets: dragon + bear creature packs.
- FX: magic spells, projectile trails, impact particles.
- Music:
  - Calm loop for base mode
  - Intense battle loop for combat mode

## Folder Targets In This Project

- Building models/prefabs: `Assets/Art/Buildings/`
- Unit models/prefabs: `Assets/Art/Units/`
- Environment: `Assets/Art/Environment/`
- General music/sfx: `Assets/Audio/Music/` and `Assets/Audio/SFX/`
- Auto-loaded music clips (optional):
  - `Assets/Resources/Audio/Music/calm_loop.wav`
  - `Assets/Resources/Audio/Music/battle_loop.wav`

If these clip names exist, `MusicDirector` loads them automatically.

## Integration Notes

- Current gameplay is already working with primitive placeholders.
- Replace spawned primitives with your imported prefabs inside:
  - `EmpireBuildingSandbox` (buildings/walls)
  - `BattleDirector` / `UnitActor` (units/combat visuals)
- Hero/pet data and ability hooks are in:
  - `Assets/Scripts/Runtime/EmpireGameRuntime.cs`
  - `Assets/Scripts/Core/GameServices.cs`
- Keep collider and scale normalized for reliable movement/combat.
