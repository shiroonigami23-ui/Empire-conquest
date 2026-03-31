using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace EmpireConquest.Gameplay
{
    public class BattleDirector : MonoBehaviour
    {
        [SerializeField] private int unitsPerSide = 8;
        [SerializeField] private float laneSpacing = 1.5f;
        [SerializeField] private float frontOffset = 15f;

        private readonly List<UnitActor> _teamA = new();
        private readonly List<UnitActor> _teamB = new();
        private bool _battleRunning;

        public bool BattleRunning => _battleRunning;

        private void Start()
        {
            SpawnBattleLines();
            _battleRunning = true;
        }

        private void Update()
        {
            if (!_battleRunning)
            {
                return;
            }

            TickTeam(_teamA, _teamB);
            TickTeam(_teamB, _teamA);

            var aliveA = _teamA.Count(u => u != null && u.IsAlive);
            var aliveB = _teamB.Count(u => u != null && u.IsAlive);
            if (aliveA == 0 || aliveB == 0)
            {
                _battleRunning = false;
                Debug.Log(aliveA > 0 ? "Team Blue wins." : "Team Orange wins.");
            }
        }

        private static void TickTeam(List<UnitActor> team, List<UnitActor> enemy)
        {
            foreach (var unit in team)
            {
                if (unit == null || !unit.IsAlive)
                {
                    continue;
                }
                var target = FindNearestAlive(unit.transform.position, enemy);
                if (target != null)
                {
                    unit.SetTarget(target);
                    unit.Tick(Time.deltaTime);
                }
            }
        }

        private static UnitActor FindNearestAlive(Vector3 pos, List<UnitActor> pool)
        {
            UnitActor nearest = null!;
            var best = float.MaxValue;
            foreach (var unit in pool)
            {
                if (unit == null || !unit.IsAlive)
                {
                    continue;
                }

                var dist = Vector3.Distance(pos, unit.transform.position);
                if (dist < best)
                {
                    best = dist;
                    nearest = unit;
                }
            }
            return nearest;
        }

        private void SpawnBattleLines()
        {
            for (var i = 0; i < unitsPerSide; i++)
            {
                var z = (i - unitsPerSide * 0.5f) * laneSpacing;
                _teamA.Add(CreateUnit(new Vector3(-frontOffset, 0.75f, z), 0, new Color(0.2f, 0.55f, 1f), i));
                _teamB.Add(CreateUnit(new Vector3(frontOffset, 0.75f, z), 1, new Color(1f, 0.45f, 0.2f), i));
            }
        }

        private UnitActor CreateUnit(Vector3 pos, int team, Color color, int laneIndex)
        {
            var type = laneIndex % 5;
            var primitive = type switch
            {
                0 => PrimitiveType.Capsule,   // swordsman
                1 => PrimitiveType.Cylinder,  // cavalry
                2 => PrimitiveType.Cube,      // armored unit
                3 => PrimitiveType.Sphere,    // witch
                _ => PrimitiveType.Capsule    // siege/others
            };

            var unitGo = GameObject.CreatePrimitive(primitive);
            unitGo.transform.SetParent(transform, false);
            unitGo.transform.position = pos;
            unitGo.name = team == 0 ? "BlueUnit" : "OrangeUnit";

            var actor = unitGo.AddComponent<UnitActor>();
            actor.Team = team;
            actor.Hp = type switch
            {
                2 => Random.Range(160f, 220f), // armored
                3 => Random.Range(85f, 120f),  // witch
                _ => Random.Range(95f, 145f)
            };
            actor.Attack = type switch
            {
                3 => Random.Range(16f, 24f),   // witch burst
                4 => Random.Range(20f, 30f),   // siege
                _ => Random.Range(9f, 16f)
            };
            actor.MoveSpeed = type switch
            {
                1 => Random.Range(4.6f, 5.8f), // cavalry
                4 => Random.Range(2.4f, 3.2f), // siege
                _ => Random.Range(3.2f, 4.8f)
            };
            actor.AttackRange = type == 3 || type == 4 ? 2.4f : 1.5f;
            actor.SetTeamColor(color);
            return actor;
        }
    }
}
