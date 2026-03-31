using EmpireConquest.Runtime;
using UnityEngine;

namespace EmpireConquest.Scenes
{
    public class ClanWarSceneController : MonoBehaviour
    {
        [SerializeField] private EmpireGameRuntime runtime = null!;

        private void Start()
        {
            if (runtime == null)
            {
                runtime = FindFirstObjectByType<EmpireGameRuntime>();
            }
            runtime.StartClanWar();
            SpawnArena();
        }

        private void SpawnArena()
        {
            var left = GameObject.CreatePrimitive(PrimitiveType.Cube);
            left.transform.position = new Vector3(-4f, 0.6f, 0f);
            left.transform.localScale = new Vector3(4f, 1.2f, 4f);
            var right = GameObject.CreatePrimitive(PrimitiveType.Cube);
            right.transform.position = new Vector3(4f, 0.6f, 0f);
            right.transform.localScale = new Vector3(4f, 1.2f, 4f);

            var l = left.GetComponent<Renderer>();
            if (l != null)
            {
                l.material = new Material(Shader.Find("Standard"));
                l.material.color = new Color(0.15f, 0.4f, 0.85f);
            }

            var r = right.GetComponent<Renderer>();
            if (r != null)
            {
                r.material = new Material(Shader.Find("Standard"));
                r.material.color = new Color(0.85f, 0.25f, 0.2f);
            }
        }
    }
}
