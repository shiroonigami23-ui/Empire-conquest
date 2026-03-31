using System.Collections.Generic;
using UnityEngine;

namespace EmpireConquest.Gameplay
{
    public class EmpireBuildingSandbox : MonoBehaviour
    {
        [SerializeField] private float tileSize = 2.2f;
        [SerializeField] private int gridRadius = 8;

        private readonly Dictionary<Vector2Int, GameObject> _placed = new();
        private readonly Queue<Vector2Int> _freeSlots = new();
        private GameObject _townHall = null!;
        private bool _upgradePulse;
        private Vector3 _townHallBaseScale;

        private void Awake()
        {
            PrepareGrid();
            SeedBase();
        }

        private void Update()
        {
            if (!_upgradePulse || _townHall == null)
            {
                return;
            }

            var scale = 1f + (Mathf.Sin(Time.time * 10f) * 0.04f);
            _townHall.transform.localScale = _townHallBaseScale * scale;
        }

        public void SetUpgradePulse(bool active)
        {
            _upgradePulse = active;
            if (!active && _townHall != null)
            {
                _townHall.transform.localScale = _townHallBaseScale;
            }
        }

        public bool PlaceLaboratory() => PlaceBuilding("Laboratory", new Color(0.3f, 0.6f, 1f), new Vector3(2f, 1.4f, 2f));
        public bool PlaceArmyCamp() => PlaceBuilding("Army Camp", new Color(0.2f, 0.8f, 0.2f), new Vector3(2.8f, 0.5f, 2.8f));
        public bool PlaceBarrack() => PlaceBuilding("Barrack", new Color(0.95f, 0.55f, 0.25f), new Vector3(2.2f, 1.1f, 2.2f));
        public bool PlaceWall() => PlaceBuilding("Wall", new Color(0.75f, 0.75f, 0.75f), new Vector3(2f, 1.6f, 0.45f));
        public bool PlaceArcherTower() => PlaceBuilding("Archer Tower", new Color(0.85f, 0.75f, 0.42f), new Vector3(1.3f, 3.5f, 1.3f));
        public bool PlaceMortar() => PlaceBuilding("Mortar", new Color(0.35f, 0.35f, 0.35f), new Vector3(1.8f, 1.1f, 1.8f));

        private void PrepareGrid()
        {
            for (var x = -gridRadius; x <= gridRadius; x++)
            {
                for (var z = -gridRadius; z <= gridRadius; z++)
                {
                    _freeSlots.Enqueue(new Vector2Int(x, z));
                }
            }
        }

        private void SeedBase()
        {
            PlaceSpecific("Town Hall", new Color(1f, 0.85f, 0.1f), new Vector3(2.4f, 1.8f, 2.4f), new Vector2Int(0, 0));
            PlaceSpecific("Wall", new Color(0.75f, 0.75f, 0.75f), new Vector3(2f, 1.4f, 0.4f), new Vector2Int(1, 0));
            PlaceSpecific("Wall", new Color(0.75f, 0.75f, 0.75f), new Vector3(2f, 1.4f, 0.4f), new Vector2Int(-1, 0));
            PlaceSpecific("Wall", new Color(0.75f, 0.75f, 0.75f), new Vector3(0.4f, 1.4f, 2f), new Vector2Int(0, 1));
            PlaceSpecific("Wall", new Color(0.75f, 0.75f, 0.75f), new Vector3(0.4f, 1.4f, 2f), new Vector2Int(0, -1));
            _townHall = _placed[new Vector2Int(0, 0)];
            _townHallBaseScale = _townHall.transform.localScale;
        }

        private bool PlaceBuilding(string displayName, Color color, Vector3 scale)
        {
            while (_freeSlots.Count > 0)
            {
                var slot = _freeSlots.Dequeue();
                if (_placed.ContainsKey(slot))
                {
                    continue;
                }
                PlaceSpecific(displayName, color, scale, slot);
                return true;
            }
            return false;
        }

        private void PlaceSpecific(string displayName, Color color, Vector3 scale, Vector2Int gridPos)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
            go.name = displayName;
            go.transform.SetParent(transform, false);
            go.transform.position = new Vector3(gridPos.x * tileSize, scale.y * 0.5f, gridPos.y * tileSize);
            go.transform.localScale = scale;

            var renderer = go.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material = new Material(Shader.Find("Standard"));
                renderer.material.color = color;
            }

            _placed[gridPos] = go;
        }
    }
}
