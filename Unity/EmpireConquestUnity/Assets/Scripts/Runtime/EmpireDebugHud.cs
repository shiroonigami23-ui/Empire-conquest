using System.Linq;
using EmpireConquest.Core;
using EmpireConquest.Runtime;
using UnityEngine;

namespace EmpireConquest.UnityRuntime
{
    public class EmpireDebugHud : MonoBehaviour
    {
        [SerializeField] private EmpireGameRuntime runtime = null!;
        private string _lastResult = "Ready";

        private void Awake()
        {
            if (runtime == null)
            {
                runtime = FindFirstObjectByType<EmpireGameRuntime>();
            }
        }

        private void OnGUI()
        {
            if (runtime == null)
            {
                GUI.Label(new Rect(10, 10, 400, 30), "EmpireGameRuntime not found in scene.");
                return;
            }

            var state = runtime.State;

            GUI.Box(new Rect(10, 10, 420, 340), "Empire Conquest Debug HUD");

            var y = 40;
            GUI.Label(new Rect(20, y, 380, 20), "Resources");
            y += 22;

            foreach (var kv in state.Resources.OrderBy(k => k.Key.ToString()))
            {
                GUI.Label(new Rect(20, y, 380, 20), $"{kv.Key}: {kv.Value:0.##}");
                y += 18;
                if (y > 180) break;
            }

            y = 190;
            if (GUI.Button(new Rect(20, y, 190, 28), "Build Gold Mine (slot 1)"))
            {
                _lastResult = runtime.Build("gold_mine", 1) ? "Built Gold Mine." : "Build failed.";
            }

            if (GUI.Button(new Rect(220, y, 190, 28), "Build Farm (slot 2)"))
            {
                _lastResult = runtime.Build("farm", 2) ? "Built Farm." : "Build failed.";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 190, 28), "Train 5 Warriors"))
            {
                _lastResult = runtime.Train("warrior", 5) ? "Trained Warriors." : "Training failed.";
            }

            if (GUI.Button(new Rect(220, y, 190, 28), "Start Mining Tech"))
            {
                _lastResult = runtime.StartResearch("improved_mining") ? "Research started." : "Research failed.";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 190, 28), "Battle Enemy Power 400"))
            {
                _lastResult = runtime.Battle(400) ? "Victory!" : "Defeat.";
            }

            GUI.Label(new Rect(20, y + 38, 380, 20), $"Result: {_lastResult}");
            GUI.Label(new Rect(20, y + 58, 380, 20), $"Researching: {state.ResearchingTechnologyId}");
        }
    }
}
